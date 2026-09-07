import React, { useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";

const PayButton = ({
  booking,
  paymentType,
  label,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const couponApplied = booking?.offerLocked === true;
  const rewardApplied = booking?.rewardCreditsApplied === true;
  const rewardCredits = Number(
    booking?.customerId?.rewardCredits || 0
  );

  const [rewardLoading, setRewardLoading] = useState(false);


  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return toast.error("Enter a coupon code");
    try {
      setCouponLoading(true);
      await axios.post(
        `${server_url}/api/user/coupons/claim`,
        { couponCode: code },
        { withCredentials: true },
      );
      const result = await axios.post(
        `${server_url}/api/user/coupons/apply-to-booking`,
        { bookingId : booking._id, couponCode: code },
        { withCredentials: true },
      );
      toast.success(`Coupon applied. You save ₹${result.data.discountAmount}`);
      // Booking state is already socket-enabled elsewhere, but a refresh guarantees
      // the payment summary uses the newly locked payable amount in every client.
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const applyRewardCredits = async () => {
  if (!booking) {
    return toast.error('Booking not found');
  }
  if (rewardCredits <= 0) {
    return toast.error('No Reward Credits available');
  }
  if (couponApplied) {
    return toast.error(
      'A coupon is already applied to this booking'
    );
  }
  if (rewardApplied) {
    return toast.error(
      'Reward Credits are already applied to this booking'
    );
  }
  try {
    setRewardLoading(true);

    const result = await axios.post(
      `${server_url}/api/customer/use-reward-credits`,
      { bookingId : booking._id },
      { withCredentials: true }
    );

    toast.success(
      `Reward Credits applied. You save ₹${result.data.discountAmount}`
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      'Unable to apply Reward Credits'
    );
  } finally {
    setRewardLoading(false);
  }
};

  const handlePayment = async () => {
    if (disabled || loading) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${server_url}/api/booking/create-order`,
        { bookingId : booking._id, paymentType },
        { withCredentials: true },
      );
      const { order, key } = res.data;
      const verifyPayment = async (response) => {
        try {
          const result = await axios.post(
            `${server_url}/api/booking/verify-payment`,
            {
              bookingId : booking._id,
              paymentType,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true },
          );
          toast.success(result.data.message);
          onSuccess?.(result.data);
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Payment verification failed.",
          );
        } finally {
          setLoading(false);
        }
      };
      if (!window.Razorpay) {
        toast.error("Payment service is not ready. Please try again.");
        setLoading(false);
        return;
      }
      const rzp = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "FixKar",
        description:
          paymentType === "FINAL"
            ? "Service Payment"
            : "Late Cancellation Charge",
        order_id: order.id,
        handler: verifyPayment,
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled by you!");
            setLoading(false);
          },
        },
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start payment.");
      setLoading(false);
    }
  };

  return (
    <div>
      {paymentType === "FINAL" && booking?._id && !couponApplied && !rewardApplied && (
        <div className="border rounded-4 p-3 mt-3 bg-light">
          <div className="fw-semibold mb-2">Have a coupon?</div>
          <div className="input-group">
            <input
              className="form-control text-uppercase"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={couponLoading || loading}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={applyCoupon}
              disabled={couponLoading || loading}
            >
              {couponLoading ? "Checking..." : "Apply"}
            </button>
          </div>
          <small className="text-muted d-block mt-2">
            Enter the coupon code you received. We do not show a public offer
            list.
          </small>
          {rewardCredits > 0 && (
  <div className="mt-3 pt-3 border-top">
    <div className="fw-semibold mb-1">
      Reward Credits
    </div>

    <div className="d-flex align-items-center justify-content-between gap-3">
      <small className="text-muted">
        Available: ₹{rewardCredits}
      </small>

      <button
        className="btn btn-outline-success"
        type="button"
        onClick={applyRewardCredits}
        disabled={
          rewardLoading ||
          couponLoading ||
          loading
        }
      >
        {rewardLoading
          ? 'Applying...'
          : 'Use Reward Credits'}
      </button>
    </div>
  </div>
)}
        </div>
      )}
      <button
        className="btn btn-success w-100 mt-3 fw-semibold"
        disabled={disabled || loading}
        onClick={handlePayment}
      >
        {loading ? "Preparing payment..." : label || "Pay"}
      </button>
    </div>
  );
};

export default PayButton;
