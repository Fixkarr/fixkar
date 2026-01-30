import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useGetCurrentUser from "./hooks/useGetCurrentUser";

import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgetPass from "./Components/ForgetPass";
import OtpVerify from "./Components/OtpVerify";
import ResetPassword from "./Components/ResetPassword";
import PageNotFound from "./Components/PageNotFound";

import DashboardLayout from "./Pages/DashboardLayout";

// Customer
import CustomerHome from "./Customer/CustomerHome";
import CustomerBookings from "./Customer/CustomerBookings";
import HireProfessionals from "./Customer/HireProfessionals";
import CustomerContact from "./Customer/CustomerContact";


// Professional
import OnBoard from "./Professional/OnBoard";
import VerifyMobile from "./Professional/VerifyMobile";
import Onboarding from "./Professional/Onboarding";
import Pending from "./Professional/Pending";
import Rejected from "./Professional/Rejected";
import ProfessionalHome from "./Professional/ProfessionalHome";
import ProfessionalProfile from "./Professional/ProfessionalProfile";
import ProfessionalBookings from "./Professional/ProfessionalBookings";
import CompleteProfile from "./Professional/CompleteProfile";
import ProfessionalInfo from "./Customer/ProfessionalInfo";
import ChatSection from "./Components/ChatSection";
import socket from "./socket.js";
import Messages from "./Professional/Messages.jsx";
import useGetCurrentAdmin from './hooks/useGetCurrentAdmin.jsx'
import { addNewBooking, updateBookingInRedux } from "./redux/booking.Slice.js";
import { refreshWallet } from "./redux/wallet.slice.js";
import ProBookingDetails from "./Professional/professionalBooking/ProBookingDetails.jsx";
import CusBookingDetail from "./Customer/customerBooking/CusBookingDetail.jsx";
import AdminSignup from "./Admin/AdminComponents/AdminSignup.jsx";
import AdminLogin from "./Admin/AdminComponents/AdminLogin.jsx";
import AdminLanding from "./Admin/AdminComponents/AdminLanding.jsx";
import AdminHome from "./Admin/AdminComponents/AdminHome.jsx";
import AdminServices from "./Admin/AdminComponents/AdminServices.jsx";
import AdminUsers from "./Admin/AdminComponents/AdminUsers.jsx";
import TermsAndConditions from "./Components/Policies/TermsAndConditions.jsx";
import ServiceDelieveryPolicy from "./Components/Policies/ServiceDelieveryPolicy.jsx";
import CancellationRefundPolicy from "./Components/Policies/CancellationRefundPolicy.jsx";
import PrivacyPolicy from "./Components/Policies/PrivacyPolicy.jsx";
import Contact from "./Components/Contact.jsx";
import About from "./Pages/About.jsx";
import ProfessionalOnboardingPolicy from "./Components/Policies/ProfessionalOnboardingPolicy.jsx";
import Notification from "./Components/Notification.jsx";
import { addNotification } from "./redux/notification.slice.js";
import { addMessageToChat, markAllMessagesSeenInChat, updateConversationOnNewMessage, updateMessageStatus } from "./redux/chatMessages.slice.js";
import { setOnlineUsers } from "./redux/presence.slice.js";
import UpdateServiceForm from "./Admin/AdminComponents/Utils/UpdateServiceForm.jsx";
import AdminBookings from "./Admin/AdminComponents/AdminBookings.jsx";
import AdminBookingDetail from "./Admin/AdminComponents/AdminBookingDetail.jsx";
import TransactionHistory from "./Professional/ProfessionalTransactions.jsx";

export const server_url = import.meta.env.VITE_SERVER_URL;
const adminpath = import.meta.env.VITE_ADMIN_PATH

const App = () => {
  useGetCurrentUser();
  useGetCurrentAdmin()
  const { currentUserData } = useSelector((state) => state.user);
  const {currentAdmin} = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const location = useLocation();
  const role = currentUserData?.user?.userId?.role;
  const isOnboarded = currentUserData?.user?.onBoarded;
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;
  const status = currentUserData?.user?.status;
  const userId = currentUserData?.user?.userId?._id;
  const id = currentUserData?.user?._id

  useEffect(() => {
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
  }, [location.pathname]);

  useEffect(() => {
    if (!userId || !role) return;

    socket.io.opts.query = { userId };
    socket.connect();
    // ✅ ONLINE USERS
    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });
    // 1️⃣ New Message
  socket.on("newMessage", (msg) => {
    dispatch(addMessageToChat(msg));

    dispatch(
      updateConversationOnNewMessage({
        senderId: msg.sender === userId ? msg.reciever : msg.sender,
        message: msg.message || "📎 Attachment",
        isMine: msg.sender === userId,
      })
    );
  });

  // 2️⃣ Message Delivered ✔
  socket.on("messageDelivered", ({ messageId }) => {
    dispatch(
      updateMessageStatus({
        messageId,
        status: "delivered",
        deliveredAt: new Date().toISOString(),
      })
    );
  });

  // 3️⃣ Messages Seen ✔✔
  socket.on("messagesSeen", ({ seenBy }) => {
    dispatch(
      markAllMessagesSeenInChat({
        myId: userId,
        otherUserId: seenBy,
      })
    );
  });

    // ✅ PROFESSIONAL SIDE
    socket.on("newBookingRequest", (booking) => {
      if (role === "professional") {
        dispatch(addNewBooking(booking));
      }
    });

     socket.on("notification", (data) => {
      dispatch(addNotification(data));
    });

    // ✅ CUSTOMER SIDE
    socket.on("bookingCreated", (booking) => {
      if (role === "customer") {
        dispatch(addNewBooking(booking));
      }
    });


    // ✅ COMMON UPDATE (cancel / accept / payment)
    socket.on("bookingUpdated", (booking) => {
      dispatch(updateBookingInRedux(booking));
      dispatch(refreshWallet())
    });
  

    return () => {
      socket.off("newMessage");
      socket.off("messageDelivered");
      socket.off("messagesSeen");
      socket.off("getOnlineUsers");
      socket.off("newBookingRequest");
      socket.off("bookingCreated");
      socket.off("bookingUpdated");
      socket.off("notification");
      socket.disconnect();
    };
  }, [userId, role]);

  // ---------------------------
  // ROOT REDIRECT HANDLER LOGIC
  // ---------------------------
  const redirectUser = () => {
    if (!currentUserData && !currentAdmin) return <Home />;
    if(currentAdmin) return <Navigate to={adminpath}/>

    if (role === "customer") return <Navigate to="/customer/home" replace />;

    if (role === "professional") {
      if (!isMobileVerified)
        return <Navigate to="/onboard/verify-mobile" replace />;
      if (!isOnboarded) return <Navigate to="/onboard" replace />;
      if (status === "pending")
        return <Navigate to="/application/pending" replace />;
      if (status === "rejected")
        return <Navigate to="/application/rejected" replace />;

      return <Navigate to="/professional/home" replace />;
    }

    return <Home />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={redirectUser()} />
      <Route
        path="/signup"
        element={!currentUserData ? <Signup /> : <Navigate to="/" replace />}
      />
      <Route
        path="/login"
        element={!currentUserData ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/forget-password"
        element={
          !currentUserData ? <ForgetPass /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/verify-otp"
        element={!currentUserData ? <OtpVerify /> : <Navigate to="/" replace />}
      />
      <Route
        path="/reset-password"
        element={
          !currentUserData ? <ResetPassword /> : <Navigate to="/" replace />
        }
      />

      {/* Dashboard Layout Wrapper */}
      <Route element={<DashboardLayout />}>
        {/* Customer */}
        <Route
          path="/customer/home"
          element={role === "customer" ? <CustomerHome /> : <Navigate to="/" />}
        />
        <Route
          path="/customer/bookings"
          element={
            role === "customer" ? <CustomerBookings /> : <Navigate to="/" />
          }
        />
        <Route
          path="/customer/bookings/:bookingId"
          element={
            role === "customer" ? <CusBookingDetail /> : <Navigate to="/" />
          }
        />
        <Route
          path="/customer/hire-professionals"
          element={
            role === "customer" ? <HireProfessionals /> : <Navigate to="/" />
          }
        />
        <Route
          path="/customer/contact"
          element={
            role === "customer" ? <CustomerContact /> : <Navigate to="/" />
          }
        />
        <Route
          path="professional/profile/visit/:id"
          element={
            role === "customer" ? <ProfessionalInfo /> : <Navigate to="/" />
          }
        />
        <Route
          path="customer/chat/:id"
          element={role === "customer" ? <ChatSection /> : <Navigate to="/" />}
        />
        <Route
          path="/customer/verify-mobile"
          element={
            role === "customer" && !isMobileVerified ? (
              <VerifyMobile />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/customer/messages"
          element={role === "customer" ? <Messages /> : <Navigate to="/" />}
        />
         <Route
          path="/customer/notifications"
          element={role === "customer" ? <Notification role={role} /> : <Navigate to="/" />}
        />
        {/* Professional */}
        <Route
          path="/professional/home"
          element={
            role === "professional" ? <ProfessionalHome /> : <Navigate to="/" />
          }
        />
        <Route
          path="/professional/profile"
          element={
            role === "professional" ? (
              <ProfessionalProfile />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/professional/bookings"
          element={
            role === "professional" ? (
              <ProfessionalBookings />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/professional/bookings/:bookingId"
          element={
            role === "professional" ? (
              <ProBookingDetails />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/professional/complete-profile"
          element={
            role === "professional" ? <CompleteProfile /> : <Navigate to="/" />
          }
        />
        <Route
          path="/professional/messages"
          element={role === "professional" ? <Messages /> : <Navigate to="/" />}
        />
        <Route
          path="/professional/notifications"
          element={role === "professional" ? <Notification role={role} /> : <Navigate to="/" />}
        />
        <Route
          path="/professional/chat/:id"
          element={
            role === "professional" ? <ChatSection /> : <Navigate to="/" />
          }
        />
        <Route
          path="/professional/transaction-history"
          element={
            role === "professional" ? <ProfessionalTransactions proId={id}/> : <Navigate to="/" />
          }
        />

        {/* Admin  */}

          <Route path={`${adminpath}/home`} element={currentAdmin ? <AdminHome/> : <Navigate to="/" />}/>
          <Route path={`${adminpath}/signup`} element={currentAdmin?.role === "super_admin" ? <AdminSignup/> : (<Navigate to={`${adminpath}/home`}/>)}/>
          
          <Route path={`${adminpath}/manage-services`} element={currentAdmin?.role === "super_admin" ? <AdminServices/> : (<Navigate to={`${adminpath}/home`}/>)}/>

          <Route path={`${adminpath}/manage-users`} element={currentAdmin?.role === "super_admin" ? <AdminUsers/> : (<Navigate to={`${adminpath}/home`}/>)}/>
          <Route path={`${adminpath}/manage-bookings`} element={currentAdmin?.role === "super_admin" ? <AdminBookings/> : (<Navigate to={`${adminpath}/home`}/>)}/>
          <Route path={`${adminpath}/manage-bookings/:bookingId`} element={currentAdmin?.role === "super_admin" ? <AdminBookingDetail/> : (<Navigate to={`${adminpath}/home`}/>)}/>
          
          <Route path={`${adminpath}/update-service/:serviceId`} element={currentAdmin?.role === "super_admin" ? <UpdateServiceForm/> : <Navigate to={`${adminpath}/home`}/>}/>

      </Route>

      {/* Onboarding */}
      <Route
        element={role === "professional" ? <OnBoard /> : <Navigate to="/" />}
      >
        <Route
          path="/onboard/verify-mobile"
          element={
            !isMobileVerified ? <VerifyMobile /> : <Navigate to="/onboard" />
          }
        />
        <Route
          path="/onboard"
          element={
            isMobileVerified && !isOnboarded ? (
              <Onboarding userData={currentUserData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/application/pending"
          element={status === "pending" ? <Pending /> : <Navigate to="/" />}
        />
        <Route
          path="/application/rejected"
          element={status === "rejected" ? <Rejected /> : <Navigate to="/" />}
        />
      </Route> 
      {/* Admin Pannel starts here */}

       <Route path={`${adminpath}`} element={ !currentUserData && !currentAdmin ? <AdminLanding/> : (currentAdmin ? <Navigate to={`${adminpath}/home`}/> : <Navigate to="/"/>)}/>

          <Route path={`${adminpath}/login`} element={ !currentUserData && !currentAdmin ? <AdminLogin/> : (currentAdmin ? <Navigate to={`${adminpath}/home`}/> : <Navigate to="/"/>)}/>


          {/* footer links */}

          <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/service-delievery" element={<ServiceDelieveryPolicy/>}/>
          <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/professional-policy" element={<ProfessionalOnboardingPolicy/>}/>

        
      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
