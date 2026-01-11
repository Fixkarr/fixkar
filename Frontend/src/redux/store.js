import {configureStore} from '@reduxjs/toolkit'
// import userSlice from  './user.slice.js'
// import professionalSlice from './professional.slice.js'
// import locationSlice from './location.slice.js'
// import professionalInfoSlice from './professionalInfo.slice.js'
// import distanceSlice from './distance.slice.js'
// import bookingSlice from './booking.Slice.js'
// import reachedOtpSlice from './otp.Slice.js'
// import walletSlice from './wallet.slice.js'
// import gallerySlice from './gallery.Slice.js'
// import adminSlice from './admin.Slice.js'
import rootReducer from './rootReducer.js'

export const store = configureStore({
    reducer : rootReducer,
    devTools : import.meta.env.VITE_NODE_ENV !== 'production' ? true : false,
})