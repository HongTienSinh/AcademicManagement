const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require('../app/controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (có phân trang và tìm kiếm)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang (mặc định 1)
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số bản ghi trên một trang (mặc định 10)
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo FullName hoặc Username
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       UserId:
 *                         type: string
 *                       Username:
 *                         type: string
 *                       FullName:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       IsActive:
 *                         type: boolean
 *                       RoleId:
 *                         type: integer
 *                       RoleName:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 search:
 *                   type: string
 *                   description: Từ khóa tìm kiếm (nếu có)
 *       403:
 *         description: Không có quyền (yêu cầu Admin)
 */
router.get('/', verifyToken, isAdmin, getUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Lấy thông tin chi tiết một người dùng
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get('/:userId', verifyToken, isAdmin, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tạo tài khoản người dùng mới
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               roleId:
 *                 type: integer
 *                 example: 1
 *                 description: 1=Admin, 2=Teacher, 3=Student
 *             required:
 *               - username
 *               - password
 *               - fullName
 *               - email
 *               - roleId
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc tài khoản đã tồn tại
 *       403:
 *         description: Không có quyền (yêu cầu Admin)
 */
router.post('/', verifyToken, isAdmin, createUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               roleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       403:
 *         description: Không có quyền (yêu cầu Admin)
 */
router.put('/:userId', verifyToken, isAdmin, updateUser);

/**
 * @swagger
 * /api/users/{userId}/status:
 *   patch:
 *     summary: Cập nhật trạng thái hoạt động của người dùng (đảo ngược Active/Inactive)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Người dùng không tồn tại
 *       403:
 *         description: Không có quyền (yêu cầu Admin)
 */
router.patch('/:userId/status', verifyToken, isAdmin, updateUserStatus);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Xóa tài khoản người dùng
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa tài khoản thành công
 *       404:
 *         description: Người dùng không tồn tại
 *       400:
 *         description: Không thể xóa vì có dữ liệu liên quan
 *       403:
 *         description: Không có quyền (yêu cầu Admin)
 */
router.delete('/:userId', verifyToken, isAdmin, deleteUser);

module.exports = router;
