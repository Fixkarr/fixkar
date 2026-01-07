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

const adminRouter = express.Router()

adminRouter.post('/signup', adminSignup)
adminRouter.post('/login', adminLogin)
adminRouter.get('/get-current-admin', isAdmin, getCurrentAdmin);

adminRouter.post('/create-service', isAdmin, adminPermission('super_admin', 'content_admin'), upload.single('image'), addService)

adminRouter.get('/get-all-customers', isAdmin, adminPermission('super_admin'), getAllCustomers);
adminRouter.get('/get-all-professionals', isAdmin, adminPermission('super_admin', 'professional_admin'), getAllProfessionals)
export default adminRouter;