import { Professional } from "../../../models/userModel.js";
import { sendEmail } from "../../../utils/mailer.js";

export const rejectBankDetail = async (req, res) => {
    try {

        const admin = req.admin;
        if (!admin) {
            return res.status(400).json({
                message: "Unauthorized!"
            })
        }

        const { proId } = req.params;
        if (!proId) {
            return res.status(400).json({
                message: "Please Provide Reason!"
            })
        }

        const professional = await Professional.findById(proId).populate('userId');
        if (!professional) {
            return res.status(404).json({
                message: "professional not found!"
            }
            )
        }
        if (professional.bankVerified) {
            return res.status(400).json({
                message: "Bank Already verified!"
            })
        }

        professional.bankVerificationStatus = "N/A"
        professional.save();

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
      background:linear-gradient(135deg,#dc3545,#b02a37);
    "
  >
    <h2 style="margin:0; font-size:24px;">
      ❌ Bank Details Verification Failed
    </h2>
    <p style="margin:8px 0 0; font-size:14px; opacity:0.95;">
      Action required to enable withdrawals
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:28px; color:#212529;">
    <p style="font-size:15px; margin-top:0;">
      Hello, <strong>${professional.userId.fullName}</strong>,
    </p>

    <p style="font-size:15px; line-height:1.6;">
      We regret to inform you that your
      <strong style="color:#dc3545;">bank account details</strong> submitted on
      <strong style="color:#0d6efd;">FixKar</strong> could not be verified at this
      time.
    </p>


    <p style="font-size:15px; line-height:1.6;">
      This may happen due to incorrect bank information, mismatch in account
      holder name, invalid IFSC code, or incomplete details.
    </p>

    <p style="font-size:15px; line-height:1.6;">
      Please review your bank details carefully and
      <strong>resubmit the correct information</strong> to enable withdrawals on
      your FixKar account.
    </p>

    <!-- CTA BUTTON -->
    <div style="text-align:center; margin:28px 0;">
      <a
        href="https://fixkar.netlify.app"
        style="
          display:inline-block;
          padding:14px 34px;
          background:#dc3545;
          color:#ffffff;
          text-decoration:none;
          font-size:15px;
          font-weight:600;
          border-radius:30px;
          box-shadow:0 8px 20px rgba(220,53,69,0.35);
        "
      >
        Update Bank Details
      </a>
    </div>

    <p style="font-size:14px; color:#6c757d;">
      Once updated, our team will re-verify your bank details. Withdrawals will
      be enabled after successful verification.
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

        await sendEmail(professional.userId.email, 'Your Bank Details missmatch!', htmlContent);

        return res.status(200).json({
            message: "Bank details reject kiya gya!"
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}