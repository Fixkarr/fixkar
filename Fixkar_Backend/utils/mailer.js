import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "9f8266001@smtp-brevo.com",
    pass: process.env.BREVO_API_KEY,
  },
  connectionTimeout: 10000, // ⬅️ 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
