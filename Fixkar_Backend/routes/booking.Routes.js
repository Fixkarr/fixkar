import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { sendHireRequest } from '../controllers/BookingController/sendHireRequest.js';

const bookingRouter = express.Router();

bookingRouter.post('/create-booking', isAuth, sendHireRequest);

export default bookingRouter;