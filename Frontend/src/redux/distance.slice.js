import { createSlice } from "@reduxjs/toolkit";

const distanceSlice = createSlice({
    name : "distance",
    initialState : {
        distance : null
    },
    reducers : {
        setDistance : (state, action)=>{
            state.distance = action.payload
        } 
    }
})

export const {setDistance} = distanceSlice.actions;
export default distanceSlice.reducer