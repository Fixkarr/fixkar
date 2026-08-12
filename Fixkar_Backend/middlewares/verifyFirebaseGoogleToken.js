import admin from "../config/firebaseAdmin.js";

/**
 * Verifies the Firebase ID token issued by the web Google sign-in flow.
 * The verified identity is written back to req.body so existing auth
 * controllers can continue using their current request contract.
 */
export const verifyFirebaseGoogleToken = async (req, res, next) => {
  try {
    const { idToken } = req.body || {};

    if (!idToken) {
      return res.status(400).json({
        message: "Google sign-in could not be completed. Please try again.",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const provider = decodedToken?.firebase?.sign_in_provider;

    if (
      !decodedToken?.email ||
      !decodedToken.email_verified ||
      provider !== "google.com"
    ) {
      return res.status(401).json({
        message: "Google sign-in could not be completed. Please try again.",
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
      message: "Google sign-in could not be completed. Please try again.",
    });
  }
};
