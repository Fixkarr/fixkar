import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/isAuth.js';
import { onboard } from '../controllers/ProfessionalsController/onboardController.js';
import upload from '../middlewares/multer.js';
import { getAllProfessionals, getAllVerifiedProfessionals } from '../controllers/ProfessionalsController/getAllProfessionals.js';
import { searchProfessionals } from '../controllers/CustomerController/searchController.js';
const userRoute = express.Router();

// /api/user

userRoute.get("/current", isAuth ,getCurrentUser);
userRoute.get("/professionals", isAuth ,getAllProfessionals);
userRoute.get("/verifiedProfessionals", getAllVerifiedProfessionals);
userRoute.get("/professionals/search", searchProfessionals);


// professionals routes

userRoute.post("/onboard",   upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "poi", maxCount: 1 },
  ]), isAuth, onboard);
export default userRoute;