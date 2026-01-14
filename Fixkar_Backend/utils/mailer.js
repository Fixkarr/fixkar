import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async (email, subject, content) => {
  try {
    const emailData = {
      sender: {
        name: "FixKar",
        email: "hg852106@gmail.com", // TEMP OK, domain email better
      },
      to: [{ email }],
      subject: subject,
      htmlContent: content
    };

    await apiInstance.sendTransacEmail(emailData);
  } catch (err) {
    console.error("Brevo email error:", err?.response?.body || err);
    throw err
  }
};