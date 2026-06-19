const sql = require('mssql');
const { connectDB } = require('../../config/db.config');

// Lấy tất cả khoa
const getAllDepartments = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Departments');

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách khoa thành công',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách khoa:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy danh sách khoa từ cơ sở dữ liệu',
    });
  }
};

// Lấy khoa theo ID
const getByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID khoa không được để trống',
      });
    }

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('DepartmentId', sql.Int, id)
      .query('SELECT * FROM Departments WHERE DepartmentId = @DepartmentId');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy khoa',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin khoa thành công',
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin khoa:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy thông tin khoa từ cơ sở dữ liệu',
    });
  }
};

// Tạo khoa mới
// Khớp với sp_InsertDepartment(@DepartmentCode VARCHAR(20), @DepartmentName NVARCHAR(100))
// THROW 50006 khi DepartmentCode đã tồn tại
const createDepartment = async (req, res) => {
  try {
    const { DepartmentCode, DepartmentName } = req.body;

    if (!DepartmentCode || !DepartmentName) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp đầy đủ thông tin: DepartmentCode, DepartmentName',
      });
    }

    const pool = await connectDB();

    try {
      await pool
        .request()
        .input('DepartmentCode', sql.VarChar(20), DepartmentCode)
        .input('DepartmentName', sql.NVarChar(100), DepartmentName)
        .execute('sp_InsertDepartment');
    } catch (spError) {
      if (spError.number === 50006) {
        return res.status(400).json({
          success: false,
          error: 'Mã khoa đã tồn tại.',
        });
      }
      throw spError;
    }

    // Lấy DepartmentId vừa tạo
    const result = await pool
      .request()
      .input('DepartmentCode', sql.VarChar(20), DepartmentCode)
      .query('SELECT DepartmentId FROM Departments WHERE DepartmentCode = @DepartmentCode');

    const departmentId = result.recordset[0].DepartmentId;

    return res.status(201).json({
      success: true,
      message: 'Tạo khoa thành công',
      data: {
        DepartmentId: departmentId,
        DepartmentCode,
        DepartmentName,
      },
    });
  } catch (error) {
    console.error('Lỗi tạo khoa:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi tạo khoa trong cơ sở dữ liệu',
    });
  }
};

// Cập nhật khoa
// Khớp với sp_UpdateDepartment(@DepartmentId INT, @DepartmentCode VARCHAR(20), @DepartmentName NVARCHAR(100))
// SP này CHỈ kiểm tra tồn tại (THROW 50007), KHÔNG kiểm tra trùng mã khi update
// -> nếu cần chặn trùng mã lúc sửa, phải bổ sung logic ở SP hoặc check thêm ở đây
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { DepartmentCode, DepartmentName } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID khoa không được để trống',
      });
    }

    const pool = await connectDB();

    const checkResult = await pool
      .request()
      .input('DepartmentId', sql.Int, id)
      .query('SELECT * FROM Departments WHERE DepartmentId = @DepartmentId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy khoa để cập nhật',
      });
    }

    const currentDept = checkResult.recordset[0];

    try {
      await pool
        .request()
        .input('DepartmentId', sql.Int, id)
        .input('DepartmentCode', sql.VarChar(20), DepartmentCode || currentDept.DepartmentCode)
        .input('DepartmentName', sql.NVarChar(100), DepartmentName || currentDept.DepartmentName)
        .execute('sp_UpdateDepartment');
    } catch (spError) {
      if (spError.number === 50007) {
        return res.status(404).json({
          success: false,
          error: 'Khoa không tồn tại.',
        });
      }
      throw spError;
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật khoa thành công',
      data: {
        DepartmentId: id,
        DepartmentCode: DepartmentCode || currentDept.DepartmentCode,
        DepartmentName: DepartmentName || currentDept.DepartmentName,
      },
    });
  } catch (error) {
    console.error('Lỗi cập nhật khoa:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi cập nhật khoa trong cơ sở dữ liệu',
    });
  }
};

// Xóa khoa
// Khớp với sp_DeleteDepartment(@DepartmentId INT)
// THROW 50008 khi còn Courses tham chiếu DepartmentId này
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID khoa không được để trống',
      });
    }

    const pool = await connectDB();

    const checkResult = await pool
      .request()
      .input('DepartmentId', sql.Int, id)
      .query('SELECT * FROM Departments WHERE DepartmentId = @DepartmentId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy khoa để xóa',
      });
    }

    try {
      await pool
        .request()
        .input('DepartmentId', sql.Int, id)
        .execute('sp_DeleteDepartment');
    } catch (spError) {
      if (spError.number === 50008) {
        return res.status(409).json({
          success: false,
          error: 'Không thể xóa khoa vì còn môn học tham chiếu.',
        });
      }
      throw spError;
    }

    return res.status(200).json({
      success: true,
      message: 'Xóa khoa thành công',
      data: {
        DepartmentId: id,
      },
    });
  } catch (error) {
    console.error('Lỗi xóa khoa:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi xóa khoa từ cơ sở dữ liệu',
    });
  }
};

module.exports = {
  getAllDepartments,
  getByID,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};