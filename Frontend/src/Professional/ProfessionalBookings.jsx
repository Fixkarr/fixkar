import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaUserCircle,
  FaClipboardList,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";
import ProBookingCard from "./professionalBooking/ProBookingCard";
import useGetMyBookings from "../hooks/useGetMyBookings";

export default function ProfessionalBookings() {
  useGetMyBookings();

  const navigate = useNavigate();
  const { myBookings } = useSelector((state) => state.bookings);

  const total = myBookings?.length || 0;
  const completed = myBookings?.filter(b => b.status === "completed").length;
  const pending = myBookings?.filter(b => b.status !== "completed").length;

  return total !== 0 ? (
    <div className="container-fluid p-0">

      {/* 🔵 Gradient Header */}
      <div
        className="text-white p-4"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Professional Dashboard</h5>

          <div className="d-flex gap-3 fs-5">
            <FaHome role="button" onClick={() => navigate("/professional/home")} />
            <FaBell role="button" onClick={() => navigate("/professional/notifications")} />
            <FaUserCircle role="button" onClick={() => navigate("/professional/profile")} />
          </div>
        </div>

        <p className="mt-2 small opacity-75">
          Manage and track your assigned Fixkar bookings
        </p>
      </div>

      {/* 🔵 Stats Section */}
      <div className="container mt-4">
        <div className="row g-3">

          <div className="col-4">
            <div className="card border-0 shadow-sm text-center rounded-4">
              <div className="card-body">
                <FaClipboardList className="text-primary mb-2" />
                <h6 className="fw-bold">{total}</h6>
                <small>Total</small>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="card border-0 shadow-sm text-center rounded-4">
              <div className="card-body">
                <FaClock className="text-warning mb-2" />
                <h6 className="fw-bold">{pending}</h6>
                <small>Pending</small>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="card border-0 shadow-sm text-center rounded-4">
              <div className="card-body">
                <FaCheckCircle className="text-success mb-2" />
                <h6 className="fw-bold">{completed}</h6>
                <small>Completed</small>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🔵 Booking List */}
      <div className="container mt-4 mb-5">
        {myBookings.map((booking) => (
          <div
            key={booking._id}
            className="card border-0 shadow-sm mb-4 rounded-4"
          >
            <ProBookingCard booking={booking} />
          </div>
        ))}
      </div>

      {/* 🔵 Floating Home Button */}
      <button
        className="btn btn-primary rounded-circle shadow-lg"
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "60px",
          height: "60px"
        }}
        onClick={() => navigate("/professional/home")}
      >
        <FaHome />
      </button>

    </div>
  ) : (
    <NoBookingsPlaceholder />
  );
}