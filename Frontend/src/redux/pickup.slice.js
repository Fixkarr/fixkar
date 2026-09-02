import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPickupRequest: null,
    isSearching: false,
    incomingRequests : [],
    waitingForCustomerConfirmation: [],
    acceptedProfessionals: [],
    searchStatus: "idle",
};

const pickupSlice = createSlice({
    name: "pickup",
    initialState,
    reducers: {
        addAcceptedProfessional: (state, action) => {
    const exists =
        state.acceptedProfessionals.some(
            (item) =>
                item.pickupRequestId ===
                action.payload.pickupRequestId
        );

    if (!exists) {
        state.acceptedProfessionals.push(
            action.payload
        );
    }
},
    removeAcceptedProfessional: (state, action) => {
    state.acceptedProfessionals =
        state.acceptedProfessionals.filter(
            (item) =>
                item.pickupRequestId !== action.payload
        );
},

clearAcceptedProfessionals: (state) => {
    state.acceptedProfessionals = [];
},

        clearPickupRequest: (state) => {
            state.currentPickupRequest = null;
        },
        addWaitingForCustomerConfirmation: (state, action) => {
            const request = action.payload;
            const requestId = request.pickupRequestId || request._id;

            const index = state.waitingForCustomerConfirmation.findIndex(
                (item) => (item.pickupRequestId || item._id) === requestId
            );

            if (index >= 0) {
                state.waitingForCustomerConfirmation[index] = request;
            } else {
                state.waitingForCustomerConfirmation.push(request);
            }
        },
        removeWaitingForCustomerConfirmation: (state, action) => {
            state.waitingForCustomerConfirmation =
                state.waitingForCustomerConfirmation.filter(
                    (item) => (item.pickupRequestId || item._id) !== action.payload
                );
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
           state.waitingForCustomerConfirmation = [];
           state.searchStatus = "idle";
           state.acceptedProfessionals = [];
        },
    },
});

export const {
    clearPickupRequest,
    addIncomingRequest,
    removeIncomingRequest,
    addWaitingForCustomerConfirmation,
    removeWaitingForCustomerConfirmation,
    setSearching,
    setSearchStatus,
    removeAcceptedProfessional,
    clearAcceptedProfessionals,
    resetPickupState,
    addAcceptedProfessional
} = pickupSlice.actions;

export default pickupSlice.reducer;
