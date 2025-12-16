import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import router from './routes/otpRoutes.js';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';
import userRoute from './routes/user.Routes.js';
import cookieParser from 'cookie-parser';
import customerRouter from './routes/customer.Routes.js';
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
app.use("/api/otp", router);
app.use("/api/auth", authRouter) 
app.use("/api/user", userRoute)
app.use("/api/customer", customerRouter)

app.listen(port, ()=>{
    console.log("server is running", port);
    connectDB()
}) 