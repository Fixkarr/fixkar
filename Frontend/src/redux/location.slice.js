import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    selectedLocation: null,
    selectedService: null,
    selectedTask: null,
  },
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSelectedService : (state, action)=>{
        state.selectedService = action.payload
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    }
  }
});

export const { setSelectedLocation, setSelectedService, setSelectedTask } = locationSlice.actions;
export default locationSlice.reducer;
