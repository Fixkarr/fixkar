import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConversation: null, // userId
  totalUnreadCount : 0,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // 🔹 set full conversation list
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.totalUnreadCount = action.payload.reduce(
    (sum, conv) => sum + (conv.unseenCount || 0),
    0
  );
    },

    // 🔹 select chat (open chat)
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },

    // 🔹 new message aaya (socket / send)
    addNewMessageToConversation: (state, action) => {
      const { senderId, message, isMine } = action.payload;

      const index = state.conversations.findIndex(
        (c) => c.user._id === senderId
      );

      if (index !== -1) {
        state.conversations[index].lastMessage = message;
        state.conversations[index].lastMessageTime = new Date().toISOString();

        if (!isMine) {
          state.conversations[index].unseenCount += 1;
        }

        // 🔥 move to top
        const updated = state.conversations.splice(index, 1)[0];
        state.conversations.unshift(updated);
      }
    },

    // 🔹 mark all messages read for a user
    markConversationAsRead: (state, action) => {
      const userId = action.payload;

      const convo = state.conversations.find(
        (c) => c.user._id === userId
      );

      if (convo) {
        convo.unseenCount = 0;
      }
    },
  },
});

export const {
  setConversations,
  setSelectedConversation,
  addNewMessageToConversation,
  markConversationAsRead,
} = messagesSlice.actions;

export default messagesSlice.reducer;
