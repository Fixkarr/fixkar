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
import { createForm } from '../AdminController/createForm.controller.js';
import { getAllForms } from '../AdminController/fetchAllForm.js';
import {isAuth} from '../../../middlewares/isAuth.js'
import { getFormByService } from '../AdminController/getFormByService.js';
import { getAllOffers } from '../AdminController/getAllOffers.js';
import { postAnnouncement } from '../AdminController/postAnnouncement.js';
import { deleteAnnouncement, getAllAnnouncements } from '../AdminController/announcements.controller.js';
import { createOffer } from '../AdminController/createOffer.js';
import { updateOfferById } from '../AdminController/updateOfferById.js';
import { getOfferById } from '../AdminController/getOfferById.js';
import { removeOffer } from '../AdminController/removeOffer.js';
import { deleteEnquiry, getEnquiries, replyEnquiry } from '../../contact.controller.js';
import { getPlatformTransactions } from '../AdminController/getPlatformTransactions.js';
import { getSiteHealth } from '../AdminController/getSiteHealth.js';
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


adminRouter.post('/forms', isAdmin, adminPermission('super_admin', 'content_admin'), createForm);
adminRouter.get('/get-all-forms', isAdmin, adminPermission('super_admin', 'content_admin'), getAllForms);
adminRouter.get('/get-form-by-service/:serviceId', isAuth, getFormByService);

adminRouter.post('/create-offer', isAdmin, adminPermission('super_admin'), createOffer);
adminRouter.get('/get-all-offers', isAdmin, adminPermission('super_admin', 'content_admin'), getAllOffers);
adminRouter.post('/update-offer/:offerId', isAdmin, adminPermission('super_admin'), updateOfferById)
adminRouter.get('/get-offer/:offerId', isAdmin, adminPermission('super_admin'), getOfferById)
adminRouter.delete('/delete-offer/:offerId', isAdmin, adminPermission('super_admin'), removeOffer)


// Announcement routes
adminRouter.post('/announcement', isAdmin, adminPermission('super_admin', 'content_admin'), upload.single('image'), postAnnouncement);
adminRouter.get('/get-announcements', isAdmin, adminPermission('super_admin', 'content_admin'), getAllAnnouncements);
adminRouter.delete('/delete-announcement/:id', isAdmin, adminPermission('super_admin', 'content_admin'), deleteAnnouncement);

// Enquiries

adminRouter.get('/get-enquiries', isAdmin, adminPermission('super_admin', 'support_admin'), getEnquiries);
adminRouter.post('/reply-enquiry/:enquiryId', isAdmin, adminPermission('super_admin', 'support_admin'), replyEnquiry);

adminRouter.delete('/delete-enquiry/:enquiryId', isAdmin, adminPermission('super_admin', 'support_admin'), deleteEnquiry);

// platform health
adminRouter.get('/get-platform-transactions', isAdmin, adminPermission('super_admin'), getPlatformTransactions)
adminRouter.get('/get-site-health', isAdmin, adminPermission('super_admin'), getSiteHealth);


export default adminRouter; 