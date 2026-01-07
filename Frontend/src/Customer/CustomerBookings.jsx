// pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";

import { setReachedOtp } from "../redux/otp.Slice";
import { useDispatch } from "react-redux";

import CusBookingCard from "./customerBooking/CusBookingCard";

const CustomerBookings = () => {
  const { myBookings } = useSelector((state) => state.bookings);
  const dispatch = useDispatch();

  useEffect(() => {
  myBookings.forEach((booking) => {
    const otp = localStorage.getItem(`otp_${booking._id}`);
    if (otp) {
      dispatch(setReachedOtp({ bookingId: booking._id, otp }));
    }
  });
}, [myBookings, dispatch]);



  return myBookings.length !== 0 ? (
    <div className="container my-4">
      <h4 className="mb-4 fw-bold">My Bookings</h4>

      {myBookings?.map((booking) => (
        <div className="card shadow-sm mb-4" key={booking._id}>
          <CusBookingCard booking={booking}/>
        </div>
      ))}
    </div>
  ) : (
    <NoBookingsPlaceholder />
  );
};

export default CustomerBookings;
