import {createSlice} from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name : 'notification',
    initialState : {
        notifications : [],
        unreadCount : 0
    },
    reducers : {
        addNotification : (state, action)=>{
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
          setNotifications: (state, action) => {
            state.notifications = action.payload.notifications;
            state.unreadCount = action.payload.unreadCount;
        },
      markAllAsRead: (state) => {
      state.notifications.forEach(n => n.isRead = true);
      state.unreadCount = 0;
    }
    }
})

export const {
  addNotification,
  setNotifications,
  markOneAsRead,
  markAllAsRead
} = notificationSlice.actions;

export default notificationSlice.reducer;