const express = require('express');
const router = express.Router();
const { enrollClass } = require('../app/controllers/enrollment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /enrollments:
 *   post:
 *     tags:
 *       - Enrollments
 *     summary: Đăng ký học phần
 *     description: Sinh viên đăng ký vào một lớp học phần. Yêu cầu xác thực (Bearer Token).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ClassId
 *             properties:
 *               ClassId:
 *                 type: integer
 *                 description: ID của lớp học phần muốn đăng ký
 *                 example: 5
 *           examples:
 *             valid:
 *               summary: Yêu cầu hợp lệ
 *               value:
 *                 ClassId: 5
 *     responses:
 *       201:
 *         description: Đăng ký thành công
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
 *                   example: Đăng ký thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     ClassId:
 *                       type: integer
 *                       example: 5
 *                     StudentId:
 *                       type: string
 *                       format: uuid
 *                       example: 550e8400-e29b-41d4-a716-446655440000
 *                     EnrollmentDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-05-21T14:30:00.000Z
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *             examples:
 *               classNotFound:
 *                 summary: Lớp không tồn tại hoặc đã đóng
 *                 value:
 *                   success: false
 *                   message: Lớp không tồn tại hoặc đã đóng
 *               classFull:
 *                 summary: Lớp đã đủ sĩ số
 *                 value:
 *                   success: false
 *                   message: Lớp đã đủ sĩ số
 *               alreadyEnrolled:
 *                 summary: Sinh viên đã đăng ký lớp này
 *                 value:
 *                   success: false
 *                   message: Bạn đã đăng ký lớp học này rồi
 *               missingClassId:
 *                 summary: ClassId là bắt buộc
 *                 value:
 *                   success: false
 *                   message: ClassId là bắt buộc
 *       401:
 *         description: Không xác thực - Token không hợp lệ hoặc không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: Token không tồn tại
 *                 value:
 *                   error: Token không tồn tại
 *               invalidToken:
 *                 summary: Token không hợp lệ
 *                 value:
 *                   error: Token không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Đã xảy ra lỗi khi đăng ký lớp học
 *                 error:
 *                   type: string
 */
router.post('/', verifyToken, enrollClass);

module.exports = router;
