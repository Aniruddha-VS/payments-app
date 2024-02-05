const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies["sample-paytms-cookie"];
  if (!token) {
    return res.status(403).json({
      message: "No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "token invalid",
    });
  }
};

module.exports = {
  authMiddleware,
};
