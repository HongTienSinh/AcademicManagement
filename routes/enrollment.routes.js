const express = require('express');
const router = express.Router();
const { enrollClass, updateGrade } = require('../app/controllers/enrollment.controller');
const { verifyToken, isTeacher } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/enrollments:
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
router.post('/api/enrollments', verifyToken, enrollClass);

/**
 * @swagger
 * /api/enrollments/grades:
 *   put:
 *     tags:
 *       - Enrollments
 *     summary: Nhập/cập nhật điểm học phần
 *     description: Giảng viên nhập hoặc cập nhật điểm giữa kỳ, cuối kỳ cho một đăng ký. Yêu cầu xác thực (Bearer Token) và quyền Giảng viên. Hệ thống sẽ tự động tính điểm trung bình = MidtermGrade*0.4 + FinalGrade*0.6.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - EnrollmentId
 *             properties:
 *               EnrollmentId:
 *                 type: integer
 *                 description: ID của đăng ký học phần cần cập nhật điểm
 *                 example: 15
 *               MidtermGrade:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 description: Điểm giữa kỳ (0-10, tùy chọn)
 *                 example: 7.5
 *               FinalGrade:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 description: Điểm cuối kỳ (0-10, tùy chọn)
 *                 example: 8.0
 *           examples:
 *             updateBoth:
 *               summary: Cập nhật cả hai điểm
 *               value:
 *                 EnrollmentId: 15
 *                 MidtermGrade: 7.5
 *                 FinalGrade: 8.0
 *             updateMidterm:
 *               summary: Cập nhật chỉ điểm giữa kỳ
 *               value:
 *                 EnrollmentId: 15
 *                 MidtermGrade: 7.5
 *             updateFinal:
 *               summary: Cập nhật chỉ điểm cuối kỳ
 *               value:
 *                 EnrollmentId: 15
 *                 FinalGrade: 8.0
 *     responses:
 *       200:
 *         description: Cập nhật điểm thành công
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
 *                   example: Cập nhật điểm thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     EnrollmentId:
 *                       type: integer
 *                       example: 15
 *                     ClassId:
 *                       type: integer
 *                       example: 5
 *                     StudentId:
 *                       type: string
 *                       format: uuid
 *                       example: 550e8400-e29b-41d4-a716-446655440000
 *                     MidtermGrade:
 *                       type: number
 *                       example: 7.5
 *                     FinalGrade:
 *                       type: number
 *                       example: 8.0
 *                     AverageGrade:
 *                       type: number
 *                       description: Điểm trung bình (tự tính)
 *                       example: 7.8
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
 *               missingEnrollmentId:
 *                 summary: EnrollmentId là bắt buộc
 *                 value:
 *                   success: false
 *                   message: EnrollmentId là bắt buộc
 *               invalidMidtermGrade:
 *                 summary: Điểm giữa kỳ không hợp lệ
 *                 value:
 *                   success: false
 *                   message: Điểm giữa kỳ phải từ 0 đến 10
 *               invalidFinalGrade:
 *                 summary: Điểm cuối kỳ không hợp lệ
 *                 value:
 *                   success: false
 *                   message: Điểm cuối kỳ phải từ 0 đến 10
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
 *       403:
 *         description: Không có quyền - không phải giảng viên hoặc không phải giáo viên dạy lớp này
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
 *               notTeacher:
 *                 summary: Không phải giảng viên
 *                 value:
 *                   success: false
 *                   message: Yêu cầu quyền Giảng viên
 *               noPermission:
 *                 summary: Không phải giáo viên dạy lớp này
 *                 value:
 *                   success: false
 *                   message: Bạn không có quyền nhập điểm cho lớp này
 *       404:
 *         description: Đăng ký không tồn tại
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
 *                   example: Đăng ký không tồn tại
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
 *                   example: Lỗi máy chủ khi cập nhật điểm
 *                 error:
 *                   type: string
 */
router.put('/api/enrollments/grades', verifyToken, isTeacher, updateGrade);

module.exports = router;
