import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaUserCheck,
  FaUserClock,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaHourglassHalf,
  FaTools,
  FaRupeeSign,
} from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import StatCard from "./Utils/StatCard";
import AdminServices from "./AdminServices";


// const dummyServices = [
//   {
//     _id: "srv1",
//     name: "Electrician",
//     description: "Electrical wiring, repair, switch & appliance installation",
//     image: "https://via.placeholder.com/100?text=Electrician",
//     professionalCount: 320,
//   },
//   {
//     _id: "srv2",
//     name: "Plumber",
//     description: "Pipe fitting, leakage repair & bathroom solutions",
//     image: "https://via.placeholder.com/100?text=Plumber",
//     professionalCount: 280,
//   },
//   {
//     _id: "srv3",
//     name: "Carpenter",
//     description: "Furniture repair, custom woodwork & fittings",
//     image: "https://via.placeholder.com/100?text=Carpenter",
//     professionalCount: 190,
//   },
//   {
//     _id: "srv4",
//     name: "Painter",
//     description: "Interior & exterior painting with premium finish",
//     image: "https://via.placeholder.com/100?text=Painter",
//     professionalCount: 140,
//   },
//   {
//     _id: "srv5",
//     name: "AC Repair",
//     description: "AC servicing, gas refill & installation",
//     image: "https://via.placeholder.com/100?text=AC+Repair",
//     professionalCount: 210,
//   },
//   {
//     _id: "srv6",
//     name: "RO / Water Purifier",
//     description: "RO installation, filter change & maintenance",
//     image: "https://via.placeholder.com/100?text=RO+Service",
//     professionalCount: 95,
//   },
//   {
//     _id: "srv7",
//     name: "Home Cleaning",
//     description: "Full house deep cleaning & sanitization",
//     image: "https://via.placeholder.com/100?text=Cleaning",
//     professionalCount: 160,
//   },
//   {
//     _id: "srv8",
//     name: "Appliance Repair",
//     description: "Washing machine, fridge & microwave repair",
//     image: "https://via.placeholder.com/100?text=Appliance",
//     professionalCount: 175,
//   },
//   {
//     _id: "srv9",
//     name: "CCTV Installation",
//     description: "CCTV camera setup, wiring & maintenance",
//     image: "https://via.placeholder.com/100?text=CCTV",
//     professionalCount: 88,
//   },
//   {
//     _id: "srv10",
//     name: "Pest Control",
//     description: "Termite, mosquito & pest treatment solutions",
//     image: "https://via.placeholder.com/100?text=Pest+Control",
//     professionalCount: 120,
//   },
// ];


const AdminHome = () => {
  const { currentAdmin } = useSelector((state) => state.admin);

  const bgGradient = `linear-gradient(135deg, ${
    currentAdmin ? "#0f2027" : "#0d6efd"
  }, ${currentAdmin ? "#2c5364" : "#4f9cff"})`;

  return (
    <div
      className="container-fluid min-vh-100 text-white py-4"
      style={{ background: bgGradient }}
    >
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="fw-bold">👑 Super Admin Dashboard</h2>
        <p className="text-light opacity-75 mb-0">
          Platform health • Users • Bookings • Revenue
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="row g-4 mb-4">
        <StatCard
          title="Total Users"
          value="2,450"
          icon={<FaUsers />}
          color="primary"
        />
        <StatCard
          title="Total Customers"
          value="1,780"
          icon={<FaUsers />}
          color="success"
        />
        <StatCard
          title="Total Professionals"
          value="670"
          icon={<FaUserTie />}
          color="warning"
        />
        <StatCard
          title="Total Earnings"
          value="₹ 3,45,000"
          icon={<FaRupeeSign />}
          color="info"
        />
         <StatCard
          title="Pending Applications"
          value="110"
          icon={<FaUserClock />}
          color="warning"
        />
         <StatCard
          title="Total Bookings"
          value="4,820"
          icon={<FaClipboardList />}
          color="primary"
        />
         <StatCard
          title="Total Services"
          value="10"
          icon={<FaClipboardList />}
          color="warning"
        />
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */




export default AdminHome;
