const express = require('express');
const {
  getAllCourses,
  getByID,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../app/controllers/course.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Lấy danh sách tất cả môn học
 *     description: Trả về danh sách tất cả các môn học trong hệ thống. Không yêu cầu xác thực.
 *     responses:
 *       200:
 *         description: Lấy danh sách môn học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách môn học thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
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
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Lấy thông tin môn học theo ID
 *     description: Trả về thông tin chi tiết của một môn học dựa trên ID. Không yêu cầu xác thực.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của môn học
 *     responses:
 *       200:
 *         description: Lấy thông tin môn học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin môn học thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     CourseId:
 *                       type: integer
 *                     CourseCode:
 *                       type: string
 *                     CourseName:
 *                       type: string
 *                     Credits:
 *                       type: integer
 *                     DepartmentId:
 *                       type: integer
 *       404:
 *         description: Môn học không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getByID);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Tạo môn học mới
 *     description: Tạo một môn học mới trong hệ thống. Yêu cầu xác thực token và quyền Admin.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CourseCode
 *               - CourseName
 *               - Credits
 *               - DepartmentId
 *             properties:
 *               CourseCode:
 *                 type: string
 *                 maxLength: 20
 *                 description: Mã môn học (duy nhất)
 *                 example: "IT101"
 *               CourseName:
 *                 type: string
 *                 maxLength: 150
 *                 description: Tên môn học
 *                 example: "Lập trình Web"
 *               Credits:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Số tín chỉ (1-10)
 *                 example: 3
 *               DepartmentId:
 *                 type: integer
 *                 description: ID của khoa/bộ môn
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo môn học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tạo môn học thành công"
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc mã môn học đã tồn tại
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (không phải Admin)
 *       500:
 *         description: Lỗi server
 */
router.post('/', verifyToken, isAdmin, createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     tags:
 *       - Courses
 *     summary: Cập nhật thông tin môn học
 *     description: Cập nhật thông tin của một môn học. Yêu cầu xác thực token và quyền Admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của môn học cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CourseCode:
 *                 type: string
 *                 maxLength: 20
 *                 description: Mã môn học mới (tùy chọn)
 *               CourseName:
 *                 type: string
 *                 maxLength: 150
 *                 description: Tên môn học mới (tùy chọn)
 *               Credits:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Số tín chỉ mới (1-10, tùy chọn)
 *               DepartmentId:
 *                 type: integer
 *                 description: ID khoa/bộ môn mới (tùy chọn)
 *     responses:
 *       200:
 *         description: Cập nhật môn học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật môn học thành công"
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (không phải Admin)
 *       404:
 *         description: Môn học không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', verifyToken, isAdmin, updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     tags:
 *       - Courses
 *     summary: Xóa môn học
 *     description: Xóa một môn học khỏi hệ thống. Yêu cầu xác thực token và quyền Admin. Không thể xóa nếu còn có lớp học phần tham chiếu.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của môn học cần xóa
 *     responses:
 *       200:
 *         description: Xóa môn học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Xóa môn học thành công"
 *                 data:
 *                   type: object
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (không phải Admin)
 *       404:
 *         description: Môn học không tồn tại
 *       409:
 *         description: Không thể xóa - còn có lớp học phần tham chiếu
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', verifyToken, isAdmin, deleteCourse);

module.exports = router;
