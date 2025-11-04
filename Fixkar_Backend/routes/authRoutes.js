// authRoutes.js
import jwt from 'jsonwebtoken';
import express from 'express';
import { googleAuth, login, resetPassword, signOut,  registerUserWithForm } from '../controllers/auth/userAuth.js';



const authRouter = express.Router();

authRouter.post("/signup-customer", registerUserWithForm);
authRouter.post("/login", login);
authRouter.post("/logout", signOut)
authRouter.post("/google-auth", googleAuth);

// reset password routes

authRouter.post("/request-reset-password", resetPassword)
export default authRouter;