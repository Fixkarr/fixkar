import twilio from "twilio";

export const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

