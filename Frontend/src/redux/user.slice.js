import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name : 'user',
    initialState : {
        currentUserData : null
    },
    reducers : {
        setCurrentUserData : (state, action)=>{
            state.currentUserData = action.payload
        }
    }
})

export const {setCurrentUserData} = userSlice.actions
export default userSlice.reducer