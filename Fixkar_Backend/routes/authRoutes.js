// authRoutes.js
import express from 'express';
import { login, signOut, registerUserWithForm } from '../controllers/auth/userAuth.js';
import { googleAuthSignup, googleAuthLogin, googleAuthLoginNative, googleAuthSignupNative } from '../controllers/auth/googleAuth.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';
import { verifyFirebaseGoogleToken } from '../middlewares/verifyFirebaseGoogleToken.js';
import { rejectPlaceholderPassword } from '../middlewares/rejectPlaceholderPassword.js';
import { loginRateLimiter, passwordResetRateLimiter, signupRateLimiter } from '../middlewares/rateLimiters.js';

const authRouter = express.Router();

authRouter.post("/signup-customer", signupRateLimiter, registerUserWithForm);
authRouter.post("/login", loginRateLimiter, rejectPlaceholderPassword, login);
authRouter.post("/logout", signOut);

authRouter.post("/google-auth-signup", signupRateLimiter, verifyFirebaseGoogleToken, googleAuthSignup);
authRouter.post("/google-auth-login", loginRateLimiter, verifyFirebaseGoogleToken, googleAuthLogin);
authRouter.post("/google-auth-login-native", loginRateLimiter, googleAuthLoginNative);
authRouter.post("/google-auth-signup-native", signupRateLimiter, googleAuthSignupNative);

authRouter.post("/request-reset-password", passwordResetRateLimiter, resetPassword);

export default authRouter;
