import { Wallet } from "../../../models/walletModel.js";
import { WalletTransaction } from "../../../models/walletTransactionModel.js";
import { pushNotification } from "../../../services/pushNotification.js";
import { sendEmail } from "../../../utils/mailer.js";
import { maskSensitiveValue } from "../../../utils/maskSensitiveValue.js";


export const manualPay = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const { proId, utr, paymentMode } = req.body;
    if (!proId || !utr || !paymentMode) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const proWallet = await Wallet.findOne({ professionalId: proId }).populate({
  path: "professionalId",
  select: "+bankDetails.accountNumber +bankDetails.holderName",
  populate: {
    path: "userId",
    select: "fullName email"
  }
});

    if (!proWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (!proWallet.withdrawnRequest?.pending) {
      return res.status(400).json({
        message: "No pending withdrawal request found"
      });
    }

    const withdrawAmount = proWallet.withdrawnRequest.amount;
    const htmlContent =  `<div
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
      background:linear-gradient(135deg,#0d6efd,#4f9cff);
    "
  >
    <h2 style="margin:0; font-size:22px;">
      Withdrawal Successful
    </h2>
    <p style="margin:8px 0 0; font-size:14px; opacity:0.95;">
      Your payment has been transferred successfully
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:28px; color:#212529;">
    <p style="font-size:15px; margin-top:0;">
      Hello <strong>${proWallet.professionalId.userId.fullName}</strong>,
    </p>

    <p style="font-size:15px; line-height:1.6;">
      Your requested withdrawal amount of
      <strong style="color:#0d6efd;">₹${withdrawAmount}</strong>
      has been successfully transferred to your bank account.
    </p>

    <!-- INFO CARD -->
    <div
      style="
        margin:18px 0;
        padding:16px;
        background:#f5f9ff;
        border-left:5px solid #0d6efd;
        border-radius:8px;
        font-size:14px;
        line-height:1.6;
      "
    >
      <strong>Bank Account:</strong>${maskSensitiveValue(proWallet.professionalId.bankDetails.accountNumber, 4)} <br />
      <strong>Account Holder:</strong> ${proWallet.professionalId.bankDetails.holderName} <br />
      <strong>Transaction ID (UTR):</strong> ${utr} <br />
      <strong>Payment Mode:</strong> ${paymentMode}
    </div>

    <p style="font-size:14px; color:#6c757d;">
      Please keep the above transaction ID for your records. You can use it to
      verify the payment in your bank statement.
    </p>

    <!-- CTA BUTTON -->
    <div style="text-align:center; margin:28px 0;">
      <a
        href="https://fixkar.netlify.app/"
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
        View Wallet
      </a>
    </div>

    <p style="font-size:14px; color:#6c757d;">
      If you face any issue or have questions regarding this transaction, feel
      free to contact our support team.
    </p>

    <p style="font-size:15px; margin-bottom:0;">
      Regards,<br />
      <strong>Team Fixkar</strong>
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

    const existingUTR = await WalletTransaction.findOne({
      "paymentProof.UTR": utr
    });
    if (existingUTR) {
      return res.status(400).json({
        message: "This transaction ID is already used"
      });
    }

    await WalletTransaction.create({
      walletId: proWallet._id,
      type: "DEBIT",
      netAmount: withdrawAmount,
      reason: "Manual withdrawal payout",
      paymentProof: {
        UTR: utr,
        mode: paymentMode,
        amount: withdrawAmount,
        transferedAt: new Date()
      }
    });

    proWallet.pendingBalance -= withdrawAmount;
    proWallet.totalWithdrawn += withdrawAmount;
    proWallet.withdrawnRequest.pending = false;
    proWallet.withdrawnRequest.amount = 0;

    await proWallet.save();

    await pushNotification({
      userId: proWallet.professionalId.userId._id,
      title: "Money transferred",
      message: `₹${withdrawAmount} has been transferred to your bank account successfully!`,
      redirectUrl: "/professional/wallet"
    });

   try {
  await sendEmail(
    proWallet.professionalId.userId.email,
    "Withdrawal successful",
    htmlContent
  );
} catch (mailErr) {
  console.error("Email failed:", mailErr);
}

    return res.status(200).json({
      message: "Money transferred successfully!"
    });

  } catch (error) {
    console.error("manualPay error:", error);
    return res.status(500).json({
      message: "Internal server error!"
    });
  }
};
