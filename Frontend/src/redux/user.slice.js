import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name : 'user',
    initialState : {
        currentUserData : null,
        city : null
    },
    reducers : {
        setCurrentUserData : (state, action)=>{
            state.currentUserData = action.payload
        },
        setCity : (state, action)=>{
            state.city = action.payload
        }
    }
})

export const {setCurrentUserData, setCity} = userSlice.actions
export default userSlice.reducer