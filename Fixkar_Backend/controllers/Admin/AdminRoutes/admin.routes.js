import express from 'express'
import { adminSignup } from '../AdminController/adminSignup.js';
import { adminLogin } from '../AdminController/adminLogin.js';
import { isAuth } from '../../../middlewares/isAuth.js';
import { getCurrentAdmin } from '../AdminController/getCurrentAdmin.js';

const adminRouter = express.Router()

adminRouter.post('/signup', adminSignup)
adminRouter.post('/login', adminLogin)
adminRouter.get('/get-current-admin', isAuth, getCurrentAdmin);

export default adminRouter;