const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from Bearer

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Store user info for further use
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};