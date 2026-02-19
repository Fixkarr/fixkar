import express from 'express';
import { getProfessionalInfo } from '../controllers/CustomerController/getProfessionalInfo.js';
import { isAuth } from '../middlewares/isAuth.js';

const customerRouter = express.Router();

customerRouter.get('/get-professional-info/:id', getProfessionalInfo);

export default customerRouter;