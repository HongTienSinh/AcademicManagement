const sql = require('mssql');
const { connectDB } = require('../../config/db.config');

// Thống kê cho trang Dashboard của Admin
const getAdminStats = async (req, res) => {
  try {
    const pool = await connectDB();

    const [usersResult, deptResult, courseResult, classResult] = await Promise.all([
      pool.request().query('SELECT COUNT(*) AS total FROM Users'),
      pool.request().query('SELECT COUNT(*) AS total FROM Departments'),
      pool.request().query('SELECT COUNT(*) AS total FROM Courses'),
      pool.request().query('SELECT COUNT(*) AS total FROM Classes'),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Lấy thống kê dashboard thành công',
      data: {
        totalUsers: usersResult.recordset[0].total,
        totalDepartments: deptResult.recordset[0].total,
        totalCourses: courseResult.recordset[0].total,
        totalClasses: classResult.recordset[0].total,
      },
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê dashboard admin:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy thống kê dashboard từ cơ sở dữ liệu',
    });
  }
};

module.exports = {
  getAdminStats,
};