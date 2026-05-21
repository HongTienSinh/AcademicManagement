const sql = require('mssql');
const { connectDB } = require('../../config/db.config');

// Lấy tất cả môn học
const getAllCourses = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Courses');
    
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách môn học thành công',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách môn học:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy danh sách môn học từ cơ sở dữ liệu',
    });
  }
};

// Lấy môn học theo ID
const getByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID môn học không được để trống',
      });
    }

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('CourseId', sql.Int, id)
      .query('SELECT * FROM Courses WHERE CourseId = @CourseId');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy môn học',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin môn học thành công',
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin môn học:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy thông tin môn học từ cơ sở dữ liệu',
    });
  }
};

// Tạo môn học mới
const createCourse = async (req, res) => {
  try {
    const { CourseCode, CourseName, Credits, DepartmentId } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!CourseCode || !CourseName || Credits === undefined || !DepartmentId) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp đầy đủ thông tin: CourseCode, CourseName, Credits, DepartmentId',
      });
    }

    // Kiểm tra Credits từ 1 đến 10
    if (Credits < 1 || Credits > 10) {
      return res.status(400).json({
        success: false,
        error: 'Tín chỉ phải từ 1 đến 10',
      });
    }

    const pool = await connectDB();

    // Gọi Stored Procedure sp_InsertCourse
    await pool
      .request()
      .input('CourseCode', sql.VarChar(20), CourseCode)
      .input('CourseName', sql.NVarChar(150), CourseName)
      .input('Credits', sql.Int, Credits)
      .input('DepartmentId', sql.Int, DepartmentId)
      .execute('sp_InsertCourse');

    // Lấy CourseId vừa tạo
    const result = await pool
      .request()
      .input('CourseCode', sql.VarChar(20), CourseCode)
      .query('SELECT CourseId FROM Courses WHERE CourseCode = @CourseCode');

    const courseId = result.recordset[0].CourseId;

    return res.status(201).json({
      success: true,
      message: 'Tạo môn học thành công',
      data: {
        CourseId: courseId,
        CourseCode,
        CourseName,
        Credits,
        DepartmentId,
      },
    });
  } catch (error) {
    console.error('Lỗi tạo môn học:', error.message);
    
    // Xử lý lỗi từ SP
    if (error.number === 50006) {
      return res.status(400).json({
        success: false,
        error: 'Mã khoa đã tồn tại',
      });
    }
    if (error.number === 50009) {
      return res.status(400).json({
        success: false,
        error: 'Khoa/Bộ môn không tồn tại',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Lỗi khi tạo môn học trong cơ sở dữ liệu',
    });
  }
};

// Cập nhật môn học
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { CourseCode, CourseName, Credits, DepartmentId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID môn học không được để trống',
      });
    }

    // Kiểm tra Credits nếu có cập nhật
    if (Credits !== undefined && (Credits < 1 || Credits > 10)) {
      return res.status(400).json({
        success: false,
        error: 'Tín chỉ phải từ 1 đến 10',
      });
    }

    const pool = await connectDB();

    // Kiểm tra xem môn học có tồn tại không
    const checkResult = await pool
      .request()
      .input('CourseId', sql.Int, id)
      .query('SELECT * FROM Courses WHERE CourseId = @CourseId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy môn học để cập nhật',
      });
    }

    const currentCourse = checkResult.recordset[0];

    // Gọi Stored Procedure sp_UpdateCourse
    try {
      await pool
        .request()
        .input('CourseId', sql.Int, id)
        .input('CourseCode', sql.VarChar(20), CourseCode || currentCourse.CourseCode)
        .input('CourseName', sql.NVarChar(150), CourseName || currentCourse.CourseName)
        .input('Credits', sql.Int, Credits !== undefined ? Credits : currentCourse.Credits)
        .input('DepartmentId', sql.Int, DepartmentId || currentCourse.DepartmentId)
        .execute('sp_UpdateCourse');
    } catch (spError) {
      if (spError.number === 50006) {
        return res.status(400).json({
          success: false,
          error: 'Mã môn học này đã tồn tại',
        });
      }
      if (spError.number === 50009) {
        return res.status(400).json({
          success: false,
          error: 'Khoa/Bộ môn không tồn tại',
        });
      }
      if (spError.number === 50010) {
        return res.status(404).json({
          success: false,
          error: 'Môn học không tồn tại',
        });
      }
      throw spError;
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật môn học thành công',
      data: {
        CourseId: id,
        CourseCode: CourseCode || currentCourse.CourseCode,
        CourseName: CourseName || currentCourse.CourseName,
        Credits: Credits !== undefined ? Credits : currentCourse.Credits,
        DepartmentId: DepartmentId || currentCourse.DepartmentId,
      },
    });
  } catch (error) {
    console.error('Lỗi cập nhật môn học:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi cập nhật môn học trong cơ sở dữ liệu',
    });
  }
};

// Xóa môn học
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID môn học không được để trống',
      });
    }

    const pool = await connectDB();

    // Kiểm tra xem môn học có tồn tại không
    const checkResult = await pool
      .request()
      .input('CourseId', sql.Int, id)
      .query('SELECT * FROM Courses WHERE CourseId = @CourseId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy môn học để xóa',
      });
    }

    // Gọi Stored Procedure sp_DeleteCourse
    try {
      await pool
        .request()
        .input('CourseId', sql.Int, id)
        .execute('sp_DeleteCourse');
    } catch (spError) {
      if (spError.number === 50011) {
        return res.status(409).json({
          success: false,
          error: 'Không thể xóa môn học vì đã được mở lớp',
        });
      }
      throw spError;
    }

    return res.status(200).json({
      success: true,
      message: 'Xóa môn học thành công',
      data: {
        CourseId: id,
      },
    });
  } catch (error) {
    console.error('Lỗi xóa môn học:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi xóa môn học từ cơ sở dữ liệu',
    });
  }
};

module.exports = {
  getAllCourses,
  getByID,
  createCourse,
  updateCourse,
  deleteCourse,
};
