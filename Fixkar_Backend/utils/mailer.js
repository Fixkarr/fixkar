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
<div style="background-color:#f4f6f8;padding:30px 0;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#0d6efd;padding:20px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;">
        FixKar
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:25px;color:#333333;">
      <h2 style="margin-top:0;font-size:20px;color:#0d6efd;">
        OTP Verification
      </h2>

      <p style="font-size:14px;line-height:1.6;margin-bottom:20px;">
        Hello,<br/>
        Use the OTP below to verify your email address. This OTP is valid for
        <b>5 minutes</b>.
      </p>

      <!-- OTP Box -->
      <div style="text-align:center;margin:30px 0;">
        <span style="
          display:inline-block;
          background:#f1f5ff;
          color:#0d6efd;
          font-size:32px;
          font-weight:700;
          letter-spacing:6px;
          padding:12px 24px;
          border-radius:8px;
          border:1px dashed #0d6efd;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size:13px;color:#666666;line-height:1.5;">
        If you didn’t request this OTP, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8f9fa;padding:15px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#888888;">
        © ${new Date().getFullYear()} FixKar. All rights reserved.
      </p>
    </div>

  </div>
</div>
`
,
      textContent: `Your FixKar OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await apiInstance.sendTransacEmail(emailData);
  } catch (err) {
    console.error("Brevo email error:", err?.response?.body || err);
    throw err
  }
};