const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const normalizeOrigin = (value) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

export const csrfOriginCheck = (req, res, next) => {
  if (!UNSAFE_METHODS.has(req.method)) {
    return next();
  }

  // Only cookie-authenticated requests are vulnerable to browser CSRF.
  // Login/signup/webhook requests without an authenticated cookie are left unchanged.
  if (!req.cookies?.token && !req.cookies?.adminToken) {
    return next();
  }

  const allowedOrigin = normalizeOrigin(process.env.FRONTEND_URL);
  const requestOrigin = normalizeOrigin(req.get("origin"));
  const refererOrigin = normalizeOrigin(req.get("referer"));

  if (
    allowedOrigin &&
    (requestOrigin === allowedOrigin || refererOrigin === allowedOrigin)
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Cross-origin request blocked",
  });
};
