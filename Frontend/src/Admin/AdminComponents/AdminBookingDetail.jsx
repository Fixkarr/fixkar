import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTools,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaRoute,
  FaCheckCircle,
  FaHourglassHalf,
  FaIdCard,
  FaUserTie,
  FaBriefcase,
} from "react-icons/fa";
import {useParams} from "react-router-dom"
import axios from 'axios'
import {server_url} from '../../App'
import { toast } from "react-toastify";

const AdminBookingDetail = () => {

const [booking, setBooking] = useState({});
const {bookingId} = useParams();

useEffect(()=>{
    const fetchBooking = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/admin/get-admin-booking/${bookingId}`, {withCredentials : true});
            console.log(result.data.booking)
            setBooking(result.data.booking)
            toast.success(result.data.message);
        } catch (error) {
            console.log(error)
        }
    }

    fetchBooking();
},[])

console.log(booking)
  if (!booking) {
    return (
      <div className="text-center py-5 text-muted">
        Booking data not available
      </div>
    );
  }

  const {
    _id,
    status,
    chargeType,
    problemDescription,
    workDate,
    workTime,
    workAddress,
    visitingCharge,
    distanceInKm,
    createdAt,
    customerName,
    mobileNumber,
    customerId,
    professionalId,
  } = booking;

  const customerUser = customerId?.userId;
  const professionalUser = professionalId?.userId;
  const profession = professionalId?.profession;

  return (
    <div
      className="container-fluid p-4 rounded-4 shadow-lg"
      style={{
        background:
          "linear-gradient(135deg, #1f4037, #99f2c8)",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        className="card border-0 shadow-lg rounded-4 mb-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, #141e30, #243b55)",
        }}
      >
        <div className="card-body">
          <h4 className="fw-bold mb-2">
            <FaIdCard className="me-2 text-warning" />
            Booking Detail
          </h4>
          <div className="d-flex flex-wrap gap-3 small">
            <span>
              <strong>ID:</strong> {_id || "N/A"}
            </span>
            <span
              className={`badge px-3 py-2 ${
                status === "approved"
                  ? "bg-success"
                  : status === "pending"
                  ? "bg-warning text-dark"
                  : "bg-secondary"
              }`}
            >
              {status || "N/A"}
            </span>
            <span>
              <FaCalendarAlt className="me-1" />
              {createdAt
                ? new Date(createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= CUSTOMER ================= */}
      <Section title="Customer Details" icon={<FaUser />}>
        <Info label="Name" value={customerName || customerUser?.fullName} />
        <Info label="Email" value={customerUser?.email} />
        <Info label="Mobile" value={mobileNumber || customerUser?.mobile} />
        <Info label="User ID" value={customerUser?._id} />
        <Info label="Customer ID" value={customerId?._id} />
        <Info
          label="Mobile Verified"
          value={customerUser?.isMobileVerified ? "Yes" : "No"}
        />
      </Section>

      {/* ================= PROFESSIONAL ================= */}
      <Section title="Professional Details" icon={<FaUserTie />}>
        <Info label="Name" value={professionalUser?.fullName} />
        <Info label="Email" value={professionalUser?.email} />
        <Info label="Mobile" value={professionalUser?.mobile} />
        <Info label="Professional ID" value={professionalId?._id} />
        <Info label="Status" value={professionalId?.status} />
        <Info label="Rejection Count" value={professionalId?.rejectionCount} />
        <Info label="Onboarded" value={professionalId?.onBoarded ? "Yes" : "No"} />
      </Section>

      {/* ================= PROFESSION ================= */}
      <Section title="Profession & Skills" icon={<FaBriefcase />}>
        <Info label="Profession" value={profession?.name} />
        <Info label="Description" value={profession?.description} />
        <div className="d-flex flex-wrap gap-2 mt-2">
          {(booking.selectedSkills || []).map((s) => (
            <span
              key={s._id}
              className="badge bg-dark text-white"
            >
              <FaTools className="me-1" />
              {s.name}
            </span>
          ))}
        </div>
      </Section>

      {/* ================= WORK DETAILS ================= */}
      <Section title="Work Details" icon={<FaClock />}>
        <Info label="Problem" value={problemDescription} />
        <Info label="Work Date" value={workDate} />
        <Info label="Work Time" value={workTime} />
        <Info label="Address" value={workAddress} />
        <Info label="Distance (km)" value={distanceInKm} />
        <Info label="Charge Type" value={chargeType} />
      </Section>

      {/* ================= CHARGES ================= */}
      <Section title="Charges" icon={<FaMoneyBillWave />}>
        <Info label="Visiting Charge" value={`₹ ${visitingCharge || 0}`} />
        <Info label="Daily Charge" value={`₹ ${professionalId?.charges?.daily?.amount || "N/A"}`} />
        <Info label="Hourly Charge" value={`₹ ${professionalId?.charges?.hourly?.amount || "N/A"}`} />
        <Info
          label="Contract Range"
          value={`${professionalId?.charges?.contract?.minAmount || "N/A"} - ${professionalId?.charges?.contract?.maxAmount || "N/A"}`}
        />
      </Section>
    </div>
  );
};

/* ================= REUSABLE UI ================= */

const Section = ({ title, icon, children }) => (
  <div
    className="card border-0 shadow-lg rounded-4 mb-4"
    style={{
      background:
        "linear-gradient(135deg, #ffffff, #f1f1f1)",
    }}
  >
    <div className="card-header fw-bold d-flex align-items-center gap-2">
      <span className="text-primary fs-5">{icon}</span>
      {title}
    </div>
    <div className="card-body row g-3">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="col-md-6">
    <div className="small text-muted">{label}</div>
    <div className="fw-semibold">
      {value ?? "N/A"}
    </div>
  </div>
);

export default AdminBookingDetail;
