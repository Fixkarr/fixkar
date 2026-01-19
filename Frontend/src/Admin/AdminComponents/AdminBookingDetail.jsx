import React from "react";
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

const AdminBookingDetail = () => {

    const booking = {
  _id: "696b2c726050846ac9751205",
  status: "pending",
  chargeType: "daily",
  problemDescription: "Fan kharab hai",
  workDate: "2026-01-17",
  workTime: "11:59",
  workAddress: "Kanpur, Uttar Pradesh, India",
  visitingCharge: 25,
  distanceInKm: 1,
  customerName: "Himanshu Gupta",
  mobileNumber: "+918840039506",
  reachedAt: null,
  currentPaymentId: null,

  createdAt: "2026-01-17T06:30:10.913Z",
  updatedAt: "2026-01-17T11:59:23.322Z",
  __v: 0,

  /* ================= CUSTOMER ================= */
  customerId: {
    _id: "696b259e6050846ac975112f",
    totalBookings: 0,
    createdAt: "2026-01-17T06:01:02.618Z",
    updatedAt: "2026-01-17T06:01:02.618Z",
    __v: 0,

    userId: {
      _id: "696b259e6050846ac9751131",
      fullName: "Hima Gupta",
      email: "himgiru6292@gmail.com",
      mobile: "+918840039506",
      role: "customer",
      isEmailVerified: false,
      isMobileVerified: true,
      createdAt: "2026-01-17T06:01:02.373Z",
      updatedAt: "2026-01-17T07:42:30.268Z",
      __v: 0,
    },
  },

  /* ================= PROFESSIONAL ================= */
  professionalId: {
    _id: "696a1760b6a2c9aa89550b9f",
    status: "approved",
    rejectionCount: 0,
    onBoarded: true,
    busyDays: [],
    reviews: [],
    gallery: [],
    poi:
      "https://res.cloudinary.com/dopfy7csv/image/upload/v1768560581/professionals/poi_documents/sample.jpg",
    profilePicture:
      "https://res.cloudinary.com/dopfy7csv/image/upload/v1768560581/professionals/profile_pictures/sample.png",
    public_id:
      "professionals/profile_pictures/sample.png",

    dob: "2008-01-16T00:00:00.000Z",
    description:
      "Vj kuch toofani ki nh hm man mt aaj tb tk kha se in n",

    createdAt: "2026-01-16T10:48:00.514Z",
    updatedAt: "2026-01-19T03:37:04.795Z",
    __v: 1,

    /* ===== ACCEPTED BY ADMIN ===== */
    acceptedBy: {
      _id: "6958b84f417069abcc61f17b",
      username: "prince@123",
      adminName: "Prince maurya",
      role: "super_admin",
      permissions: [
        "manage_users",
        "manage_content",
        "manage_bookings",
        "manage_professionals",
        "manage_support",
      ],
      createdAt: "2026-01-03T06:33:51.926Z",
      updatedAt: "2026-01-03T06:33:51.926Z",
      __v: 0,
    },

    /* ===== ADDRESS ===== */
    address: {
      addressLine: "Kanpur, Uttar Pradesh, India",
      lat: 26.449923,
      lng: 80.3318736,
    },

    /* ===== USER ===== */
    userId: {
      _id: "696a175fb6a2c9aa89550b9c",
      fullName: "Himanshu Gupta",
      email: "himanshugupta111214@gmail.com",
      mobile: "+918840039506",
      role: "professional",
      isEmailVerified: false,
      isMobileVerified: true,
      createdAt: "2026-01-16T10:47:59.952Z",
      updatedAt: "2026-01-17T11:57:20.426Z",
      __v: 0,
    },

    /* ===== CHARGES ===== */
    charges: {
      amountType: "multiple",
      amountDesc: "Flux",
      daily: { amount: "400" },
      hourly: { amount: "100" },
      contract: {
        minAmount: "5000",
        maxAmount: "99999",
      },
    },

    /* ===== PROFESSION ===== */
    profession: {
      _id: "6968aae2601ee76da2591370",
      name: "Plumber",
      image:
        "https://res.cloudinary.com/dopfy7csv/image/upload/v1768467169/services/plumber.png",
      description:
        "प्लंबर पानी की पाइपलाइन, नल, सिंक, शौचालय और ड्रेनेज सिस्टम से जुड़ा काम करता है।",
      professionalCount: 2,
      createdAt: "2026-01-15T08:52:50.198Z",
      updatedAt: "2026-01-17T09:58:27.757Z",
      __v: 2,

      skills: [
        { _id: "s1", name: "Pipe Leakage Repair" },
        { _id: "s2", name: "Bathroom–Toilet ka Kaam" },
        { _id: "s3", name: "Sink / Nali Choke Kholna" },
        { _id: "s4", name: "Emergency Paani Leakage Service" },
      ],
    },
  },

  /* ================= SELECTED SKILLS ================= */
  selectedSkills: [
    { _id: "s1", name: "Pipe Leakage Repair" },
    { _id: "s2", name: "Bathroom–Toilet ka Kaam" },
    { _id: "s3", name: "Sink / Nali Choke Kholna" },
    { _id: "s4", name: "Emergency Paani Leakage Service" },
  ],
};





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
