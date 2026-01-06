import { createSlice } from "@reduxjs/toolkit";


const adminSlice = createSlice({
    name : 'admin',
    initialState : {
        currentAdmin : null,
    },
    reducers : {
        setCurrentAdmin : (state, action)=>{
            state.currentAdmin = action.payload
        },
    }
})

export const {setCurrentAdmin} = adminSlice.actions
export default adminSlice.reducer