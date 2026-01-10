import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { getNotifications } from '../controllers/getNotifications.controller.js'
import { markAllNotificationsRead } from '../controllers/markNotificationAsRead.controller.js';
const notificationRouter = express.Router()

notificationRouter.get('/get-my-notifications', isAuth, getNotifications);
notificationRouter.get('/mark-all-as-read', isAuth, markAllNotificationsRead);



export default notificationRouter