import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmailOtps = async (email, otp) => {
  try {
    const emailData = {
      sender: {
        name: "FixKar",
        email: "hg852106@gmail.com", // TEMP OK, domain email better
      },
      to: [{ email }],
      subject: "Your FixKar OTP",
      htmlContent: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
      textContent: `Your FixKar OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await apiInstance.sendTransacEmail(emailData);
  } catch (err) {
    console.error("Brevo email error:", err?.response?.body || err);
    throw err
  }
};