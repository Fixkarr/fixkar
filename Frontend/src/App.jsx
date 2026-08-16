import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import { setNotifications } from "./redux/notification.slice.js";
import { addMessageToChat, markAllMessagesSeenInChat, updateMessageStatus } from "./redux/chatMessages.slice.js";
import { addNewMessageToConversation, setConversations } from "./redux/messages.Slice.js";
import { setOnlineUsers } from "./redux/presence.slice.js";
import AdminBookings from "./Admin/AdminComponents/AdminBookings.jsx";
import AdminBookingDetail from "./Admin/AdminComponents/AdminBookingDetail.jsx";
import ProfessionalTransactions from "./Professional/ProfessionalTransactions.jsx";
import Services from "./Components/Services.jsx";
import Explore from "./Components/Explore.jsx";
import ManageForms from "./Admin/AdminComponents/ManageForms.jsx";
import CreateForm from "./Admin/AdminComponents/Utils/CreateForm.jsx";
import axios from 'axios'
import { useState } from "react";
import FixkarLoader from "./Components/FixkarLoader.jsx";
import ManageOffers from "./Admin/AdminComponents/ManageOffers.jsx";
import { generateFCMToken } from "./utils/generateFCMToken.js";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import ManageAnnouncements from "./Admin/AdminComponents/ManageAnnouncements.jsx";
import UpdateOffer from "./Admin/AdminComponents/UpdateOffer.jsx";
import ManageEnquiry from "./Admin/AdminComponents/ManageEnquiry.jsx";
import JoinProcess from "./Components/JoinProcess.jsx";
import ShortLinkRedirect from "./Components/ShortLinkRedirect.jsx";


export const server_url = import.meta.env.VITE_SERVER_URL;
const adminpath = import.meta.env.VITE_ADMIN_PATH

import {Capacitor} from '@capacitor/core'
import {SocialLogin} from '@capgo/capacitor-social-login'
import useNetworkStatus from "./hooks/useNetworkStatus.jsx";
import NoInternet from "./Components/NoInternet.jsx";
import { addAcceptedProfessional, addIncomingRequest, setPickupRequest } from "./redux/pickup.slice.js";
import { toast } from "react-toastify";
import PickupToast from "./Professional/PickupToast.jsx";
import IncomingBooking from "./Professional/professionalBooking/Pickup/IncomingBooking.jsx";
import IncomingRequests from "./Professional/professionalBooking/Pickup/IncomingRequests.jsx";
import AdminProtectedRoute from "./Components/AdminProtectedRoute.jsx";
import { PushNotifications } from "@capacitor/push-notifications";

const App = () => {
  useGetCurrentUser();
  useGetCurrentAdmin()
  const [backendReady, setBackendReady] = useState(false);
  const { currentUserData , isAuthLoading} = useSelector((state) => state.user);
  
  const {currentAdmin} = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const role = currentUserData?.user?.userId?.role;
  const isOnboarded = currentUserData?.user?.onBoarded;
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;
  const status = currentUserData?.user?.status;
  const userId = currentUserData?.user?.userId?._id;
  const activeConversationId = useSelector(
    (state) => state.chatMessages.selectedConversationId
  );
  const activeConversationIdRef = useRef(activeConversationId);
  const id = currentUserData?.user?._id
 const isOnline = useNetworkStatus();

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);



  useEffect(()=>{
    const initSocialLogin = async ()=>{
      if(Capacitor.getPlatform()=== 'android'){
        await SocialLogin.initialize({
          google : {
            webClientId : "229725846095-vd23276c954sa16562q6jm8n8ie3io33.apps.googleusercontent.com"
          }
        })
      }
    }

    initSocialLogin();
  },[])
  useEffect(() => {
  if (Capacitor.getPlatform() !== "android") return;

  let listener;

  const setupNotificationClick = async () => {
    listener = await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        const redirectUrl =
          notification?.notification?.data?.redirectUrl;

        console.log("Notification clicked:", redirectUrl);

        if (!redirectUrl) return;

        navigate(redirectUrl);
      }
    );
  };

  setupNotificationClick();

  return () => {
    if (listener) {
      listener.remove();
    }
  };
}, [navigate]);

useEffect(() => {
  if (Capacitor.getPlatform() !== "android") return;

  let listener;

  const setupForegroundNotification = async () => {
    listener = await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log(
          "Foreground notification received:",
          notification
        );
      }
    );
  };

  setupForegroundNotification();

  return () => {
    if (listener) {
      listener.remove();
    }
  };
}, []);
 
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await axios.get(`${server_url}/api/health`);
        
        if (res.data.status === "ok") {
          setBackendReady(true);
        }
      } catch (error) {
        console.log("Backend not ready...");
      }
    };

    checkBackend();
  }, []);

useEffect(() => {
  const setupFCM = async () => {
    if (!currentUserData?.user?.userId?._id) {
      return;
    }

    await generateFCMToken();
  };

  setupFCM();
}, [currentUserData]);


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
  socket.on("newMessage", async (msg) => {
    dispatch(addMessageToChat(msg));

    dispatch(
      addNewMessageToConversation({
        senderId:
          msg.sender?.toString() === userId?.toString()
            ? msg.reciever
            : msg.sender,
        message: msg.message || "📎 Attachment",
        isMine: msg.sender?.toString() === userId?.toString(),
        isConversationOpen:
          activeConversationIdRef.current?.toString() ===
          (msg.sender?.toString() === userId?.toString()
            ? msg.reciever?.toString()
            : msg.sender?.toString()),
      })
    );

    // An existing conversation updates immediately above. Refreshing from the
    // server also adds a first-ever conversation that is not in local state.
    try {
      const result = await axios.get(
        `${server_url}/api/messages/get-my-conversations`,
        { withCredentials: true }
      );
      dispatch(setConversations(result.data.conversations));
    } catch (error) {
      console.error("Could not refresh conversations after a new message", error);
    }
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

     socket.on("notification", async (data) => {
      dispatch(addNotification(data));

      // Fetch the canonical unread count, including notifications created
      // before the current socket connected.
      try {
        const result = await axios.get(
          `${server_url}/api/notification/get-my-notifications`,
          { withCredentials: true }
        );
        dispatch(setNotifications({
          notifications: result.data.notifications,
          unreadCount: result.data.unreadCount,
        }));
      } catch (error) {
        console.error("Could not refresh notifications", error);
      }
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

socket.on("pickupRequest", (data) => {
    if (role !== "professional") return;

    dispatch(addIncomingRequest(data));

    toast.info(
        <PickupToast data={data} />,
        {
            toastId: `pickup-${data.pickupRequestId}`,
            autoClose: 8000,
            closeOnClick: false,
            closeButton: false,
            hideProgressBar: false,
            position: "top-right",
        }
    );
});

socket.on("pickupProfessionalAccepted", (data) => {
   if (role !== "customer") return;
    console.log(
        "🔥 PROFESSIONAL ACCEPTED:",
        data
    );

    dispatch(
        addAcceptedProfessional(data)
    );
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
      socket.off("pickupRequest");
      socket.off("pickupProfessionalAccepted");
      socket.disconnect();
    };
  }, [userId, role]);

  useEffect(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
}, []);


   if (!backendReady || isAuthLoading) {
    return <FixkarLoader />;
  }
  if (!isOnline) {

  return <NoInternet />;
}

  return (
   <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home/>} />
      <Route
        path="/signup"
        element={!currentUserData ? <Signup /> : <Navigate to="/" replace />}
      />
      <Route
        path="/login"
        element={ <Login />}
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

         <Route
        element={<OnBoard />}
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

      {/* Dashboard Layout Wrapper */}
      <Route element={<DashboardLayout />}>
        {/* Customer */}
     <Route element={<ProtectedRoute allowedRole="customer"/>}>
           <Route
          path="/customer/home"
          element={<CustomerHome />}
        />
        <Route
          path="/customer/bookings"
          element={
             <CustomerBookings /> 
          }
        />
        <Route
          path="/customer/bookings/:bookingId"
          element={
         <CusBookingDetail /> 
          }
        />
        <Route
          path="/customer/hire-professionals"
          element={
            <HireProfessionals />
          }
        />
       
        <Route
          path="customer/chat/:id"
          element={ <ChatSection />}
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
          element={<Messages />}
        />
         <Route
          path="/customer/notifications"
          element={ <Notification role={role} />}
        />
         <Route
          path="/customer/contact"
          element={ <Contact />}
        />
     </Route>

           <Route
          path="professional/profile/visit/:id/:slug"
          element={
            <ProfessionalInfo />
          }
        />

        {/* Professional */}
          <Route element={isOnboarded && <ProtectedRoute allowedRole="professional"/>}>
               <Route
          path="/professional/home"
          element={
           <ProfessionalHome />
          }
        />
        <Route
          path="/professional/profile"
          element={
            
              <ProfessionalProfile />
         
          }
        />
        <Route
          path="/professional/bookings"
          element={
     
              <ProfessionalBookings />
       
          }
        />
        <Route
          path="/professional/bookings/:bookingId"
          element={
           
              <ProBookingDetails />
          
          }
        />
        <Route
          path="/professional/pickup"
          element={
            <IncomingRequests/>
          }
        />
        <Route
          path="/professional/complete-profile"
          element={
            <CompleteProfile />
          }
        />
        <Route
          path="/professional/messages"
          element={<Messages />}
        />
        <Route
          path="/professional/notifications"
          element={<Notification role={role} />}
        />
        <Route
          path="/professional/chat/:id"
          element={
           <ChatSection />
          }
        />
        <Route
          path="/professional/transaction-history"
          element={
             <ProfessionalTransactions proId={id}/>
          }
        />
         <Route
          path="/professional/contact"
          element={ <Contact />}
        />
          </Route>

        {/* Admin  */}

      </Route>

      <Route element={<DashboardLayout />}>
  <Route element={<AdminProtectedRoute requiredRole="super_admin"/>}>
          <Route path={`${adminpath}/home`} element={currentAdmin ? <AdminHome/> : <Navigate to="/" />}/>
          <Route path={`${adminpath}/signup`} element={  <AdminSignup/>}/>
          
          <Route path={`${adminpath}/manage-services`} element={  <AdminServices/>}/>

          <Route path={`${adminpath}/manage-users`} element={  <AdminUsers/>}/>
          <Route path={`${adminpath}/manage-bookings`} element={  <AdminBookings/>}/>
          <Route path={`${adminpath}/manage-bookings/:bookingId`} element={  <AdminBookingDetail/>}/>
          <Route path={`${adminpath}/manage-forms`} element={  <ManageForms/>}/>
          <Route path={`${adminpath}/manage-offers`} element={  <ManageOffers/>}/>
          <Route path={`${adminpath}/manage-forms/create`} element={  <CreateForm/>}/>
          <Route path={`${adminpath}/manage-announcements`} element={  <ManageAnnouncements/>}/>
          <Route path={`${adminpath}/offer/update-offer/:offerId`} element={  <UpdateOffer/>}/>
          <Route path={`${adminpath}/manage-enquiry`} element={  <ManageEnquiry/>}/>

          </Route>
          </Route>
     
      {/* Admin Pannel starts here */}

       <Route path={`${adminpath}`} element={ !currentUserData && !currentAdmin ? <AdminLanding/> : (currentAdmin ? <Navigate to={`${adminpath}/home`}/> : <Navigate to="/"/>)}/>

        <Route path={`${adminpath}/login`} element={ !currentUserData && !currentAdmin ? <AdminLogin/> : (currentAdmin ? <Navigate to={`${adminpath}/home`}/> : <Navigate to="/"/>)}/>


          <Route path="/s/:shortCode" element={<ShortLinkRedirect />}/>

          {/* footer links */}

          <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/service-delievery" element={<ServiceDelieveryPolicy/>}/>
          <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/services" element={<Services/>}/>
          <Route path="/explore" element={<Explore/>}/>
          <Route path="/professional-policy" element={<ProfessionalOnboardingPolicy/>}/>
          <Route path="/professional-join-process" element={<JoinProcess/>}/>


        
      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
   </>
  );
};

export default App;
