import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { getMessages, getMyConversations, sendMessage } from '../controllers/message.controller.js';
import upload from '../middlewares/multer.js'
import multerErrorHandler from '../middlewares/multerErrorHandler.js';
const messageRouter = express.Router();


messageRouter.get("/get-messages/:recieverId", isAuth, getMessages);

messageRouter.post("/send/:recieverId", isAuth,  upload.array("attachments", 5), multerErrorHandler, sendMessage)

messageRouter.get("/get-my-conversations", isAuth, getMyConversations);
export default messageRouter;