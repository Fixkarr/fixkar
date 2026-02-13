import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import router from './routes/otpRoutes.js';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';
import dns from "dns";
import './cron/cleanupBusyDays.js'
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
import notificationRouter from './routes/notification.routes.js';

dotenv.config();
const app = express();
const port  = process.env.PORT || 3000
  
app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true
}))
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
app.use('/api/notification', notificationRouter)

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Fixkar backend is running"
  });
});

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
  }


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