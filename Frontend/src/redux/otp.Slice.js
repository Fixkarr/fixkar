import { createSlice } from "@reduxjs/toolkit";

const reachedOtpSlice = createSlice({
  name: "reachedOtp",
  initialState: {
    bookingId: null,
    otp: null,
    receivedAt: null
  },
  reducers: {
    setReachedOtp: (state, action) => {
      state.bookingId = action.payload.bookingId;
      state.otp = action.payload.otp;
      state.receivedAt = Date.now();
    },
    clearReachedOtp: (state) => {
      state.bookingId = null;
      state.otp = null;
      state.receivedAt = null;
    }
  }
});

export const { setReachedOtp, clearReachedOtp } = reachedOtpSlice.actions;
export default reachedOtpSlice.reducer;
