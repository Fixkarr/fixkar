import express from 'express';
import { getProfessionalInfo } from '../controllers/CustomerController/getProfessionalInfo.js';
import { isAuth } from '../middlewares/isAuth.js';
import { getEligibleOffers } from '../controllers/CustomerController/getEligibleOffers.controller.js';
const customerRouter = express.Router();

customerRouter.get('/get-professional-info/:id', getProfessionalInfo);
customerRouter.get('/get-elligible-offers/:bookingId', isAuth, getEligibleOffers)

export default customerRouter;