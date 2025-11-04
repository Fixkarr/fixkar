import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

export const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

