import React from "react";
import { useSelector } from "react-redux";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GetStatusBadge } from "../../utils/GetStatusBadge";

const RecentBookings = () => {
  const navigate = useNavigate();

  const bookings = useSelector((state) => state.bookings) || [];

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);



  return (
    <div
      className="card border-0 shadow-sm rounded-4 h-100"
      style={{
        background: "#fff",
      }}
    >
      {/* Header */}

      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-1">Recent Bookings</h5>

            <small className="text-muted">
              Latest booking activities
            </small>
          </div>

          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
            {bookings.length} Total
          </span>
        </div>

        {/* Empty */}

        {recentBookings.length === 0 ? (
          <div className="text-center py-5">
            <img
              src="/images/no-booking.svg"
              alt=""
              style={{ width: 130 }}
            />

            <h6 className="mt-3 fw-semibold">
              No Bookings Yet
            </h6>

            <p className="text-muted small mb-0">
              Your recent bookings will appear here.
            </p>
          </div>
        ) : (
          <>
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                role="button"
                onClick={() =>
                  navigate(`/professional/bookings/${booking._id}`)
                }
                className="border rounded-4 p-3 mb-3 booking-card"
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  {/* Left */}

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <FaUserCircle
                        size={18}
                        className="text-primary me-2"
                      />

                      <h6 className="mb-0 fw-semibold">
                        {booking.customerName}
                      </h6>
                    </div>

                    <div className="small text-muted d-flex align-items-center mb-2">
                      <FaCalendarAlt className="me-2" />

                      {new Date(
                        booking.workDate
                      ).toLocaleDateString()}
                    </div>

                    <div className="small text-muted d-flex align-items-start">
                      <FaMapMarkerAlt
                        className="me-2 mt-1 text-danger"
                      />

                      <span>
                        {booking.workAddress}
                      </span>
                    </div>
                  </div>

                  {/* Right */}

                  <div className="text-end">
                   <GetStatusBadge status={booking.status}/>

                    <div className="mt-3">
                      <FaArrowRight
                        className="text-primary"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Button */}

            {bookings.length > 5 && (
              <button
                onClick={() =>
                  navigate("/professional/bookings")
                }
                className="btn btn-primary w-100 rounded-3 mt-2 py-2 fw-semibold"
              >
                Show All Bookings
              </button>
            )}
          </>
        )}
      </div>

      <style>{`
      
      .booking-card{
      transition:.25s;
      cursor:pointer;
      }

      .booking-card:hover{
      transform:translateY(-3px);
      box-shadow:0 12px 30px rgba(0,0,0,.08);
      border-color:#0d6efd !important;
      }

      @media(max-width:768px){

      .booking-card{
      padding:16px !important;
      }

      }

      `}</style>
    </div>
  );
};

export default RecentBookings;