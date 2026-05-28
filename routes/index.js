const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const classRoutes = require('./class.routes');
const studentRoutes = require('./student.routes');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Kiểm tra trạng thái server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

router.use('/', authRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);

module.exports = router;
