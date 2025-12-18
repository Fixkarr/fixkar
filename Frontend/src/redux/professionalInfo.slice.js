import { createSlice } from "@reduxjs/toolkit";

const professionalInfoSlice = createSlice({
    name : "professionalInfo",
    initialState : {
        selectedProfessional : null,
    }, 

    reducers : {
        setSelectedProfessional : (state, action)=>{
            state.selectedProfessional = action.payload
        }
    }
})

export const {setSelectedProfessional} = professionalInfoSlice.actions
export default professionalInfoSlice.reducer