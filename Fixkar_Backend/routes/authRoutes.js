// authRoutes.js
import jwt from 'jsonwebtoken';
import express from 'express';
import { login, resetPassword, signOut,  registerUserWithForm, googleAuthSignup, googleAuthLogin, googleAuthLoginNative, googleAuthSignupNative } from '../controllers/auth/userAuth.js';



const authRouter = express.Router();

authRouter.post("/signup-customer", registerUserWithForm);
authRouter.post("/login", login);
authRouter.post("/logout", signOut)
authRouter.post("/google-auth-signup", googleAuthSignup);
authRouter.post("/google-auth-login", googleAuthLogin);

authRouter.post("/google-auth-login-native", googleAuthLoginNative);
authRouter.post("/google-auth-signup-native", googleAuthSignupNative);

// reset password routes

authRouter.post("/request-reset-password", resetPassword)
export default authRouter;