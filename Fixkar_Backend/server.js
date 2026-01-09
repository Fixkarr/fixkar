import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import router from './routes/otpRoutes.js';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import http from 'http';
import { Server } from 'socket.io';

import userRoute from './routes/user.Routes.js';
import cookieParser from 'cookie-parser';
import customerRouter from './routes/customer.Routes.js'
import messageRouter from './routes/messageRoutes.js';
import { Message } from './models/messageModel.js';
import bookingRouter from './routes/booking.Routes.js';
import adminRouter from './controllers/Admin/AdminRoutes/admin.routes.js';

dotenv.config();
const app = express();
const port  = process.env.PORT || 3000
  
app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true
}))
app.set("trust proxy", true);
app.use(cookieParser())
app.use(express.urlencoded({extended : true}));
app.use(express.json());

//adding all routes

app.use("/api/otp", router);
app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/customer", customerRouter);
app.use("/api/messages", messageRouter);
app.use("/api/booking", bookingRouter);
app.use('/api/admin', adminRouter)

const server = http.createServer(app);

//initialize socket.io server

export const io = new Server(server,{
    cors : {
        origin : [process.env.FRONTEND_URL],
        credentials : true
    }
})

//store online users

export const userSocketMap = {};


io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

  if(userId) {
    userSocketMap[userId] = socket.id;
      socket.join(userId.toString())
      console.log("📌 User joined room:", userId)
  }

    socket.on("markMessagesSeen", async ({ senderId }) => {
    await Message.updateMany(
      {
        sender: senderId,
        reciever: userId,
        status: { $ne: "seen" },
      },
      {
        status: "seen",
        seenAt: new Date().toISOString(),
      }
    );

    const senderSocket = userSocketMap[senderId];
    if (senderSocket) {
      io.to(senderSocket).emit("messagesSeen", {
        senderId: userId,
      });
    }
  });

  // emit online users to all connected clients

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", ()=>{

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })

  });

 




server.listen(port, ()=>{
    console.log("server is running", port);
    connectDB()
}) 