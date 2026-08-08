import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPickupRequest: null,
    isSearching: false,
    incomingRequests : [],
    searchStatus: "idle",
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
         addIncomingRequest: (state, action) => {
            const request = action.payload;

            const exists = state.incomingRequests.some(
                (item) =>
                    item.pickupRequestId === request.pickupRequestId
            );

            if (!exists) {
                state.incomingRequests.push(request);
            }
        },
          removeIncomingRequest: (state, action) => {
            state.incomingRequests =
                state.incomingRequests.filter(
                    (item) =>
                        item.pickupRequestId !== action.payload
                );
        },

        setSearching: (state, action) => {
            state.isSearching = action.payload;
        },
           setSearchStatus: (state, action) => {
            state.searchStatus = action.payload;
        },

        resetPickupState: (state) => {
            state.currentPickupRequest = null;
            state.isSearching = false;
         state.incomingRequests = [];
           state.searchStatus = "idle";
        },
    },
});

export const {
    setPickupRequest,
    clearPickupRequest,
    addIncomingRequest,
    removeIncomingRequest,
    setSearching,
    setSearchStatus,
    resetPickupState,
} = pickupSlice.actions;

export default pickupSlice.reducer;