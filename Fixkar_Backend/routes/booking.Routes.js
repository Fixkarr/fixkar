import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { sendHireRequest } from '../controllers/BookingController/sendHireRequest.js';
import { getMyBookings } from '../controllers/BookingController/getMyBookings.js';

const bookingRouter = express.Router();

bookingRouter.post('/create-booking', isAuth, sendHireRequest);
bookingRouter.get('/my-bookings', isAuth, getMyBookings);

export default bookingRouter;