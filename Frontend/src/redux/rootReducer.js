import { combineReducers } from "@reduxjs/toolkit";
import userSlice from  './user.slice.js'
import professionalSlice from './professional.slice.js'
import locationSlice from './location.slice.js'
import professionalInfoSlice from './professionalInfo.slice.js'
import distanceSlice from './distance.slice.js'
import bookingSlice from './booking.Slice.js'
import reachedOtpSlice from './otp.Slice.js'
import walletSlice from './wallet.slice.js'
import gallerySlice from './gallery.Slice.js'
import adminSlice from './admin.Slice.js'
import serviceSlice from './service.Slice.js'
import notificationSlice from './notification.slice.js'
import messagesSlice from  './messages.Slice.js'
import chatMessagesSlice from './chatMessages.slice.js'
import presenceSlice from './presence.slice.js'
import pickupSlice from './pickup.slice.js'

const appReducer = combineReducers({
        user : userSlice,
        professional : professionalSlice,
        location : locationSlice,
        professionalInfo : professionalInfoSlice,
        distance : distanceSlice,
        bookings : bookingSlice,
        reachedOtp : reachedOtpSlice,
        wallet : walletSlice,
        gallery : gallerySlice,
        admin : adminSlice,
        services : serviceSlice,
        notifications : notificationSlice,
        messages : messagesSlice,
        chatMessages : chatMessagesSlice,
        presence : presenceSlice,
        pickup : pickupSlice
})

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    state = undefined; // 🔥 PURE RESET
  }
  return appReducer(state, action);
};

export default rootReducer;