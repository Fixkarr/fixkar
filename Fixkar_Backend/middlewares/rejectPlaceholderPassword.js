// Google-created accounts in older versions used a placeholder password ("pass").
// Never allow that placeholder through the normal email/password login flow.
// This keeps existing accounts safe without changing the authentication architecture.
export const rejectPlaceholderPassword = (req, res, next) => {
  if (req.body?.password === "pass") {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  next();
};
