const express = require('express');
const router = express.Router();
const { getMyClasses, getAllClasses, getClassById, createClass, updateClass, deleteClass } = require('../app/controllers/class.controller');
const { verifyToken, isTeacher, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/classes/my-classes:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Lấy danh sách lớp của giảng viên hiện tại
 *     description: Lấy danh sách tất cả các lớp học phần mà giảng viên đang phụ trách. Yêu cầu xác thực token và quyền Giảng viên.
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
 *                   example: 2
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ClassId:
 *                         type: integer
 *                         example: 1
 *                       ClassCode:
 *                         type: string
 *                         example: "CS101-01"
 *                       CourseId:
 *                         type: integer
 *                         example: 5
 *                       CourseCode:
 *                         type: string
 *                         example: "CS101"
 *                       CourseName:
 *                         type: string
 *                         example: "Lập trình C++"
 *                       Credits:
 *                         type: integer
 *                         example: 3
 *                       DepartmentId:
 *                         type: integer
 *                         example: 2
 *                       DepartmentName:
 *                         type: string
 *                         example: "Công Nghệ Thông Tin"
 *                       Semester:
 *                         type: string
 *                         example: "2024-2"
 *                       MaxStudents:
 *                         type: integer
 *                         example: 40
 *                       EnrolledCount:
 *                         type: integer
 *                         example: 35
 *                       Status:
 *                         type: string
 *                         example: "Open"
 *                       IsFull:
 *                         type: integer
 *                         example: 0
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       403:
 *         description: Không có quyền truy cập (không phải giảng viên)
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/my-classes', verifyToken, isTeacher, getMyClasses);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllClasses);
router.get('/:classId', verifyToken, getClassById);
router.post('/', verifyToken, isAdmin, createClass);
router.put('/:classId', verifyToken, isAdmin, updateClass);
router.delete('/:classId', verifyToken, isAdmin, deleteClass);

module.exports = router;
