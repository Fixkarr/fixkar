import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name : 'user',
    initialState : {
        currentUserData : null,
        isAuthLoading : true
    },
    
    reducers : {
        setCurrentUserData : (state, action)=>{
            state.currentUserData = action.payload
            state.isAuthLoading = false;
        },
          setAuthLoading: (state, action) => {
            state.isAuthLoading = action.payload; // 👈 new reducer
         },
    }
})

export const {setCurrentUserData, setAuthLoading} = userSlice.actions
export default userSlice.reducer