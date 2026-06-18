const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../app/controllers/AdminDashboard.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/dashboard/admin-stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Thống kê tổng quan cho trang Dashboard của Admin
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers: { type: integer, example: 45 }
 *                     totalDepartments: { type: integer, example: 8 }
 *                     totalCourses: { type: integer, example: 32 }
 *                     totalClasses: { type: integer, example: 24 }
 *       403:
 *         description: Không có quyền truy cập (không phải Admin)
 */
router.get('/admin-stats', verifyToken, isAdmin, getAdminStats);

module.exports = router;