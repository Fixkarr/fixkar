import express from 'express';
import { getProfessionalInfo } from '../controllers/CustomerController/getProfessionalInfo.js';
import { isAuth } from '../middlewares/isAuth.js';
import { useRewardCredits } from '../controllers/CustomerController/useRewardCredits.js';


const customerRouter = express.Router();

customerRouter.get('/get-professional-info/:id', getProfessionalInfo);
customerRouter.post('/use-reward-credits', isAuth, useRewardCredits);


export default customerRouter;