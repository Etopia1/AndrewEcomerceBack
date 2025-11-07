const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const NewmarchModel = require("../models/NewmarChModel");

// Helper to decode JWT safely
const decodeToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw { code: 401, message: "Authorization header missing" };

  const token = authHeader.split(" ")[1];
  if (!token) throw { code: 401, message: "Please log in to continue" };

  // ✅ Match your exact env var name (JWT_SECRET)
  const decoded = jwt.verify(token, process.env.jwt_secret);
  return { token, decoded };
};

// For regular customers
const authenticate = async (req, res, next) => {
  try {
    const { token, decoded } = decodeToken(req);
    const userId = decoded.id || decoded.userId;
    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.blackList?.includes(token))
      return res.status(401).json({ message: "Token blacklisted. Log in again." });

    req.user = user;
    next();
  } catch (err) {
    handleError(err, res);
  }
};

// For merchants
const authorize = async (req, res, next) => {
  try {
    const { token, decoded } = decodeToken(req);
    const merchantId = decoded.userId || decoded.id;
    const merchant = await NewmarchModel.findById(merchantId);

    if (!merchant) return res.status(404).json({ message: "Merchant not found" });
    if (!merchant.isVerified)
      return res.status(403).json({ message: "Account not verified. Please verify your email." });
    if (merchant.blackList?.includes(token))
      return res.status(401).json({ message: "Session expired. Please sign in again." });

    req.user = merchant;
    next();
  } catch (err) {
    handleError(err, res);
  }
};

// Optional: Super admin middleware
const isSuperAdmin = async (req, res, next) => {
  try {
    const { token, decoded } = decodeToken(req);
    const userId = decoded.id || decoded.userId;
    const user = await userModel.findById(userId);

    if (!user || !user.isSuperAdmin)
      return res.status(403).json({ message: "Access denied. Super admin only." });

    req.user = user;
    next();
  } catch (err) {
    handleError(err, res);
  }
};

// Centralized error handler
const handleError = (err, res) => {
  if (err.name === "TokenExpiredError")
    return res.status(401).json({ message: "Token expired. Please log in again." });
  if (err.name === "JsonWebTokenError")
    return res.status(401).json({ message: "Oops! Access denied. Please sign in." });
  if (err.code)
    return res.status(err.code).json({ message: err.message });

  return res.status(500).json({ message: err.message || "Internal Server Error" });
};

module.exports = {
  authenticate,
  authorize,
  isSuperAdmin,
};
