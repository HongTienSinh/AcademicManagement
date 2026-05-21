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
