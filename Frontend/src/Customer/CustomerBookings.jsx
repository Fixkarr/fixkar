// pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { server_url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";
import { ClipLoader } from "react-spinners";
import { formatDate, formatTime } from "../utils/formatTime&Date";
import { setReachedOtp } from "../redux/otp.Slice";
import { useDispatch } from "react-redux";
import { MdHomeRepairService } from "react-icons/md";

const CustomerBookings = () => {
  const [loading, setLoading] = useState(false);
  const { myBookings } = useSelector((state) => state.bookings);
  const {otp, bookingId} = useSelector(state=> state.reachedOtp)
  const dispatch = useDispatch();

   useEffect(() => {
  myBookings.forEach((booking) => {
    const otp = localStorage.getItem(`otp_${booking._id}`);
    if (otp) {
      dispatch(setReachedOtp({ bookingId: booking._id, otp }));
    }
  });
}, [myBookings, dispatch]);

  // handle cancel function 

  const handleCancel = async (bookingId, visitingCharge) => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${server_url}/api/booking/cancel-booking`,
        { bookingId }
      );

      if (!result.data.success) {
        return toast.info(
          <div className="alert alert-info mt-3" role="alert">
            <h6 className="fw-bold mb-2">Late Cancellation Notice</h6>

            <p className="mb-2">
              You are attempting to cancel this booking after the scheduled
              working date. As per our cancellation policy, late cancellations
              require payment of the professional’s visiting charge along with
              an additional cancellation fee.
            </p>

            <p className="mb-3">
              Please note that the booking will be cancelled{" "}
              <strong>
                only after the applicable charges are paid successfully
              </strong>
              . Until the payment is completed, the booking will remain active
              and cannot be cancelled.
            </p>

            <div className="border rounded p-2 mb-3 bg-light">
              <div className="d-flex justify-content-between">
                <span>Professional Visiting Charge</span>
                <span>₹{visitingCharge}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Late Cancellation Fee</span>
                <span>₹50</span>
              </div>

              <hr className="my-2" />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total Payable Amount</span>
                <span>₹{visitingCharge + 50}</span>
              </div>
            </div>

            <button className="btn btn-info w-100 fw-semibold">Pay Now</button>
          </div>,
          {
            autoClose: false, // ❌ auto close band
            closeOnClick: false,
            draggable: false,
            pauseOnHover: true,
            onClose: () => {
              setLoading(false);
            },
          }
        );
      }

      toast.success(result.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      toast.error("Internal server error!");
      setLoading(false);
    }
  };

  // status handler UI 
  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "rejected":
        return "danger";
      case "accepted":
        return "success";
      case "in-progress":
        return "primary";
      case "reached":
        return "info";
      case "completed":
        return "success";
      default:
        return "warning";
    }
  };

  return myBookings.length !== 0 ? (
    <div className="container my-4">
      <h4 className="mb-4 fw-bold">My Bookings</h4>

      {myBookings?.map((booking) => (
        <div className="card shadow-sm mb-4" key={booking._id}>
          <div className="card-body">
            {/* Top Section */}
            <div className="d-flex align-items-center mb-3">
              <img
                src={booking.professionalId.profilePicture}
                alt="profile"
                className="rounded-circle border"
                width="70"
                height="70"
              />

              <div className="ms-3 flex-grow-1">
                <h6 className="mb-1 fw-bold">
                  {booking.professionalId.userId.fullName}
                </h6>
                <p className="mb-0 text-muted">{booking.profession}</p>
                <small className="text-muted">
                  {booking.professionalId.address.addressLine}
                </small>
              </div>

              <div
                className={`badge bg-${getStatusVariant(
                  booking.status
                )} text-capitalize`}
              >
                {booking.status}
              </div>
            </div>

            <hr />

            {/* Booking Details */}
            <div className="row g-3">
              <div className="col-md-4">
                <small className="text-muted">Booking ID</small>
                <p className="fw-semibold mb-0">{booking._id}</p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Visiting Charge</small>
                <p className="fw-semibold mb-0">₹{booking.visitingCharge}</p>
              </div>
              <div className="col-md-4">
                <small className="text-muted">Charge Type</small>
                <p className="fw-semibold mb-0">{booking.chargeType}</p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Distance</small>
                <p className="fw-semibold mb-0">{booking.distanceInKm} km</p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Work Date</small>
                <p className="fw-semibold mb-0">
                  {formatDate(booking.workDate)}
                </p>
              </div>

              <div className="col-md-4">
                <small className="text-muted">Work Time</small>
                <p className="fw-semibold mb-0">
                  {formatTime(booking.workTime)}
                </p>
              </div>

              <div className="col-md-12">
                <small className="text-muted">Problem Description</small>
                <p className="mb-0">{booking.problemDescription}</p>
              </div>

              <div className="col-md-12">
                <small className="text-muted">Work Address</small>
                <p className="mb-0">{booking.workAddress}</p>
              </div>
            </div>
                {/* Cancel button */}
            <div className="g-3 mt-2">
              {(booking.status == "pending" ||
                booking.status == "accepted" ||
                booking.status == "reached") && (
                <button
                  className="btn btn-outline-danger"
                  disabled={loading}
                  onClick={() =>
                    handleCancel(booking._id, booking.visitingCharge)
                  }
                >
                  {loading && <ClipLoader size={20} />} Cancel
                </button>
              )}
            </div>

            {/* Reject message */}
            {booking.rejectMessage && (
              <p className="bg-danger-subtle text-danger p-2 rounded">
                Your booking has been rejected by the professional. <br />{" "}
                <b>Message from {booking.professionalId.userId.fullName} :</b> '
                {booking.rejectMessage}'{" "}
              </p>
            )}

            {/* Accept Message  */}
            {booking.status == "accepted" && (
              <div className="alert alert-success rounded-4 shadow-sm mt-3">
                <h6 className="fw-bold mb-2">Booking Confirmed Successfully</h6>

                <p className="mb-2">
                  Your booking has been{" "}
                  <strong>accepted by the professional</strong>. The service is
                  scheduled on <strong>{formatDate(booking.workDate)}</strong>.
                </p>

                <p className="mb-2">
                  Please ensure that you are available at the service location
                  on the scheduled date so the professional can begin the work
                  without delay.
                </p>

                <p className="mb-0">
                  <strong>Service Address:</strong> {booking.workAddress}
                </p>
              </div>
            )}

            {/* Reached Message and OTP */}
            {booking.status == "reached" && otp && bookingId === booking._id && (
                <div className="alert alert-warning text-center">
                  <h6>Professional has arrived</h6>
                  <h3 className="fw-bold">{otp}</h3>
                  <p className="small">
                    Share this OTP with the professional to start work
                  </p>
                </div>
              )
            }
            {booking.status === "in-progress" && (
  <div className="alert alert-primary rounded-4 shadow-sm mt-3">
    <div className="d-flex align-items-center mb-2">
      <span className="fs-4 me-2"><MdHomeRepairService /></span>
      <h6 className="fw-bold mb-0">Service In Progress</h6>
    </div>

    <p className="mb-2">
      <strong>{booking.professionalId.userId.fullName}</strong> has successfully
      arrived at your location and started working on your service request.
    </p>

    <div className="border rounded-3 p-3 bg-light mb-2">
      <p className="mb-1">
        <strong>Status:</strong>{" "}
        <span className="text-success fw-semibold">
          Work is currently ongoing
        </span>
      </p>

      <p className="mb-1">
        <strong>Started At:</strong>{" "}
        {booking.startedAt
          ? formatTime(booking.startedAt)
          : "Just now"}
      </p>

      <p className="mb-0">
        <strong>Service Address:</strong> {booking.workAddress}
      </p>
    </div>
  </div>
)}


          </div>
        </div>
      ))}
    </div>
  ) : (
    <NoBookingsPlaceholder />
  );
};

export default CustomerBookings;
