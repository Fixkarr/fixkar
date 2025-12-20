import {configureStore} from '@reduxjs/toolkit'
import userSlice from  './user.slice.js'
import professionalSlice from './professional.slice.js'
import locationSlice from './location.slice.js'
import professionalInfoSlice from './professionalInfo.slice.js'
import chatSlice from './chat.slice.js'
import distanceSlice from './distance.slice.js'
import bookingSlice from './booking.Slice.js'

export const store = configureStore({
    reducer : {
        user : userSlice,
        professional : professionalSlice,
        location : locationSlice,
        professionalInfo : professionalInfoSlice,
        chat : chatSlice,
        distance : distanceSlice,
        bookings : bookingSlice
    }
})