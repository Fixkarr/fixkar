import { Service } from "../../../models/serviceModel.js";
import { Professional } from "../../../models/userModel.js";
import { sendEmail } from "../../../utils/mailer.js";

export const acceptApplication = async (req,res)=>{
    try {
        const {proUserId} = req.body;
        if(!proUserId){
            return res.status(400).json({
                message : "Pro User ID is required"
            })
        }
        const admin = req.admin;
        const professional = await Professional.findOne({userId : proUserId}).populate('userId', '-password');
        if(!professional){
            return res.status(404).json({
                message : "Professional not found"
            })
        }

        const service = await Service.findOne({name : professional.profession});
        if(!service){
            return res.status(400).json({
                message : "Service not found for the professional's profession"
            })
        }

        professional.acceptedBy = admin._id;
        professional.status = "approved";
        await professional.save();

        service.professionalCount += 1;
        await service.save();

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
    <h2 style="margin:0; font-size:24px;">
      🎉 Congratulations!
    </h2>
    <p style="margin:8px 0 0; font-size:14px; opacity:0.95;">
      Your FixKar Professional Application is Approved
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:28px; color:#212529;">
    <p style="font-size:15px; margin-top:0;">
      Hello, <strong>${professional.userId.fullName}</strong>,
    </p>

    <p style="font-size:15px; line-height:1.6;">
      We’re happy to inform you that your application on
      <strong style="color:#0d6efd;">FixKar</strong> has been
      <strong style="color:#198754;">successfully approved</strong>.
    </p>

    <!-- INFO CARD -->
    <div
      style="
        margin:18px 0;
        padding:16px;
        background:#e7f1ff;
        border-left:5px solid #0d6efd;
        border-radius:8px;
      "
    >
      <p style="margin:0; font-size:14px;">
        <strong>Name:</strong> ${professional.userId.fullName} <br />
        <strong>Profession:</strong> ${professional.profession}
      </p>
    </div>

    <p style="font-size:15px; line-height:1.6;">
       You are now <strong>eligible to grab work</strong> on FixKar.
      Customers can visit your profile, send booking requests, and hire you
      for relevant jobs.
    </p>

    <p style="font-size:15px; line-height:1.6;">
      Start accepting work, build trust, and grow your professional journey
      with FixKar.
    </p>

    <!-- CTA BUTTON -->
    <div style="text-align:center; margin:28px 0;">
      <a
        href='${process.env.FRONTEND_URL}/login'
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
         Check Out FixKar
      </a>
    </div>

    <p style="font-size:14px; color:#6c757d;">
      If you have any questions or need help, feel free to contact our support
      team anytime.
    </p>

    <p style="font-size:15px; margin-bottom:0;">
      Regards,<br />
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

       await  sendEmail(professional.userId.email, "Professional Application Accepted", htmlContent)


        return res.status(200).json({
            message : "Professional application accepted!"
        })


    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}

