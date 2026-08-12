import admin from "../config/firebaseAdmin.js";

/**
 * Verifies the Firebase ID token issued by the web/native Google sign-in flow.
 * The verified identity is written back to req.body so existing auth
 * controllers can continue using their current request contract.
 */
export const verifyFirebaseGoogleToken = async (req, res, next) => {
  try {
    const { idToken } = req.body || {};

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase ID Token is required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken?.email || !decodedToken.email_verified) {
      return res.status(401).json({
        message: "Google email is not verified",
      });
    }

    req.body.email = decodedToken.email;

    if (!req.body.fullName) {
      req.body.fullName = decodedToken.name || "";
    }

    next();
  } catch (error) {
    console.error("Google token verification error:", error);
    return res.status(401).json({
      message: "Invalid or expired Google authentication token",
    });
  }
};
