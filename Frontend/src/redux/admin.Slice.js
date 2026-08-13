import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    currentAdmin: null,
    isAdminLoading: true,
  },

  reducers: {
    setCurrentAdmin: (state, action) => {
      state.currentAdmin = action.payload;
      state.isAdminLoading = false;
    },

    setAdminLoading: (state, action) => {
      state.isAdminLoading = action.payload;
    },
  },
});

export const {
  setCurrentAdmin,
  setAdminLoading,
} = adminSlice.actions;

export default adminSlice.reducer;