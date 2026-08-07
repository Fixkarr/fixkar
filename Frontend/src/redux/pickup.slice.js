import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPickupRequest: null,
    isSearching: false,
};

const pickupSlice = createSlice({
    name: "pickup",
    initialState,
    reducers: {
        setPickupRequest: (state, action) => {
            state.currentPickupRequest = action.payload;
        },

        clearPickupRequest: (state) => {
            state.currentPickupRequest = null;
        },

        setSearching: (state, action) => {
            state.isSearching = action.payload;
        },

        resetPickupState: (state) => {
            state.currentPickupRequest = null;
            state.isSearching = false;
        },
    },
});

export const {
    setPickupRequest,
    clearPickupRequest,
    setSearching,
    resetPickupState,
} = pickupSlice.actions;

export default pickupSlice.reducer;