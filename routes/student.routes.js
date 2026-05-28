const express = require('express');
const router = express.Router();
const { getMyGrades, calculateGPA4 } = require('../app/controllers/student.controller');
const { verifyToken, isStudent } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/students/my-grades:
 *   get:
 *     tags:
 *       - Students
 *     summary: Lấy bảng điểm của sinh viên hiện tại
 *     description: Lấy danh sách tất cả các môn học và điểm số của sinh viên. Bao gồm điểm giữa kỳ, cuối kỳ, điểm trung bình và kết quả đạt/không đạt. Yêu cầu xác thực token và quyền Sinh viên.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy bảng điểm thành công
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
 *                   example: 5
 *                 message:
 *                   type: string
 *                   example: Lấy bảng điểm thành công
 *                 grades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       CourseCode:
 *                         type: string
 *                         description: Mã môn học
 *                         example: "CS101"
 *                       CourseName:
 *                         type: string
 *                         description: Tên môn học
 *                         example: "Lập trình C++"
 *                       Credits:
 *                         type: integer
 *                         description: Số tín chỉ
 *                         example: 3
 *                       Semester:
 *                         type: string
 *                         description: Học kỳ
 *                         example: "2024-2"
 *                       MidtermGrade:
 *                         type: number
 *                         description: Điểm quá trình/giữa kỳ (0-10, null nếu chưa có)
 *                         example: 7.5
 *                       FinalGrade:
 *                         type: number
 *                         description: Điểm thi/cuối kỳ (0-10, null nếu chưa có)
 *                         example: 8.0
 *                       AverageGrade:
 *                         type: number
 *                         description: Điểm trung bình môn (AverageGrade = MidtermGrade*0.4 + FinalGrade*0.6, null nếu chưa đủ điểm)
 *                         example: 7.8
 *                       Result:
 *                         type: string
 *                         description: Kết quả (Đạt/Không đạt/Chưa có điểm)
 *                         example: "Đạt"
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
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
 *         description: Không có quyền truy cập (không phải sinh viên)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Yêu cầu quyền Sinh viên
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
 *                   example: Lỗi máy chủ khi lấy bảng điểm
 *                 error:
 *                   type: string
 */
router.get('/my-grades', verifyToken, isStudent, getMyGrades);

/**
 * @swagger
 * /api/students/gpa4:
 *   get:
 *     tags:
 *       - Students
 *     summary: Tính GPA hệ 4 của sinh viên hiện tại
 *     description: Tính chỉ số GPA (Grade Point Average) hệ 4 của sinh viên dựa trên tất cả điểm đã có. Công thức tính GPA = Σ(Grade4 × Credits) / Σ(Credits). Chỉ tính các môn có điểm (AverageGrade khác null). Yêu cầu xác thực token và quyền Sinh viên.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tính GPA hệ 4 thành công
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
 *                   example: Tính GPA hệ 4 thành công
 *                 grades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       CourseCode:
 *                         type: string
 *                         description: Mã môn học
 *                         example: "CS101"
 *                       CourseName:
 *                         type: string
 *                         description: Tên môn học
 *                         example: "Lập trình C++"
 *                       Credits:
 *                         type: integer
 *                         description: Số tín chỉ
 *                         example: 3
 *                       Semester:
 *                         type: string
 *                         description: Học kỳ
 *                         example: "2024-2"
 *                       MidtermGrade:
 *                         type: number
 *                         description: Điểm giữa kỳ (0-10)
 *                         example: 7.5
 *                       FinalGrade:
 *                         type: number
 *                         description: Điểm cuối kỳ (0-10)
 *                         example: 8.0
 *                       AverageGrade:
 *                         type: number
 *                         description: Điểm trung bình (hệ 10)
 *                         example: 7.8
 *                       Grade4:
 *                         type: number
 *                         description: Điểm hệ 4 (9-10→4.0, 8-8.9→3.5, 7-7.9→3.0, 6-6.9→2.5, 5-5.9→2.0, 4-4.9→1.0, <4→0.0)
 *                         example: 3.0
 *                       Result:
 *                         type: string
 *                         description: Kết quả (Đạt/Không đạt/Chưa có điểm)
 *                         example: "Đạt"
 *                 summary:
 *                   type: object
 *                   description: Tóm tắt GPA
 *                   properties:
 *                     totalCredits:
 *                       type: integer
 *                       description: Tổng số tín chỉ của các môn có điểm
 *                       example: 12
 *                     gpa4:
 *                       type: number
 *                       description: GPA hệ 4 (0.0-4.0), làm tròn 2 chữ số thập phân
 *                       example: 3.25
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
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
 *         description: Không có quyền truy cập (không phải sinh viên)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Yêu cầu quyền Sinh viên
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
 *                   example: Lỗi máy chủ khi tính GPA4
 *                 error:
 *                   type: string
 */
router.get('/gpa4', verifyToken, isStudent, calculateGPA4);

module.exports = router;
