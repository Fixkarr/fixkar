import { Professional } from "../../../models/userModel.js";
import { sendEmail } from "../../../utils/mailer.js";

export const rejectApplication = async (req,res)=>{
    try {
        const {proUserId, reason} = req.body;
        if(!proUserId){
            return res.status(400).json({
                message : "Pro User ID is required"
            })
        }
        const admin = req.admin;
        const professional = await Professional.findOne({userId : proUserId});
        if(!professional){
            return res.status(404).json({
                message : "Professional not found"
            })
        }

        professional.rejectedBy = admin._id;
        professional.status = "pending";
        professional.rejectionCount += 1;
        professional.onBoarded = false;
        await professional.save();

       
        const htmlContent = `<div
  style="
    max-width:600px;
    margin:0 auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 12px 30px rgba(0,0,0,0.08);
    font-family:Arial, Helvetica, sans-serif;
  "
>
  <!-- HEADER -->
  <div
    style="
      padding:26px;
      text-align:center;
      color:#ffffff;
      background:linear-gradient(135deg,#0d6efd,#0b5ed7);
    "
  >
    <h2 style="margin:0; font-size:23px;">
      Application Status Update
    </h2>
    <p style="margin:8px 0 0; font-size:14px; opacity:0.95;">
      FixKar Professional Onboarding
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:28px; color:#212529;">
    <p style="font-size:15px; margin-top:0;">
      Hello <strong>${professional.userId.fullName}</strong>,
    </p>

    <p style="font-size:15px; line-height:1.6;">
      Thank you for applying to become a professional on
      <strong style="color:#0d6efd;">FixKar</strong>.
      We truly appreciate the time and effort you put into your application.
    </p>

    <!-- REASON BOX -->
    <div
      style="
        margin:18px 0;
        padding:16px;
        background:#fff3cd;
        border-left:5px solid #ffc107;
        border-radius:8px;
      "
    >
      <p style="margin:0; font-size:14px;">
        <strong>Reason for update:</strong><br />
        ${reason}
      </p>
    </div>

    <p style="font-size:15px; line-height:1.6;">
      Please don’t worry — this does <strong>not</strong> mean that you are
      ineligible for FixKar.  
      You can <strong>update your details</strong> and
      <strong>apply again</strong> after making the required improvements.
    </p>

    <p style="font-size:15px; line-height:1.6;">
      Many professionals successfully complete their onboarding on a second
      attempt. We encourage you to review the feedback, make the necessary
      changes, and try again.
    </p>

    <!-- CTA BUTTON -->
    <div style="text-align:center; margin:28px 0;">
      <a
        href="{{retryLink}}"
        style="
          display:inline-block;
          padding:14px 34px;
          background:#0d6efd;
          color:#ffffff;
          text-decoration:none;
          font-size:15px;
          font-weight:600;
          border-radius:30px;
          box-shadow:0 8px 20px rgba(13,110,253,0.35);
        "
      >
         Try Again on FixKar
      </a>
    </div>

    <p style="font-size:14px; color:#6c757d;">
      If you need any help or clarification, our support team is always here
      to guide you through the onboarding process.
    </p>

    <p style="font-size:15px; margin-bottom:0;">
      Warm regards,<br />
      <strong>Team FixKar</strong>
    </p>
  </div>

  <!-- FOOTER -->
  <div
    style="
      padding:14px;
      text-align:center;
      font-size:12px;
      color:#6c757d;
      background:#f8f9fa;
    "
  >
    © ${new Date().getFullYear()} FixKar. All rights reserved.
  </div>
</div>
`

       await  sendEmail(professional.userId.email, "Professional Application Updated", htmlContent)


        return res.status(200).json({
            message : "Professional application rejected!"
        })


    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}

