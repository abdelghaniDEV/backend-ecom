// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const authorize =  (roles) => async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email })
    if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

module.exports = { authenticate, authorize };
