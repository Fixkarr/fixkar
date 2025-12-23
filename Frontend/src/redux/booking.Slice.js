import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
    name : "bookings",
    initialState : {
        myBookings : [],
    },
    reducers : {
        setMyBookings : (state, action)=>{
            state.myBookings = action.payload;
        },
         addNewBooking: (state, action) => {
      const newBooking = action.payload;

      //  Prevent duplicate booking
      const alreadyExists = state.myBookings.some(
        (booking) => booking._id === newBooking._id
      );

      if (!alreadyExists) {
        //  Add at top (latest first)
        state.myBookings.unshift(newBooking);
      }
    },
       updateBookingInRedux: (state, action) => {
        const updated = action.payload;

        const index = state.myBookings.findIndex(
          (b) => b._id === updated._id
        );

        if (index !== -1) {
          state.myBookings[index] = updated;
        }
      }
    }
})

export const {setMyBookings, addNewBooking, updateBookingInRedux} = bookingSlice.actions;
export default bookingSlice.reducer;