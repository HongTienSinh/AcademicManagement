const { getConnection, sql } = require('../../config/db.config');

/**
 * Đăng ký học phần
 * Yêu cầu:
 *   - req.body.ClassId: ID của lớp học phần
 *   - req.user.UserId: ID của sinh viên (từ middleware auth)
 * Quy trình:
 *   1. Kiểm tra lớp tồn tại và Status = 'Open'
 *   2. Kiểm tra sĩ số (tính từ Enrollments) < MaxStudents
 *   3. Kiểm tra sinh viên chưa đăng ký lớp này
 *   4. Nếu qua hết, INSERT vào Enrollments
 *   5. COMMIT và trả về 201
 */
exports.enrollClass = async (req, res) => {
  const { ClassId } = req.body;
  const StudentId = req.user.UserId;

  // Validate input
  if (!ClassId) {
    return res.status(400).json({
      success: false,
      message: 'ClassId là bắt buộc',
    });
  }

  if (!StudentId) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy thông tin sinh viên',
    });
  }

  let pool;
  let transaction;

  try {
    // Lấy connection pool
    pool = await getConnection();

    // Bắt đầu Transaction
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = transaction.request();

    // ========================================================
    // KIỂM TRA 1: Lớp tồn tại và Status = 'Open'
    // ========================================================
    const classResult = await request.query(`
      SELECT ClassId, Status, MaxStudents
      FROM Classes
      WHERE ClassId = ${ClassId}
    `);

    if (!classResult.recordset || classResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Lớp không tồn tại hoặc đã đóng',
      });
    }

    const classData = classResult.recordset[0];
    if (classData.Status !== 'Open') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Lớp không tồn tại hoặc đã đóng',
      });
    }

    // ========================================================
    // KIỂM TRA 2: Sĩ số hiện tại < MaxStudents
    // ========================================================
    const enrollCountResult = await request.query(`
      SELECT COUNT(*) AS EnrolledCount
      FROM Enrollments
      WHERE ClassId = ${ClassId}
    `);

    const enrolledCount = enrollCountResult.recordset[0].EnrolledCount;
    const maxStudents = classData.MaxStudents;

    if (enrolledCount >= maxStudents) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Lớp đã đủ sĩ số',
      });
    }

    // ========================================================
    // KIỂM TRA 3: Sinh viên chưa đăng ký lớp này
    // ========================================================
    const existingEnrollResult = await request.query(`
      SELECT EnrollmentId
      FROM Enrollments
      WHERE ClassId = ${ClassId} AND StudentId = '${StudentId}'
    `);

    if (existingEnrollResult.recordset && existingEnrollResult.recordset.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đăng ký lớp học này rồi',
      });
    }

    // ========================================================
    // THỰC HIỆN: INSERT vào Enrollments
    // ========================================================
    await request.query(`
      INSERT INTO Enrollments (ClassId, StudentId)
      VALUES (${ClassId}, '${StudentId}')
    `);

    // COMMIT Transaction
    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        ClassId,
        StudentId,
        EnrollmentDate: new Date(),
      },
    });
  } catch (error) {
    // Rollback nếu có lỗi
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Lỗi khi rollback transaction:', rollbackError.message);
      }
    }

    console.error('Lỗi trong enrollClass:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng ký lớp học',
      error: error.message,
    });
  }
};

/**
 * Nhập/cập nhật điểm học phần
 * 
 * Quy trình:
 *   1. Kiểm tra giáo viên có đúng là người dạy lớp chứa EnrollmentId này không
 *   2. Kiểm tra giá trị điểm (0-10) nếu có nhập
 *   3. Gọi stored procedure sp_UpdateGrade
 *   4. Database trigger sẽ tự tính AverageGrade = MidtermGrade*0.4 + FinalGrade*0.6
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.updateGrade = async (req, res) => {
  try {
    const { EnrollmentId, MidtermGrade, FinalGrade } = req.body;
    const TeacherId = req.user.UserId;

    // ========================================================
    // VALIDATE INPUT
    // ========================================================
    if (!EnrollmentId) {
      return res.status(400).json({
        success: false,
        message: 'EnrollmentId là bắt buộc',
      });
    }

    // Kiểm tra giá trị điểm (nếu có nhập)
    if (MidtermGrade !== null && MidtermGrade !== undefined) {
      if (isNaN(MidtermGrade) || MidtermGrade < 0 || MidtermGrade > 10) {
        return res.status(400).json({
          success: false,
          message: 'Điểm giữa kỳ phải từ 0 đến 10',
        });
      }
    }

    if (FinalGrade !== null && FinalGrade !== undefined) {
      if (isNaN(FinalGrade) || FinalGrade < 0 || FinalGrade > 10) {
        return res.status(400).json({
          success: false,
          message: 'Điểm cuối kỳ phải từ 0 đến 10',
        });
      }
    }

    const pool = await getConnection();

    // ========================================================
    // KIỂM TRA: Lấy thông tin lớp từ EnrollmentId
    // ========================================================
    const enrollResult = await pool.request()
      .input('EnrollmentId', sql.Int, EnrollmentId)
      .query(`
        SELECT e.EnrollmentId, e.ClassId, c.TeacherId
        FROM Enrollments e
        JOIN Classes c ON e.ClassId = c.ClassId
        WHERE e.EnrollmentId = @EnrollmentId
      `);

    if (!enrollResult.recordset || enrollResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đăng ký không tồn tại',
      });
    }

    const enrollData = enrollResult.recordset[0];

    // ========================================================
    // KIỂM TRA QUYỀN: Giáo viên có đúng là người dạy lớp này không?
    // ========================================================
    if (enrollData.TeacherId !== TeacherId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền nhập điểm cho lớp này',
      });
    }

    // ========================================================
    // GỌI STORED PROCEDURE: sp_UpdateGrade
    // ========================================================
    try {
      await pool.request()
        .input('EnrollmentId', sql.Int, EnrollmentId)
        .input('MidtermGrade', sql.Float, MidtermGrade || null)
        .input('FinalGrade', sql.Float, FinalGrade || null)
        .input('TeacherUserId', sql.UniqueIdentifier, TeacherId)
        .execute('sp_UpdateGrade');
    } catch (spError) {
      // Xử lý lỗi từ stored procedure
      if (spError.number === 50024) {
        return res.status(404).json({
          success: false,
          message: 'Đăng ký không tồn tại',
        });
      }
      if (spError.number === 50025) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền nhập điểm cho lớp này',
        });
      }
      throw spError;
    }

    // ========================================================
    // LẤY DỮ LIỆU SAU CẬP NHẬT
    // ========================================================
    const updatedResult = await pool.request()
      .input('EnrollmentId', sql.Int, EnrollmentId)
      .query(`
        SELECT e.EnrollmentId, e.ClassId, e.StudentId,
               e.MidtermGrade, e.FinalGrade, e.AverageGrade
        FROM Enrollments e
        WHERE e.EnrollmentId = @EnrollmentId
      `);

    const updatedData = updatedResult.recordset[0];

    return res.status(200).json({
      success: true,
      message: 'Cập nhật điểm thành công',
      data: {
        EnrollmentId: updatedData.EnrollmentId,
        ClassId: updatedData.ClassId,
        StudentId: updatedData.StudentId,
        MidtermGrade: updatedData.MidtermGrade,
        FinalGrade: updatedData.FinalGrade,
        AverageGrade: updatedData.AverageGrade,
      },
    });

  } catch (error) {
    console.error('❌ Lỗi khi cập nhật điểm:', error);

    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi cập nhật điểm',
      error: error.message,
    });
  }
};
