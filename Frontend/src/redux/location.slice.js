import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    selectedLocation: null,
    selectedService: null,
    selectedTask: null,
    professionalLiveLocations: {},
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
    },
    setProfessionalLiveLocation: (state, action) => {
  const {
    bookingId,
    lat,
    lng,
    heading,
  } = action.payload;

  state.professionalLiveLocations[bookingId] = {
    lat,
    lng,
    heading,
  };
  },
  }
});

export const { setSelectedLocation, setSelectedService, setSelectedTask, setProfessionalLiveLocation } = locationSlice.actions;
export default locationSlice.reducer;
