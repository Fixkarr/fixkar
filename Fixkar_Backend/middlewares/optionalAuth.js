import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    // Guest user — token nahi hai
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token valid hai to userId attach karo
    if (decoded?.userId) {
      req.userId = decoded.userId;
    }

    return next();
  } catch (error) {
    console.warn(
      "Optional authentication skipped:",
      error?.message || error
    );

    return next();
  }
};