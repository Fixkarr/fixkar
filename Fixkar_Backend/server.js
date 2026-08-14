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
import bookingRouter from './routes/booking.Routes.js';
import adminRouter from './controllers/Admin/AdminRoutes/admin.routes.js';
import notificationRouter from './routes/notification.routes.js';
import wakeRouter from './routes/wakeup.route.js';
import seoRouter from './routes/seo.route.js';
import { Professional } from './models/userModel.js';
import { generateShortCode } from './utils/generateShortCode.js';
import { csrfOriginCheck } from './middlewares/csrfOriginCheck.js';


dotenv.config();
const app = express();
const port  = process.env.PORT || 3000

// Staging supports both the current branch subdomain and the earlier test
// alias so cookies/API requests continue to work while DNS is being finalized.
const allowedOrigins = [
    process.env.FRONTEND_URL,
].filter(Boolean);
  
app.use(cors({
    origin : allowedOrigins,
    credentials : true
}))

// Lightweight security headers without introducing another dependency.
// HSTS is enabled only in production because browsers should not be forced
// to HTTPS while developing locally.
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(self), microphone=(self), geolocation=(self)");

    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }

    next();
});

app.use(cookieParser())
app.use(csrfOriginCheck)
app.use(express.urlencoded({extended : true, limit: "2mb", parameterLimit: 1000}));
app.use(express.json({limit: "2mb"}));

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
        origin : allowedOrigins,
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