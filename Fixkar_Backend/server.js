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
import jwt from 'jsonwebtoken';

import userRoute from './routes/user.Routes.js';
import cookieParser from 'cookie-parser';
import customerRouter from './routes/customer.Routes.js'
import messageRouter from './routes/messageRoutes.js';
import { Message } from './models/messageModel.js';
import bookingRouter from './routes/booking.Routes.js';
import adminRouter from './controllers/Admin/AdminRoutes/admin.routes.js';
import notificationRouter from './routes/notification.routes.js';
import wakeRouter from './routes/wakeup.route.js';
import seoRouter from './routes/seo.route.js';
import { Professional } from './models/userModel.js';
import { generateShortCode } from './utils/generateShortCode.js';


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
app.use('/api/seo', seoRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Fixkar backend is running"
  });
});
app.use("/api/wakeup", wakeRouter);

app.get("/api/s/:shortCode", async (req,res)=>{
  const professional = await Professional.findOne({
    shortCode : req.params.shortCode
  }).populate("userId");

    if (!professional)
        return res.status(404).send("Not Found");
    
     return res.json({
        success: true,
        slug: `/professional/profile/visit/${professional.userId._id}/${professional.slug}`
    });

})


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

const getCookieValue = (cookieHeader, name) => {
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
};

io.use((socket, next) => {
  try {
    const token = getCookieValue(socket.handshake.headers.cookie, 'token');
    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return next(new Error('Unauthorized'));
    }

    socket.userId = decoded.userId.toString();
    return next();
  } catch (error) {
    return next(new Error('Unauthorized'));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;

  userSocketMap[userId] = socket.id;
  socket.join(userId);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", ()=>{
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});




server.listen(port, ()=>{
    console.log("server is running", port);
    connectDB()
}) 