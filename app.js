require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDB } = require('./config/db.config');

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const classRoutes = require('./routes/class.routes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Academic Manager API',
      version: '1.0.0',
      description: 'API quản lý học vụ',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Xác thực và quản lý tài khoản người dùng',
      },
      {
        name: 'Courses',
        description: 'Quản lý môn học và thông tin môn học',
      },
      {
        name: 'Enrollments',
        description: 'Quản lý đăng ký học phần và điểm số',
      },
      {
        name: 'Classes',
        description: 'Quản lý lớp học phần và danh sách lớp',
      },
      {
        name: 'System',
        description: 'Kiểm tra trạng thái hệ thống',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Token - Lấy token từ API đăng nhập, sau đó đưa vào header: Authorization: Bearer <token>',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Đường dẫn tới file chứa route comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/classes', classRoutes);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/auth', authRoutes);


// Routes
app.use('/api', require('./routes/index'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  try {
    // Kết nối Database trước khi khởi động server
    await connectDB();

    app.listen(PORT, () => {
      console.log('\n=====================================');
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log('=====================================\n');
    });
  } catch (error) {
    console.error('\n❌ Không thể khởi động server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
