const jwt = require('jsonwebtoken');
const { getConnection, sql } = require('../../config/db.config');

/**
 * Login controller
 *
 * Sử dụng stored procedure sp_AuthenticateUser:
 *   @Username VARCHAR(50),
 *   @Password NVARCHAR(255)
 * Trả về (khi thành công): UserId (UNIQUEIDENTIFIER), FullName (NVARCHAR), Email (VARCHAR), Role (VARCHAR)
 * Khi thất bại: stored procedure THROW lỗi 50001 với thông báo tương ứng.
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username và password là bắt buộc' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET chưa được cấu hình' });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('Username', sql.VarChar(50), username)   // Đúng kiểu VARCHAR(50)
      .input('Password', sql.NVarChar(255), password) // Đúng kiểu NVARCHAR(255)
      .execute('sp_AuthenticateUser');

    // Nếu stored procedure không throw lỗi, tức là đăng nhập thành công
    const user = result.recordset?.[0];

    if (!user) {
      // Trường hợp dự phòng (nếu stored procedure không throw nhưng recordset rỗng)
      return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
    }

    // Lấy RoleId từ bảng Roles dựa vào Role name
    const roleResult = await pool.request()
      .input('RoleName', sql.VarChar(50), user.Role)
      .query('SELECT RoleId FROM Roles WHERE RoleName = @RoleName');

    const roleId = roleResult.recordset?.[0]?.RoleId || 3; // Mặc định RoleId = 3 (Student)

    // Payload cho JWT: sử dụng UserId, RoleId (số) và Role (tên quyền)
    const payload = {
      UserId: user.UserId,
      RoleId: roleId,     // RoleId: 1 (Admin), 2 (Teacher), 3 (Student)
      Role: user.Role,    // Vai trò dạng string: 'Admin', 'Teacher', 'Student'
      FullName: user.FullName,
      Email: user.Email,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '2h',
    });

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      data: {
        UserId: user.UserId,
        Username: username,
        FullName: user.FullName,
        Email: user.Email,
        Role: user.Role,
      },
    });
  } catch (error) {
    // Xử lý lỗi từ stored procedure (THROW với error number 50001)
    if (error.number === 50001 || (error.message && error.message.includes('Sai tên đăng nhập hoặc mật khẩu'))) {
      return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu, hoặc tài khoản đã bị khóa' });
    }
    // Các lỗi khác (kết nối DB, thiếu cấu hình,...) chuyển cho middleware xử lý lỗi chung
    return next(error);
  }
};

module.exports = {
  login,
};