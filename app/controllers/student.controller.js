const { getConnection, sql } = require('../../config/db.config');

/**
 * Chuyển đổi điểm hệ 10 sang hệ 4
 * Công thức:
 *   9.0-10.0 → 4.0
 *   8.0-8.9  → 3.5
 *   7.0-7.9  → 3.0
 *   6.0-6.9  → 2.5
 *   5.0-5.9  → 2.0
 *   4.0-4.9  → 1.0
 *   < 4.0    → 0.0
 * 
 * @param {number} grade10 - Điểm hệ 10
 * @returns {number|null} - Điểm hệ 4 hoặc null nếu không có điểm
 */
function convertTo4Scale(grade10) {
  if (grade10 === null || grade10 === undefined) {
    return null;
  }

  if (grade10 >= 9.0) return 4.0;
  if (grade10 >= 8.0) return 3.5;
  if (grade10 >= 7.0) return 3.0;
  if (grade10 >= 6.0) return 2.5;
  if (grade10 >= 5.0) return 2.0;
  if (grade10 >= 4.0) return 1.0;
  return 0.0;
}

/**
 * Lấy bảng điểm của sinh viên
 * 
 * SQL JOIN:
 *   Enrollments (bảng gốc)
 *   -> Classes (qua ClassId)
 *   -> Courses (qua CourseId từ Classes)
 * 
 * Bảo mật:
 * - Lấy StudentId từ JWT token (req.user.UserId)
 * - Chỉ sinh viên được xem điểm của chính mình
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.getMyGrades = async (req, res) => {
  try {
    const StudentId = req.user.UserId;

    if (!StudentId) {
      return res.status(400).json({
        success: false,
        message: 'StudentId không hợp lệ',
      });
    }

    const pool = await getConnection();

    // ========================================================
    // SQL: JOIN Enrollments -> Classes -> Courses
    // ========================================================
    const query = `
      SELECT 
        cr.CourseCode,
        cr.CourseName,
        cr.Credits,
        c.Semester,
        e.MidtermGrade,
        e.FinalGrade,
        e.AverageGrade,
        CASE 
          WHEN e.AverageGrade IS NULL THEN N'Chưa có điểm'
          WHEN e.AverageGrade >= 4 THEN N'Đạt'
          ELSE N'Không đạt'
        END AS Result
      FROM Enrollments e
      INNER JOIN Classes c ON e.ClassId = c.ClassId
      INNER JOIN Courses cr ON c.CourseId = cr.CourseId
      WHERE e.StudentId = @StudentId
      ORDER BY c.Semester DESC, cr.CourseCode ASC
    `;

    const result = await pool.request()
      .input('StudentId', sql.UniqueIdentifier, StudentId)
      .query(query);

    // ========================================================
    // TRẢ VỀ DỮ LIỆU
    // ========================================================
    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Sinh viên chưa đăng ký lớp học phần nào',
        grades: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: result.recordset.length,
      message: 'Lấy bảng điểm thành công',
      grades: result.recordset,
    });

  } catch (error) {
    console.error('Lỗi khi lấy bảng điểm:', error);

    if (error.message.includes('Connection Timeout')) {
      return res.status(504).json({
        success: false,
        message: 'Kết nối database timeout',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy bảng điểm',
      error: error.message,
    });
  }
};

/**
 * Tính GPA hệ 4 của sinh viên
 * 
 * Công thức: GPA4 = Σ(Grade4 * Credits) / Σ(Credits)
 * Chỉ tính các môn có điểm (AverageGrade không null)
 * 
 * Bảo mật:
 * - Lấy StudentId từ JWT token (req.user.UserId)
 * - Chỉ sinh viên được xem GPA của chính mình
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.calculateGPA4 = async (req, res) => {
  try {
    const StudentId = req.user.UserId;

    if (!StudentId) {
      return res.status(400).json({
        success: false,
        message: 'StudentId không hợp lệ',
      });
    }

    const pool = await getConnection();

    // ========================================================
    // SQL: Lấy tất cả dữ liệu điểm
    // ========================================================
    const query = `
      SELECT 
        cr.CourseCode,
        cr.CourseName,
        cr.Credits,
        c.Semester,
        e.MidtermGrade,
        e.FinalGrade,
        e.AverageGrade,
        CASE 
          WHEN e.AverageGrade IS NULL THEN N'Chưa có điểm'
          WHEN e.AverageGrade >= 4 THEN N'Đạt'
          ELSE N'Không đạt'
        END AS Result
      FROM Enrollments e
      INNER JOIN Classes c ON e.ClassId = c.ClassId
      INNER JOIN Courses cr ON c.CourseId = cr.CourseId
      WHERE e.StudentId = @StudentId
      ORDER BY c.Semester DESC, cr.CourseCode ASC
    `;

    const result = await pool.request()
      .input('StudentId', sql.UniqueIdentifier, StudentId)
      .query(query);

    // ========================================================
    // TÍNH TOÁN GPA HỆ 4
    // ========================================================
    let totalWeightedGrade = 0;
    let totalCredits = 0;
    let gradesWithGpa4 = [];

    result.recordset.forEach((course) => {
      const grade4 = convertTo4Scale(course.AverageGrade);

      const courseData = {
        CourseCode: course.CourseCode,
        CourseName: course.CourseName,
        Credits: course.Credits,
        Semester: course.Semester,
        MidtermGrade: course.MidtermGrade,
        FinalGrade: course.FinalGrade,
        AverageGrade: course.AverageGrade,
        Grade4: grade4, // Điểm hệ 4
        Result: course.Result,
      };

      gradesWithGpa4.push(courseData);

      // Chỉ tính GPA cho các môn có điểm (AverageGrade không null)
      if (course.AverageGrade !== null && course.AverageGrade !== undefined) {
        totalWeightedGrade += grade4 * course.Credits;
        totalCredits += course.Credits;
      }
    });

    // ========================================================
    // TÍNH GPA4
    // ========================================================
    const gpa4 = totalCredits > 0
      ? parseFloat((totalWeightedGrade / totalCredits).toFixed(2))
      : 0.0;

    // ========================================================
    // TRẢ VỀ DỮ LIỆU
    // ========================================================
    if (gradesWithGpa4.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Sinh viên chưa đăng ký lớp học phần nào',
        grades: [],
        summary: {
          totalCredits: 0,
          gpa4: 0.0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tính GPA hệ 4 thành công',
      grades: gradesWithGpa4,
      summary: {
        totalCredits,
        gpa4,
      },
    });

  } catch (error) {
    console.error('❌ Lỗi khi tính GPA4:', error);

    if (error.message.includes('Connection Timeout')) {
      return res.status(504).json({
        success: false,
        message: 'Kết nối database timeout',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi tính GPA4',
      error: error.message,
    });
  }
};
/**
 * Lấy báo cáo sinh viên nợ môn (chỉ Admin)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.getFailedCoursesReport = async (req, res) => {
  try {
    // Kiểm tra role = Admin
    if (req.user.Role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ Admin mới có quyền xem báo cáo nợ môn',
      });
    }

    const pool = await getConnection();

    try {
      const result = await pool.request()
        .execute('sp_GetFailedCoursesReport');

      return res.status(200).json({
        success: true,
        message: 'Lấy báo cáo nợ môn thành công',
        data: result.recordset || [],
        count: result.recordset ? result.recordset.length : 0,
      });
    } catch (spError) {
      throw spError;
    }
  } catch (error) {
    console.error('Lỗi lấy báo cáo nợ môn:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy báo cáo nợ môn',
      error: error.message,
    });
  }
};