import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
    name : "wallet",
    initialState : {
        refresh : false,
        wallet : null,
        walletTransaction : [],
    },
    reducers : {
        refreshWallet(state){
            state.refresh = !state.refresh
        },
        setWallet : (state, action)=>{
            state.wallet = action.payload
        },
        setWalletTransaction : (state, action) =>{
            state.walletTransaction = action.payload
        },
    }
})

export const {refreshWallet, setWallet, setWalletTransaction} = walletSlice.actions  
export default walletSlice.reducer