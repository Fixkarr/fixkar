import { Professional } from "../../../models/userModel.js";
import { sendEmail } from "../../../utils/mailer.js";

export const acceptBankDetail = async (req,res)=>{
    try {
        const admin = req.admin;
        const {proId} = req.params;
        if(!admin){
            return res.status(404).json({
                message : "Unauthorized!"
            })
        }

        const professional = await Professional.findById(proId).populate('userId');
        if(!professional){
            return res.status(404).json({
                message : "Professional nahi mila!"
            })
        }

        professional.bankVerified = true;
        professional.bankVerificationStatus = 'approved';
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
      background:linear-gradient(135deg,#198754,#157347);
    "
  >
    <h2 style="margin:0; font-size:24px;">
      ✅ Bank Details Verified
    </h2>
    <p style="margin:8px 0 0; font-size:14px; opacity:0.95;">
      Your FixKar payout setup is now complete
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:28px; color:#212529;">
    <p style="font-size:15px; margin-top:0;">
      Hello, <strong>${professional.userId.fullName}</strong>,
    </p>

    <p style="font-size:15px; line-height:1.6;">
      We’re happy to inform you that your
      <strong style="color:#198754;">bank account details</strong> on
      <strong style="color:#0d6efd;">FixKar</strong> have been
      <strong style="color:#198754;">successfully verified</strong>.
    </p>

    <p style="font-size:15px; line-height:1.6;">
      You can now
      <strong>request withdrawal</strong> of your earnings directly into your
      verified bank account without any hassle.
    </p>

    <p style="font-size:15px; line-height:1.6;">
      Simply go to your FixKar dashboard, submit a withdrawal request, and your
      payment will be processed securely.
    </p>

    <!-- CTA BUTTON -->
    <div style="text-align:center; margin:28px 0;">
      <a
        href="https://fixkar.netlify.app"
        style="
          display:inline-block;
          padding:14px 34px;
          background:#198754;
          color:#ffffff;
          text-decoration:none;
          font-size:15px;
          font-weight:600;
          border-radius:30px;
          box-shadow:0 8px 20px rgba(25,135,84,0.35);
        "
      >
        Request Withdrawal
      </a>
    </div>

    <p style="font-size:14px; color:#6c757d;">
      If you face any issues related to payouts or withdrawals, our support team
      is always here to help you.
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
    © ${new Date().getFullYear()} Fixkar. All rights reserved.
  </div>
</div>
`  
      await  sendEmail(professional.userId.email, 'Your bank details on fixkar have been verified!', htmlContent);

        return res.status(200).json({
            message : "Bank verify ho gya!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal server error!"
           
        })
         
    }
}