import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { getNotifications, saveFCMToken } from '../controllers/getNotifications.controller.js'
import { markAllNotificationsRead } from '../controllers/markNotificationAsRead.controller.js';
const notificationRouter = express.Router()

notificationRouter.get('/get-my-notifications', isAuth, getNotifications);
notificationRouter.patch('/mark-all-as-read', isAuth, markAllNotificationsRead);


notificationRouter.post('/save-fcm-token', isAuth, saveFCMToken);
export default notificationRouter
