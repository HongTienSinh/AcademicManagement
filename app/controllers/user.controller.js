const { getConnection, sql } = require('../../config/db.config');

/**
 * Get all users - Lấy danh sách tất cả người dùng (có hỗ trợ phân trang và tìm kiếm)
 * Được sử dụng bởi Admin để xem tất cả tài khoản
 * 
 * Query parameters:
 *   - page: số trang (mặc định 1)
 *   - limit: số bản ghi trên một trang (mặc định 10)
 *   - search: tìm kiếm theo FullName hoặc Username (tùy chọn)
 */
const getUsers = async (req, res, next) => {
  try {
    // Lấy page, limit, và search từ query
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim() : null;

    // Validation: page và limit phải lớn hơn 0
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'page và limit phải lớn hơn 0' });
    }

    // Tính offset để dùng trong OFFSET ... ROWS
    const offset = (page - 1) * limit;

    const pool = await getConnection();

    // Xây dựng WHERE clause nếu có search
    let whereClause = '';
    let request = pool.request();

    if (search) {
      whereClause = 'WHERE u.FullName LIKE @search OR u.Username LIKE @search';
      request = request.input('search', sql.NVarChar(255), `%${search}%`);
    }

    // Bước 1: Lấy tổng số bản ghi (có lọc nếu có search)
    const countResult = await request
      .query(`SELECT COUNT(*) as total FROM Users u ${whereClause}`);
    const totalItems = countResult.recordset[0].total;

    // Bước 2: Lấy dữ liệu có phân trang sử dụng OFFSET ... ROWS FETCH NEXT ... ROWS ONLY
    const result = await request
      .query(`
        SELECT 
          u.UserId,
          u.Username,
          u.FullName,
          u.Email,
          u.IsActive,
          r.RoleId,
          r.RoleName
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.RoleId
        ${whereClause}
        ORDER BY u.FullName
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
      `);

    // Bước 3: Tính tổng số trang
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      message: 'Lấy danh sách người dùng thành công',
      data: result.recordset || [],
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limit,
      },
      ...(search && { search: search }), // Trả về search nếu có
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user by ID - Lấy thông tin chi tiết một người dùng
 */
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'UserId là bắt buộc' });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT 
          u.UserId,
          u.Username,
          u.FullName,
          u.Email,
          u.IsActive,
          r.RoleId,
          r.RoleName
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.RoleId
        WHERE u.UserId = @UserId
      `);

    const user = result.recordset?.[0];
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    return res.status(200).json({
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Create user - Tạo tài khoản người dùng mới
 * 
 * Sử dụng stored procedure sp_CreateUser:
 *   @Username VARCHAR(50),
 *   @Password NVARCHAR(255),
 *   @FullName NVARCHAR(100),
 *   @Email VARCHAR(100),
 *   @RoleId INT
 */
const createUser = async (req, res, next) => {
  try {
    const { username, password, fullName, email, roleId } = req.body;

    // Validation
    if (!username || !password || !fullName || !email || roleId === undefined) {
      return res.status(400).json({
        error: 'username, password, fullName, email, roleId là bắt buộc',
      });
    }

    if (roleId < 1 || roleId > 3) {
      return res.status(400).json({
        error: 'roleId phải là 1 (Admin), 2 (Teacher), hoặc 3 (Student)',
      });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('Username', sql.VarChar(50), username)
      .input('Password', sql.NVarChar(255), password)
      .input('FullName', sql.NVarChar(100), fullName)
      .input('Email', sql.VarChar(100), email)
      .input('RoleId', sql.Int, roleId)
      .execute('sp_CreateUser');

    // Nếu không throw lỗi, tức là tạo user thành công
    const newUser = result.recordset?.[0];

    return res.status(201).json({
      message: 'Tạo tài khoản người dùng thành công',
      data: {
        UserId: newUser?.UserId,
        Username: newUser?.Username,
        FullName: newUser?.FullName,
        Email: newUser?.Email,
      },
    });
  } catch (error) {
    // Xử lý các lỗi cụ thể từ stored procedure
    if (error.number === 50010) {
      return res.status(400).json({ error: 'Tên người dùng đã tồn tại' });
    }
    if (error.number === 50011) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }
    if (error.number === 50012) {
      return res.status(400).json({ error: 'RoleId không hợp lệ' });
    }
    return next(error);
  }
};

/**
 * Update user - Cập nhật thông tin người dùng
 * 
 * Sử dụng stored procedure sp_UpdateUser:
 *   @UserId UNIQUEIDENTIFIER,
 *   @FullName NVARCHAR(100),
 *   @Email VARCHAR(100),
 *   @RoleId INT
 */
const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { fullName, email, roleId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'UserId là bắt buộc' });
    }

    // Ít nhất một trường phải được cập nhật
    if (!fullName && !email && roleId === undefined) {
      return res.status(400).json({
        error: 'Ít nhất một trong fullName, email, hoặc roleId phải được cung cấp',
      });
    }

    if (roleId !== undefined && (roleId < 1 || roleId > 3)) {
      return res.status(400).json({
        error: 'roleId phải là 1 (Admin), 2 (Teacher), hoặc 3 (Student)',
      });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('FullName', sql.NVarChar(100), fullName || null)
      .input('Email', sql.VarChar(100), email || null)
      .input('RoleId', sql.Int, roleId || null)
      .execute('sp_UpdateUser');

    const updatedUser = result.recordset?.[0];

    return res.status(200).json({
      message: 'Cập nhật thông tin người dùng thành công',
      data: updatedUser,
    });
  } catch (error) {
    if (error.number === 50013) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    if (error.number === 50014) {
      return res.status(400).json({ error: 'Email đã được sử dụng bởi người dùng khác' });
    }
    if (error.number === 50015) {
      return res.status(400).json({ error: 'RoleId không hợp lệ' });
    }
    return next(error);
  }
};

/**
 * Deactivate/Activate user - Vô hiệu hóa hoặc kích hoạt tài khoản
 * 
 * Sử dụng stored procedure sp_DeactivateUser:
 *   @UserId UNIQUEIDENTIFIER
 * (Procedure này sẽ đảo ngược giá trị IsActive)
 * 
 * LƯU Ý: Procedure đảo ngược trạng thái, nên:
 * - Gọi 1 lần để vô hiệu hóa (nếu đang active)
 * - Gọi lần 2 để kích hoạt lại (nếu đang inactive)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'UserId là bắt buộc' });
    }

    const pool = await getConnection();

    // Gọi stored procedure sp_DeactivateUser để đảo ngược trạng thái
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .execute('sp_DeactivateUser');

    const updatedUser = result.recordset?.[0];

    if (!updatedUser) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    return res.status(200).json({
      message: `Cập nhật trạng thái người dùng thành công (${updatedUser.IsActive ? 'Kích hoạt' : 'Vô hiệu hóa'})`,
      data: updatedUser,
    });
  } catch (error) {
    // Xử lý lỗi từ stored procedure
    if (error.number === 50016) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    return next(error);
  }
};

/**
 * Delete user - Xóa tài khoản người dùng
 */
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'UserId là bắt buộc' });
    }

    const pool = await getConnection();

    // Kiểm tra user có tồn tại không
    const checkUser = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .query('SELECT UserId, Username FROM Users WHERE UserId = @UserId');

    if (!checkUser.recordset?.[0]) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    const username = checkUser.recordset[0].Username;

    // Xóa user
    await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .query('DELETE FROM Users WHERE UserId = @UserId');

    return res.status(200).json({
      message: `Xóa tài khoản người dùng "${username}" thành công`,
      deletedUserId: userId,
    });
  } catch (error) {
    // Xử lý lỗi ràng buộc khóa ngoại
    if (error.message && error.message.includes('FOREIGN KEY')) {
      return res.status(400).json({
        error: 'Không thể xóa người dùng này vì có dữ liệu liên quan (lớp, đăng ký, v.v.)',
      });
    }
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};
