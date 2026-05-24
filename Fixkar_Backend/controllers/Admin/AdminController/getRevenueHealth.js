import { PlatformTransaction } from "../AdminModels/platformTransaction.js";
import { Wallet } from "../../../models/walletModel.js";

export const getRevenueHealth = async (req, res) => {
  try {



    const finance = await PlatformTransaction.aggregate([

      {
        $group: {

          _id: null,

          // TOTAL COMMISSION REVENUE

          totalRevenue: {
            $sum: "$commission"
          },

          // TOTAL PROFIT

          totalProfit: {
            $sum: {
              $cond: [
                { $gt: ["$profitOrLoss", 0] },
                "$profitOrLoss",
                0
              ]
            }
          },

          // TOTAL LOSS

          totalLoss: {
            $sum: {
              $cond: [
                { $lt: ["$profitOrLoss", 0] },
                { $abs: "$profitOrLoss" },
                0
              ]
            }
          },

          // ONLINE MONEY RECEIVED

          totalOnlineReceived: {
            $sum: {
              $cond: [
                {
                  $eq: ["$paymentMode", "ONLINE"]
                },
                "$customerPaidAmount",
                0
              ]
            }
          },

          // CASH BUSINESS VALUE

          totalCashHandled: {
            $sum: {
              $cond: [
                {
                  $eq: ["$paymentMode", "CASH"]
                },
                "$grossAmount",
                0
              ]
            }
          },

          // TOTAL PAYOUTS DONE

          totalPayoutsDone: {
            $sum: {
              $cond: [
                {
                  $eq: ["$paymentMode", "PAYOUT"]
                },
                "$professionalAmount",
                0
              ]
            }
          },

          // TOTAL DISCOUNT

          totalDiscountAmount: {
            $sum: "$discountAmount"
          },

          totalTransactions: {
            $sum: 1
          }

        }
      },

      {
        $project: {

          _id: 0,

          totalRevenue: 1,

          totalProfit: 1,

          totalLoss: 1,

          totalOnlineReceived: 1,

          totalCashHandled: 1,

          totalPayoutsDone: 1,

          totalDiscountAmount: 1,

          totalTransactions: 1,

          // ACTUAL MONEY CURRENTLY
          // WITH ADMIN

          adminCurrentBalance: {
            $subtract: [
              "$totalOnlineReceived",
              "$totalPayoutsDone"
            ]
          }

        }
      }

    ]);

    // =========================
    // REAL PENDING PAYOUTS
    // =========================

    const pendingPayoutResult =
      await Wallet.aggregate([

        {
          $match: {
            pendingBalance: {
              $gt: 0
            }
          }
        },

        {
          $group: {

            _id: null,

            totalPendingPayouts: {
              $sum: "$pendingBalance"
            }
          }
        }
      ]);

    const totalPendingPayouts =
      pendingPayoutResult[0]
        ?.totalPendingPayouts || 0;

    // =========================
    // FINAL RESPONSE
    // =========================

    return res.status(200).json({

      success: true,

      revenueHealth: {

        ...finance[0],

        totalPendingPayouts,

        availablePlatformBalance:
          finance[0]?.adminCurrentBalance -
          totalPendingPayouts

      }

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });

  }
};