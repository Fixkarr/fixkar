import express from 'express'
import { getCurrentUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/isAuth.js';
import { onboard } from '../controllers/ProfessionalsController/onboardController.js';
import upload from '../middlewares/multer.js';
import { getAllProfessionals, getAllVerifiedProfessionals } from '../controllers/ProfessionalsController/getAllProfessionals.js';
import { searchProfessionals } from '../controllers/CustomerController/searchController.js';
import { completeProfile } from '../controllers/ProfessionalsController/completeProfile.js';
import { setBusyDays } from '../controllers/ProfessionalsController/busyDays.controller.js';
import {updateProfileInfo, updateProfilePicture, updateSkills, uploadMedia } from '../controllers/updateProfile.controller.js';
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
import { saveFormResponse } from '../controllers/saveFormResponse.controller.js';
import { getBanks } from '../controllers/Admin/AdminController/bank.controller.js';
import { getMyAnnouncements } from '../controllers/getMyAnnouncements.js';
import { sendEnquiry } from '../controllers/contact.controller.js';
import { getProfessionalPickupRequests } from '../controllers/ProfessionalsController/getPickupRequests.controller.js';
import { acceptPickupRequest, rejectPickupRequest } from '../controllers/ProfessionalsController/pickup.controller.js';
import { claimCouponController, validateCouponController, applyCouponToBookingController, getMyCouponClaims } from '../controllers/CouponController/coupon.controller.js';
const userRoute = express.Router();

userRoute.get("/current", isAuth ,getCurrentUser);
userRoute.get("/professionals", isAuth, isAdmin, getAllProfessionals);
userRoute.get("/verifiedProfessionals", isAuth, getAllVerifiedProfessionals);
userRoute.get("/getUserById/:userId", getUserById);
userRoute.get("/professionals/search", searchProfessionals);
userRoute.get("/get-service-skills/:serviceId", getServiceSkills)

userRoute.post("/onboard", isAuth, upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "poi", maxCount: 1 },
  ]), multerErrorHandler, onboard);

userRoute.post("/professional/complete-profile", isAuth, completeProfile);
userRoute.post("/professional/set-busy-days", isAuth, setBusyDays)
userRoute.post('/professional/bank-details', isAuth, upload.single("passbookImage"), multerErrorHandler, bankDetails)
userRoute.get('/professional/get-transactions/:proId', isAuth, getTransaction)
userRoute.post('/professional/send-withdrawn-request', isAuth, sendWithDrawRequest);

userRoute.post("/update-profile-picture", isAuth, upload.fields([{name : "profilePicture", maxCount : 1 }]), multerErrorHandler, updateProfilePicture)
userRoute.post("/update-profile-info", isAuth, updateProfileInfo)
userRoute.post('/professional/update-skills', isAuth, updateSkills)
userRoute.post('/upload-media', isAuth, uploadMedia)
userRoute.get('/signature', isAuth, getCloudinarySignature);
userRoute.delete('/delete-media/:mediaId', isAuth, deleteMedia)

userRoute.get('/get-services', getServices)
userRoute.post('/save-form-response', isAuth, saveFormResponse);
userRoute.get('/get-banks', isAuth, getBanks);

// Coupon system: no endpoint returns all active offers to the user.
userRoute.post('/coupons/validate', isAuth, validateCouponController);
userRoute.post('/coupons/claim', isAuth, claimCouponController);
userRoute.get('/coupons/my-claims', isAuth, getMyCouponClaims);
userRoute.post('/coupons/apply-to-booking', isAuth, applyCouponToBookingController);

userRoute.get('/get-my-announcements', isAuth, getMyAnnouncements);
userRoute.post('/send-enquiry', sendEnquiry);

userRoute.get('/professional/pickup-requests', isAuth, getProfessionalPickupRequests)
userRoute.post('/professional/pickup-request-accept', isAuth, acceptPickupRequest)
userRoute.post('/professional/pickup-request-reject', isAuth, rejectPickupRequest)
export default userRoute;
