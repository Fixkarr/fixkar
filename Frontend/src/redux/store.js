import {configureStore} from '@reduxjs/toolkit'
import userSlice from  './user.slice.js'
import professionalSlice from './professional.slice.js'
import locationSlice from './location.slice.js'

export const store = configureStore({
    reducer : {
        user : userSlice,
        professional : professionalSlice,
        location : locationSlice
    }
})