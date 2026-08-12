export const adminLogout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Admin logout successful",
    });
  } catch (error) {
    console.error("adminLogout error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
