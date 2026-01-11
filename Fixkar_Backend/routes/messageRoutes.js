import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { deleteMessagesForMe, getMessages, getMyConversations, markMessagesSeen, sendMessage } from '../controllers/message.controller.js';
import upload from '../middlewares/multer.js'
import multerErrorHandler from '../middlewares/multerErrorHandler.js';
const messageRouter = express.Router();


messageRouter.get("/get-messages/:recieverId", isAuth, getMessages);

messageRouter.post("/send/:recieverId", isAuth,  upload.array("attachments", 5), multerErrorHandler, sendMessage)

messageRouter.get("/get-my-conversations", isAuth, getMyConversations);
messageRouter.put(
  "/mark-seen",
  isAuth,
  markMessagesSeen
);

messageRouter.post("/delete-messages", isAuth, deleteMessagesForMe);

export default messageRouter;