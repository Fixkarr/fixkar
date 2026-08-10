import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { sendHireRequest } from '../controllers/BookingController/sendHireRequest.js';
import { getMyBookings } from '../controllers/BookingController/getMyBookings.js';
import { rejectBooking } from '../controllers/ProfessionalsController/rejctBookingController.js';
import { cancelCustomerBooking } from '../controllers/BookingController/cancelCustomerBooking.js';
import { acceptBooking } from '../controllers/BookingController/acceptBooking.js';
import { reachedToLocation } from '../controllers/BookingController/reachedToLocation.js';
import { verifyReachedOtp } from '../controllers/BookingController/verifyReachedOtp.js';
import { sendQuoteAmount } from '../controllers/BookingController/sendQuoteAmount.js';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import { getProfessionalWallet } from '../controllers/ProfessionalsController/getProfessionalWallet.js';
import { getBookingById } from '../controllers/BookingController/getBookingById.js';
import { postReview } from '../controllers/review.controller.js';
import { getReachedOtp } from '../controllers/BookingController/getReachedOtp.js';
import { getWalletTransaction } from '../controllers/ProfessionalsController/getWalletTransaction.js';
import { confirmCashPayment } from '../controllers/BookingController/cashPayment.controller.js';
import { confirmPickupHire } from '../controllers/BookingController/confirmPickupHire.js';
import upload from '../middlewares/multer.js';
import multerErrorHandler from '../middlewares/multerErrorHandler.js';

const bookingRouter = express.Router();

// /api/booking

bookingRouter.post('/create-booking', isAuth,  upload.array("audioMessages", 5),  multerErrorHandler, sendHireRequest);
bookingRouter.get('/my-bookings', isAuth, getMyBookings);
bookingRouter.get('/get-booking', getBookingById)
bookingRouter.post('/reject-booking', rejectBooking)
bookingRouter.post('/cancel-booking', isAuth, cancelCustomerBooking)
bookingRouter.post('/accept-booking', acceptBooking)
bookingRouter.post('/confirm-pickup-hire', isAuth, confirmPickupHire)
bookingRouter.post('/mark-reached', isAuth, reachedToLocation)
bookingRouter.post('/verify-reached-otp', isAuth, verifyReachedOtp);
bookingRouter.post('/send-quote-amount', isAuth, sendQuoteAmount)
bookingRouter.get('/get-reached-otp/:bookingId', isAuth, getReachedOtp);


//payment route

bookingRouter.post('/create-order', isAuth, createOrder);
bookingRouter.post('/verify-payment', isAuth, verifyPayment)
bookingRouter.post('/confirm-cash-payment', isAuth, confirmCashPayment)
bookingRouter.get('/get-professional-wallet', isAuth, getProfessionalWallet)
bookingRouter.get('/get-wallet-transaction/:bookingId', isAuth, getWalletTransaction)



// review route

bookingRouter.post('/post-review', postReview);
export default bookingRouter;
