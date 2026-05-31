import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found with this token!" });
      }

      if (req.user.status === "Blocked") {
        return res.status(403).json({
          success: false,
          message: "Your shop account is blocked by Admin! Contact Agency.",
        });
      }

      next();
    } catch (error) {
      console.error(`❌ JWT Auth Error: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token validation failed!",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied! No security token provided in headers.",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden! Role (${req.user?.role || "Guest"}) is not allowed to access this commercial endpoint.`,
      });
    }
    next();
  };
};
