import express from 'express';
import { getProfessionalInfo } from '../controllers/CustomerController/getProfessionalInfo.js';
import { isAuth } from '../middlewares/isAuth.js';
import { addSlugToProfessionals } from '../addSlug.js';

const customerRouter = express.Router();

customerRouter.get('/get-professional-info/:id', getProfessionalInfo);
customerRouter.get('/generateSlug', addSlugToProfessionals)

export default customerRouter;