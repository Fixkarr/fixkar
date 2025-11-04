import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/isAuth.js';
import { onboard } from '../controllers/ProfessionalsController/onboardController.js';
import upload from '../middlewares/multer.js';
const userRoute = express.Router();

// /api/user

userRoute.get("/current", isAuth ,getCurrentUser);


// professionals routes

userRoute.post("/onboard",   upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "poi", maxCount: 1 },
  ]), isAuth, onboard);
export default userRoute;