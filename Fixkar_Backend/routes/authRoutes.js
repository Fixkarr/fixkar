// authRoutes.js
import express from 'express';
import { login, signOut, registerUserWithForm, googleAuthSignup, googleAuthLogin, googleAuthLoginNative, googleAuthSignupNative } from '../controllers/auth/userAuth.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';
import { verifyFirebaseGoogleToken } from '../middlewares/verifyFirebaseGoogleToken.js';

const authRouter = express.Router();

authRouter.post("/signup-customer", registerUserWithForm);
authRouter.post("/login", login);
authRouter.post("/logout", signOut);

authRouter.post("/google-auth-signup", verifyFirebaseGoogleToken, googleAuthSignup);
authRouter.post("/google-auth-login", verifyFirebaseGoogleToken, googleAuthLogin);

authRouter.post("/google-auth-login-native", googleAuthLoginNative);
authRouter.post("/google-auth-signup-native", googleAuthSignupNative);

// Password reset requires a reset authorization cookie issued after successful email OTP verification.
authRouter.post("/request-reset-password", resetPassword);

export default authRouter;