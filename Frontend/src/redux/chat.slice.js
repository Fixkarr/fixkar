import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({

    name : "chat",
    initialState : {
        conversations : [],
        onlineUsers : [],
        selectedUser : null,
        messages : [],

    },
    reducers : {
        setOnlineUsers : (state, action)=>{
             state.onlineUsers = action.payload;
        },
        setSelectedUser : (state, action)=>{
            state.selectedUser = action.payload;
        },
          setMessages: (state, action) => {
    state.messages = action.payload;
  },
    setConversations : (state, action)=>{
      state.conversations = action.payload;
    },
     addMessage: (state, action) => {
    state.messages.push(action.payload);
  },
  clearUnseenCount: (state, action) => {
  const userId = action.payload;

  const convo = state.conversations.find(
    c => c.user._id === userId
  );

  if (convo) {
    convo.unseenCount = 0;
  }
}
        

    }
})

export const {setOnlineUsers,setSelectedUser, clearUnseenCount, setMessages, addMessage, setConversations} = chatSlice.actions;
export default chatSlice.reducer;