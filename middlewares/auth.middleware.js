const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token không tồn tại' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.RoleId !== 1) {
    return res.status(403).json({ error: 'Yêu cầu quyền Quản trị viên' });
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (!req.user || req.user.RoleId !== 2) {
    return res.status(403).json({ error: 'Yêu cầu quyền Giảng viên' });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (!req.user || req.user.RoleId !== 3) {
    return res.status(403).json({ error: 'Yêu cầu quyền Sinh viên' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isTeacher,
  isStudent,
};
