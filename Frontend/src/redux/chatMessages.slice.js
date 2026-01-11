import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],          // messages page list
  selectedConversationId: null, // userId of open chat
  selectedConversationUser: null, // user object
  messages: [],               // current chat messages
};

const chatMessagesSlice = createSlice({
  name: "chatMessages",
  initialState,
  reducers: {

    /* ================= CONVERSATIONS ================= */

    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    setSelectedConversation: (state, action) => {
      state.selectedConversationId = action.payload.userId;
      state.selectedConversationUser = action.payload.user;
    },

    updateConversationOnNewMessage: (state, action) => {
      const { senderId, message, isMine } = action.payload;

      const index = state.conversations.findIndex(
        (c) => c.user._id === senderId
      );

      if (index !== -1) {
        state.conversations[index].lastMessage = message;
        state.conversations[index].lastMessageTime =
          new Date().toISOString();

        if (!isMine) {
          state.conversations[index].unseenCount += 1;
        }

        const updated = state.conversations.splice(index, 1)[0];
        state.conversations.unshift(updated);
      }
    },

    markConversationAsRead: (state, action) => {
      const userId = action.payload;
      const convo = state.conversations.find(
        (c) => c.user._id === userId
      );
      if (convo) convo.unseenCount = 0;
    },

    /* ================= CHAT MESSAGES ================= */

    setChatMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessageToChat: (state, action) => {
      const msg = action.payload;

      // avoid duplicate (socket + api)
      const exists = state.messages.find(
        (m) => m._id === msg._id
      );
      if (!exists) {
        state.messages.push(msg);
      }
    },

    updateMessageStatus: (state, action) => {
      const { messageId, status, seenAt, deliveredAt } =
        action.payload;

      const msg = state.messages.find(
        (m) => m._id === messageId
      );
      if (msg) {
        msg.status = status;
        if (seenAt) msg.seenAt = seenAt;
        if (deliveredAt) msg.deliveredAt = deliveredAt;
      }
    },

    markAllMessagesSeenInChat: (state, action) => {
      const { myId, otherUserId } = action.payload;

      state.messages.forEach((msg) => {
        if (
          msg.sender === otherUserId &&
          msg.reciever === myId &&
          msg.status !== "seen"
        ) {
          msg.status = "seen";
          msg.seenAt = new Date().toISOString();
        }
      });
    },

    /* ================= CLEANUP ================= */

    clearChatMessages: (state) => {
      state.messages = [];
      state.selectedConversationId = null;
      state.selectedConversationUser = null;
    },
  },
});

export const {
  setConversations,
  setSelectedConversation,
  updateConversationOnNewMessage,
  markConversationAsRead,
  setChatMessages,
  addMessageToChat,
  updateMessageStatus,
  markAllMessagesSeenInChat,
  clearChatMessages,
} = chatMessagesSlice.actions;

export default chatMessagesSlice.reducer;
