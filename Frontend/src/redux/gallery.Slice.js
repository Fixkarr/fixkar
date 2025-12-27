import { createSlice } from "@reduxjs/toolkit";

const gallerySlice = createSlice({
    name : "gallery",
    initialState : {
        gallery : []
    },
    reducers : {
        setGallery : (state, action)=>{
            state.gallery = action.payload
        } 
    }
})

export const {setDistance} = gallerySlice.actions;
export default gallerySlice.reducer