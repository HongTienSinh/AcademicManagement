const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getByID,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../app/controllers/departments.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/departments:
 *   get:
 *     tags: [Departments]
 *     summary: Lấy danh sách khoa
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Department' } }
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       403:
 *         description: Không có quyền truy cập (không phải Admin)
 *   post:
 *     tags: [Departments]
 *     summary: Tạo khoa mới
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [DepartmentCode, DepartmentName]
 *             properties:
 *               DepartmentCode: { type: string, example: "CNTT" }
 *               DepartmentName: { type: string, example: "Công Nghệ Thông Tin" }
 *     responses:
 *       201:
 *         description: Tạo khoa thành công
 *       400:
 *         description: Thiếu dữ liệu hoặc mã khoa đã tồn tại
 *       403:
 *         description: Không có quyền truy cập (không phải Admin)
 */
router.get('/', verifyToken, isAdmin, getAllDepartments);
router.post('/', verifyToken, isAdmin, createDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     tags: [Departments]
 *     summary: Lấy thông tin một khoa theo ID
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Department' }
 *       404:
 *         description: Không tìm thấy khoa
 *   put:
 *     tags: [Departments]
 *     summary: Cập nhật khoa
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DepartmentCode: { type: string }
 *               DepartmentName: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Khoa không tồn tại
 *   delete:
 *     tags: [Departments]
 *     summary: Xóa khoa
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Khoa không tồn tại
 *       409:
 *         description: Không thể xóa vì còn môn học tham chiếu
 */
router.get('/:id', verifyToken, isAdmin, getByID);
router.put('/:id', verifyToken, isAdmin, updateDepartment);
router.delete('/:id', verifyToken, isAdmin, deleteDepartment);

module.exports = router;