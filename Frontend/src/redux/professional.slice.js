import { createSlice } from "@reduxjs/toolkit";

const professionalSlice = createSlice({
    name : "professional",
    initialState : {
        verifiedProfessionals : null,
    },
    reducers : {
        setVerifiedProfessionals : (state, action)=>{
            state.verifiedProfessionals = action.payload
        }
    }
})

export const {setVerifiedProfessionals} = professionalSlice.actions
export default professionalSlice.reducer