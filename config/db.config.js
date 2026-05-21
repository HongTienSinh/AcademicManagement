const sql = require('mssql');

// Cấu hình kết nối SQL Server từ file .env
const sqlConfig = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'AcademicManagement',
  port: parseInt(process.env.DB_PORT) || 1433,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || '',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableKeepAlive: true,
    connectionTimeout: 15000,
    requestTimeout: 30000,
  },
};

let pool = null;

/**
 * Kết nối đến SQL Server và thiết lập Connection Pool
 * @returns {Promise<sql.ConnectionPool>}
 */
const connectDB = async () => {
  try {
    // Nếu pool đã tồn tại và đang kết nối, trả về pool đó
    if (pool && pool.connected) {
      console.log('✅ Sử dụng kết nối Database hiện tại');
      return pool;
    }

    console.log('🔄 Đang kết nối đến SQL Server...');
    console.log(`   Server: ${sqlConfig.server}:${sqlConfig.options.port}`);
    console.log(`   Database: ${sqlConfig.database}`);
    console.log(`   User: ${sqlConfig.authentication.options.userName}`);

    // Tạo Connection Pool mới
    pool = new sql.ConnectionPool(sqlConfig);

    // Event: Kết nối thành công
    pool.on('connect', () => {
      console.log('✅ Connection Pool đã được khởi tạo');
    });

    // Event: Lỗi kết nối
    pool.on('error', (error) => {
      console.error('❌ Lỗi từ Connection Pool:', error);
      pool = null; // Reset pool khi gặp lỗi
    });

    // Kết nối đến database
    await pool.connect();

    console.log('✅ ✅ ✅ Kết nối SQL Server thành công! ✅ ✅ ✅');
    return pool;
  } catch (error) {
    console.error('❌ LỖI: Không thể kết nối đến SQL Server');
    console.error(`   Lỗi chi tiết: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    pool = null;
    throw error;
  }
};

/**
 * Lấy Connection Pool hiện tại
 * @returns {Promise<sql.ConnectionPool>}
 */
const getConnection = async () => {
  try {
    if (!pool || !pool.connected) {
      return await connectDB();
    }
    return pool;
  } catch (error) {
    console.error('❌ Lỗi khi lấy connection:', error.message);
    throw error;
  }
};

/**
 * Ngắt kết nối khỏi SQL Server
 */
const disconnectDB = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✅ Đã ngắt kết nối SQL Server');
    }
  } catch (error) {
    console.error('❌ Lỗi khi ngắt kết nối:', error.message);
    throw error;
  }
};

module.exports = {
  connectDB,
  getConnection,
  disconnectDB,
  sql,
  sqlConfig,
};
