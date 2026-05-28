const { getConnection, sql } = require('../../config/db.config');

/**
 * Lấy danh sách các lớp mà giảng viên đang phụ trách
 *
 * Bảo mật:
 * - Yêu cầu JWT token hợp lệ (verifyToken middleware)
 * - Yêu cầu RoleId = 2 (Giảng viên)
 * - Lấy TeacherId từ JWT token (req.user.UserId)
 * - Sử dụng parameterized query để chống SQL injection
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const getMyClasses = async (req, res, next) => {
  try {
    // Kiểm tra xác thực và quyền đã được thực hiện bởi middleware
    // req.user được set bởi verifyToken middleware từ JWT token
    const teacherId = req.user.UserId;

    if (!teacherId) {
      return res.status(400).json({ error: 'TeacherId không hợp lệ' });
    }

    // Lấy connection pool
    const pool = await getConnection();

    // SQL query: SELECT từ Classes JOIN Courses JOIN Departments
    // Lọc theo TeacherId của giảng viên hiện tại
    const query = `
      SELECT 
        c.ClassId,
        c.ClassCode,
        cr.CourseId,
        cr.CourseCode,
        cr.CourseName,
        cr.Credits,
        d.DepartmentId,
        d.DepartmentName,
        c.Semester,
        c.MaxStudents,
        (SELECT COUNT(*) FROM Enrollments WHERE ClassId = c.ClassId) AS EnrolledCount,
        c.Status,
        CASE 
          WHEN (SELECT COUNT(*) FROM Enrollments WHERE ClassId = c.ClassId) >= c.MaxStudents THEN 1
          ELSE 0
        END AS IsFull
      FROM Classes c
      INNER JOIN Courses cr ON c.CourseId = cr.CourseId
      INNER JOIN Departments d ON cr.DepartmentId = d.DepartmentId
      WHERE c.TeacherId = @TeacherId
      ORDER BY c.Semester DESC, c.ClassCode ASC
    `;

    // Thực thi query với parameterized statement
    const result = await pool.request()
      .input('TeacherId', sql.UniqueIdentifier, teacherId)
      .query(query);

    // Trả về danh sách lớp
    if (result.recordset.length === 0) {
      return res.status(200).json({
        message: 'Giảng viên không có lớp học phần nào',
        classes: []
      });
    }

    return res.status(200).json({
      success: true,
      count: result.recordset.length,
      classes: result.recordset
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách lớp của giảng viên:', error);
    
    // Xử lý lỗi database
    if (error.message.includes('Connection Timeout')) {
      return res.status(504).json({ error: 'Kết nối database timeout' });
    }

    return res.status(500).json({ 
      error: 'Lỗi máy chủ khi lấy danh sách lớp',
      details: error.message 
    });
  }
};

module.exports = {
  getMyClasses,
};
