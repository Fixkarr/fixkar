import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    selectedLocation: null,
    selectedService: null,
  },
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSelectedService : (state, action)=>{
        state.selectedService = action.payload
    }
  }
});

export const { setSelectedLocation, setSelectedService } = locationSlice.actions;
export default locationSlice.reducer;
