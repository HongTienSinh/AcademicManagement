const express = require('express');
const router = express.Router();
const { getMyClasses } = require('../app/controllers/class.controller');
const { verifyToken, isTeacher } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/classes/my-classes
 * @desc    Lấy danh sách các lớp mà giảng viên đang phụ trách
 * @access  Private - Giảng viên (RoleId = 2)
 * @auth    Yêu cầu JWT token hợp lệ trong header Authorization: Bearer <token>
 * 
 * @swagger
 * /api/classes/my-classes:
 *   get:
 *     summary: Lấy danh sách lớp của giảng viên hiện tại
 *     tags: [Classes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách lớp thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 3
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ClassId:
 *                         type: integer
 *                       ClassCode:
 *                         type: string
 *                       CourseId:
 *                         type: integer
 *                       CourseCode:
 *                         type: string
 *                       CourseName:
 *                         type: string
 *                       Credits:
 *                         type: integer
 *                       DepartmentId:
 *                         type: integer
 *                       DepartmentName:
 *                         type: string
 *                       Semester:
 *                         type: string
 *                       MaxStudents:
 *                         type: integer
 *                       EnrolledCount:
 *                         type: integer
 *                       Status:
 *                         type: string
 *                       IsFull:
 *                         type: boolean
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       403:
 *         description: Không có quyền truy cập (không phải giảng viên)
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/my-classes', verifyToken, isTeacher, getMyClasses);

module.exports = router;
