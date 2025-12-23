import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { sendHireRequest } from '../controllers/BookingController/sendHireRequest.js';
import { getMyBookings } from '../controllers/BookingController/getMyBookings.js';
import { rejectBooking } from '../controllers/ProfessionalsController/rejctBookingController.js';
import { cancelCustomerBooking } from '../controllers/BookingController/cancelCustomerBooking.js';
import { acceptBooking } from '../controllers/BookingController/acceptBooking.js';
import { reachedToLocation } from '../controllers/BookingController/reachedToLocation.js';
import { verifyReachedOtp } from '../controllers/BookingController/verifyReachedOtp.js';

const bookingRouter = express.Router();

bookingRouter.post('/create-booking', isAuth, sendHireRequest);
bookingRouter.get('/my-bookings', isAuth, getMyBookings);
bookingRouter.post('/reject-booking', rejectBooking)
bookingRouter.post('/cancel-booking', cancelCustomerBooking)
bookingRouter.post('/accept-booking', acceptBooking)
bookingRouter.post('/mark-reached', isAuth, reachedToLocation)
bookingRouter.post('/verify-reached-otp', isAuth, verifyReachedOtp);

export default bookingRouter;