import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/isAuth.js';
import { onboard } from '../controllers/ProfessionalsController/onboardController.js';
import upload from '../middlewares/multer.js';
import { getAllProfessionals, getAllVerifiedProfessionals } from '../controllers/ProfessionalsController/getAllProfessionals.js';
import { searchProfessionals } from '../controllers/CustomerController/searchController.js';
import { completeProfile } from '../controllers/ProfessionalsController/completeProfile.js';
import { setBusyDays } from '../controllers/ProfessionalsController/busyDays.controller.js';
import { updateCharge, updateProfileInfo, updateProfilePicture, updateSkills, uploadMedia } from '../controllers/updateProfile.controller.js';
import multerErrorHandler from '../middlewares/multerErrorHandler.js';
import { getUserById } from '../controllers/getUserById.controller.js';
import { getCloudinarySignature } from '../controllers/ProfessionalsController/getCloudinarySignature.js';
import { deleteMedia } from '../controllers/ProfessionalsController/deleteMedia.js';
import { getServices } from '../controllers/getServices.controller.js';
import { getServiceSkills } from '../controllers/getServiceSkills.controller.js';
import { bankDetails } from '../controllers/ProfessionalsController/bankDetails.controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { getTransaction } from '../controllers/ProfessionalsController/getTransactions.controller.js';
import { sendWithDrawRequest } from '../controllers/ProfessionalsController/sendWithdrawRequest.js';
const userRoute = express.Router();

// /api/user

userRoute.get("/current", isAuth ,getCurrentUser);
userRoute.get("/professionals", isAuth, isAdmin, getAllProfessionals);
userRoute.get("/verifiedProfessionals", isAuth, getAllVerifiedProfessionals);
userRoute.get("/getUserById/:userId", getUserById);
userRoute.get("/professionals/search", searchProfessionals);
userRoute.get("/get-service-skills/:serviceId", getServiceSkills)


// professionals routes

userRoute.post("/onboard",   upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "poi", maxCount: 1 },
  ]), multerErrorHandler, isAuth, onboard);

  

 userRoute.post("/professional/complete-profile", isAuth, completeProfile);
 userRoute.post("/professional/set-busy-days", isAuth, setBusyDays)
 userRoute.post('/professional/bank-details', isAuth, upload.single("passbookImage"), multerErrorHandler, bankDetails)
 userRoute.get('/professional/get-transactions/:proId', isAuth, getTransaction)
 userRoute.post('/professional/send-withdrawn-request', isAuth, sendWithDrawRequest);


// update profile
userRoute.post("/update-profile-picture", upload.fields([
    {name : "profilePicture", maxCount : 1}
  ]), multerErrorHandler, isAuth ,updateProfilePicture)


userRoute.post("/update-profile-info", isAuth, updateProfileInfo)
userRoute.post("/update-charges", isAuth, updateCharge);
userRoute.post('/professional/update-skills', isAuth, updateSkills)

//gallery
userRoute.post('/upload-media', isAuth, uploadMedia)
userRoute.get('/signature', getCloudinarySignature);
userRoute.delete('/delete-media/:mediaId', isAuth, deleteMedia)

//service

userRoute.get('/get-services', getServices)




 export default userRoute;