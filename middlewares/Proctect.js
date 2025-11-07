const jwt = require("jsonwebtoken");
const NewmarchModel = require("../models/NewmarChModel");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Oops! Access denied. Please sign in.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    const user = await NewmarchModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found or invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
