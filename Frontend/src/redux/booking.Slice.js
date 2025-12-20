import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
    name : "bookings",
    initialState : {
        myBookings : []
    },
    reducers : {
        setMyBookings : (state, action)=>{
            state.myBookings = action.payload;
        }
    }
})

export const {setMyBookings} = bookingSlice.actions;
export default bookingSlice.reducer;