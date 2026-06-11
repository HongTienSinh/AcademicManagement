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

/**
 * Lấy danh sách tất cả lớp học phần (Admin only)
 */
const getAllClasses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim() : null;
    const offset = (page - 1) * limit;

    const pool = await getConnection();
    let query = `
      SELECT 
        c.ClassId,
        c.ClassCode,
        cr.CourseCode,
        cr.CourseName,
        cr.Credits,
        d.DepartmentName,
        u.FullName AS TeacherName,
        c.Semester,
        c.MaxStudents,
        (SELECT COUNT(*) FROM Enrollments WHERE ClassId = c.ClassId) AS EnrolledCount,
        c.Status
      FROM Classes c
      INNER JOIN Courses cr ON c.CourseId = cr.CourseId
      INNER JOIN Departments d ON cr.DepartmentId = d.DepartmentId
      INNER JOIN Users u ON c.TeacherId = u.UserId
    `;

    let countQuery = 'SELECT COUNT(*) as total FROM Classes c WHERE 1=1';
    let request = pool.request();

    if (search) {
      query += ` WHERE c.ClassCode LIKE @search OR cr.CourseName LIKE @search`;
      countQuery += ` AND (c.ClassCode LIKE @search OR cr.CourseName LIKE @search)`;
      request = request.input('search', sql.NVarChar(255), `%${search}%`);
    }

    const countResult = await request.query(countQuery);
    const totalItems = countResult.recordset[0].total;

    const queryRequest = pool.request();
    if (search) {
      queryRequest.input('search', sql.NVarChar(255), `%${search}%`);
    }
    const result = await queryRequest
      .query(query + ` ORDER BY c.Semester DESC, c.ClassCode ASC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);

    return res.status(200).json({
      success: true,
      data: result.recordset || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems: totalItems,
        limit: limit,
      },
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách lớp:', error);
    return next(error);
  }
};

/**
 * Lấy chi tiết một lớp học phần
 */
const getClassById = async (req, res, next) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ error: 'ClassId không hợp lệ' });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('ClassId', sql.Int, classId)
      .query(`
        SELECT 
          c.ClassId,
          c.ClassCode,
          cr.CourseId,
          cr.CourseCode,
          cr.CourseName,
          cr.Credits,
          d.DepartmentName,
          u.UserId AS TeacherId,
          u.FullName AS TeacherName,
          c.Semester,
          c.MaxStudents,
          (SELECT COUNT(*) FROM Enrollments WHERE ClassId = c.ClassId) AS EnrolledCount,
          c.Status
        FROM Classes c
        INNER JOIN Courses cr ON c.CourseId = cr.CourseId
        INNER JOIN Departments d ON cr.DepartmentId = d.DepartmentId
        INNER JOIN Users u ON c.TeacherId = u.UserId
        WHERE c.ClassId = @ClassId
      `);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ error: 'Lớp không tồn tại' });
    }

    return res.status(200).json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết lớp:', error);
    return next(error);
  }
};

/**
 * Tạo lớp học phần mới (Admin only)
 */
const createClass = async (req, res, next) => {
  try {
    const { ClassCode, CourseId, TeacherId, Semester, MaxStudents } = req.body;

    // Validation
    if (!ClassCode || !CourseId || !TeacherId || !Semester) {
      return res.status(400).json({
        success: false,
        error: 'ClassCode, CourseId, TeacherId, Semester là bắt buộc',
      });
    }

    const pool = await getConnection();

    try {
      const result = await pool.request()
        .input('ClassCode', sql.VarChar(50), ClassCode)
        .input('CourseId', sql.Int, CourseId)
        .input('TeacherId', sql.UniqueIdentifier, TeacherId)
        .input('Semester', sql.VarChar(20), Semester)
        .input('MaxStudents', sql.Int, MaxStudents || 40)
        .execute('sp_InsertClass');

      const newClassId = result.returnValue;

      return res.status(201).json({
        success: true,
        message: 'Tạo lớp thành công',
        data: { ClassId: newClassId },
      });
    } catch (spError) {
      if (spError.number === 50080) {
        return res.status(400).json({ success: false, error: 'Mã lớp đã tồn tại' });
      }
      if (spError.number === 50081) {
        return res.status(404).json({ success: false, error: 'Môn học không tồn tại' });
      }
      if (spError.number === 50082) {
        return res.status(400).json({ success: false, error: 'Giảng viên không tồn tại hoặc không hợp lệ' });
      }
      if (spError.number === 50083) {
        return res.status(400).json({ success: false, error: 'Sĩ số tối đa phải lớn hơn 0' });
      }
      throw spError;
    }
  } catch (error) {
    console.error('Lỗi tạo lớp:', error);
    return next(error);
  }
};

/**
 * Cập nhật thông tin lớp (Admin only)
 */
const updateClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { ClassCode, Semester, MaxStudents, Status } = req.body;

    if (!classId) {
      return res.status(400).json({ error: 'ClassId không hợp lệ' });
    }

    const pool = await getConnection();

    try {
      await pool.request()
        .input('ClassId', sql.Int, classId)
        .input('ClassCode', sql.VarChar(50), ClassCode || null)
        .input('Semester', sql.VarChar(20), Semester || null)
        .input('MaxStudents', sql.Int, MaxStudents || null)
        .input('Status', sql.VarChar(20), Status || null)
        .execute('sp_UpdateClass');

      return res.status(200).json({
        success: true,
        message: 'Cập nhật lớp thành công',
      });
    } catch (spError) {
      if (spError.number === 50090) {
        return res.status(404).json({ success: false, error: 'Lớp không tồn tại' });
      }
      if (spError.number === 50091) {
        return res.status(400).json({ success: false, error: 'Mã lớp đã tồn tại' });
      }
      if (spError.number === 50092) {
        return res.status(400).json({ success: false, error: 'Sĩ số tối đa không thể nhỏ hơn số sinh viên đã đăng ký' });
      }
      throw spError;
    }
  } catch (error) {
    console.error('Lỗi cập nhật lớp:', error);
    return next(error);
  }
};

/**
 * Xóa lớp học phần (Admin only)
 */
const deleteClass = async (req, res, next) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ error: 'ClassId không hợp lệ' });
    }

    const pool = await getConnection();

    try {
      await pool.request()
        .input('ClassId', sql.Int, classId)
        .execute('sp_DeleteClass');

      return res.status(200).json({
        success: true,
        message: 'Xóa lớp thành công',
      });
    } catch (spError) {
      if (spError.number === 50095) {
        return res.status(404).json({ success: false, error: 'Lớp không tồn tại' });
      }
      if (spError.number === 50096) {
        return res.status(400).json({ success: false, error: 'Không thể xóa lớp khi có sinh viên đăng ký' });
      }
      throw spError;
    }
  } catch (error) {
    console.error('Lỗi xóa lớp:', error);
    return next(error);
  }
};

module.exports = {
  getMyClasses,
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
