import express from 'express'
import { adminSignup } from '../AdminController/adminSignup.js';
import { adminLogin } from '../AdminController/adminLogin.js';
import { getCurrentAdmin } from '../AdminController/getCurrentAdmin.js';
import { isAdmin } from '../../../middlewares/isAdmin.js';
import { adminPermission } from '../../../middlewares/adminPermission.js';
import { addService } from '../AdminController/addService.js';
import upload from '../../../middlewares/multer.js'
import { getAllCustomers } from '../AdminController/getAllCustomers.js';
import { getAllProfessionals } from '../../ProfessionalsController/getAllProfessionals.js';
import { acceptApplication } from '../AdminController/acceptProApplication.js';
import { rejectApplication } from '../AdminController/rejectProApplication.js';
import { updateService } from '../AdminController/updateService.js';
import { getAdminBookingById, getBookings } from '../AdminController/getBookings.js';
import { acceptBankDetail } from '../AdminController/acceptBankDetail.js';
import { rejectBankDetail } from '../AdminController/rejectBankDetail.js';
import { getWithdrawnRequests } from '../AdminController/getWithdrawnRequests.js';
import { manualPay } from '../AdminController/manualPay.controller.js';

const adminRouter = express.Router()

// /api/admin 

adminRouter.post('/signup', adminSignup)
adminRouter.post('/login', adminLogin)
adminRouter.get('/get-current-admin', isAdmin, getCurrentAdmin);

adminRouter.post('/create-service', isAdmin, adminPermission('super_admin', 'content_admin'), upload.single('image'), addService)
adminRouter.post('/update-service/:serviceId', isAdmin, adminPermission('super_admin', 'content_admin'), upload.single('image'), updateService)

adminRouter.get('/get-all-customers', isAdmin, adminPermission('super_admin', 'professional_admin'), getAllCustomers);
adminRouter.get('/get-all-professionals', isAdmin, adminPermission('super_admin', 'professional_admin'), getAllProfessionals)

adminRouter.get('/get-all-bookings', isAdmin, adminPermission('super_admin', 'booking_admin'),getBookings)
adminRouter.get('/get-admin-booking/:bookingId', isAdmin, adminPermission('super_admin', 'booking_admin'),getAdminBookingById)


adminRouter.post('/accept-professional-application', isAdmin, adminPermission('super_admin', 'professional_admin'), acceptApplication);
adminRouter.post('/reject-professional-application', isAdmin, adminPermission('super_admin', 'professional_admin'), rejectApplication);

adminRouter.post('/approve-bank/:proId', isAdmin, adminPermission('super_admin', 'professional_admin'), acceptBankDetail);
adminRouter.post('/reject-bank/:proId', isAdmin, adminPermission('super_admin', 'professional_admin'), rejectBankDetail);


adminRouter.get('/get-withdrawn-requests', isAdmin, adminPermission('super_admin', 'professional_admin'), getWithdrawnRequests);
adminRouter.post('/manual-pay', isAdmin, adminPermission('super_admin'), manualPay)


export default adminRouter;