
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetCurrentUser from './hooks/useGetCurrentUser';

import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ForgetPass from './Components/ForgetPass';
import OtpVerify from './Components/OtpVerify';
import ResetPassword from './Components/ResetPassword';
import PageNotFound from './Components/PageNotFound';

import DashboardLayout from './Pages/DashboardLayout';

// Customer
import CustomerHome from './Customer/CustomerHome';
import CustomerBookings from './Customer/CustomerBookings';
import HireProfessionals from './Customer/HireProfessionals';
import CustomerNotifications from './Customer/CustomerNotifications';
import CustomerContact from './Customer/CustomerContact';
import CustomerProfile from './Customer/CustomerProfile';

// Professional
import OnBoard from './Professional/OnBoard';
import VerifyMobile from './Professional/VerifyMobile';
import Onboarding from './Professional/Onboarding';
import Pending from './Professional/Pending';
import Rejected from './Professional/Rejected';
import ProfessionalHome from './Professional/ProfessionalHome';
import ProfessionalProfile from './Professional/ProfessionalProfile';
import ProfessionalBookings from './Professional/ProfessionalBookings';
import CompleteProfile from './Professional/CompleteProfile';

export const server_url = import.meta.env.VITE_SERVER_URL;

const App = () => {
  useGetCurrentUser();
  const { currentUserData } = useSelector((state) => state.user);

  const role = currentUserData?.user?.userId?.role;
  const isOnboarded = currentUserData?.user?.onBoarded;
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;
  const status = currentUserData?.user?.status;

  // ---------------------------
  // ROOT REDIRECT HANDLER LOGIC
  // ---------------------------
  const redirectUser = () => {
    if (!currentUserData) return <Home />;

    if (role === 'customer') return <Navigate to="/customer/home" replace />;

    if (role === 'professional') {
      if (!isMobileVerified) return <Navigate to="/onboard/verify-mobile" replace />;
      if (!isOnboarded) return <Navigate to="/onboard" replace />;
      if (status === 'pending') return <Navigate to="/application/pending" replace />;
      if (status === 'rejected') return <Navigate to="/application/rejected" replace />;

      return <Navigate to="/professional/home" replace />;
    }

    return <Home />;
  };

  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={redirectUser()} />
      <Route path="/signup" element={!currentUserData ? <Signup /> : <Navigate to="/" replace />} />
      <Route path="/login" element={!currentUserData ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/forget-password" element={!currentUserData ? <ForgetPass /> : <Navigate to="/" replace />} />
      <Route path="/verify-otp" element={!currentUserData ? <OtpVerify /> : <Navigate to="/" replace />} />
      <Route path="/reset-password" element={!currentUserData ? <ResetPassword /> : <Navigate to="/" replace />} />

      {/* Dashboard Layout Wrapper */}
      <Route element={<DashboardLayout />}>

        {/* Customer */}
        <Route path="/customer/home" element={role === 'customer' ? <CustomerHome /> : <Navigate to="/" />} />
        <Route path="/customer/bookings" element={role === 'customer' ? <CustomerBookings /> : <Navigate to="/" />} />
        <Route path="/customer/hire-professionals" element={role === 'customer' ? <HireProfessionals /> : <Navigate to="/" />} />
        <Route path="/customer/notifications" element={role === 'customer' ? <CustomerNotifications /> : <Navigate to="/" />} />
        <Route path="/customer/contact" element={role === 'customer' ? <CustomerContact /> : <Navigate to="/" />} />
        <Route path="/customer/profile" element={role === 'customer' ? <CustomerProfile /> : <Navigate to="/" />} />

        {/* Professional */}
        <Route path="/professional/home" element={role === 'professional' ? <ProfessionalHome /> : <Navigate to="/" />} />
        <Route path="/professional/profile" element={role === 'professional' ? <ProfessionalProfile /> : <Navigate to="/" />} />
        <Route path="/professional/bookings" element={role === 'professional' ? <ProfessionalBookings /> : <Navigate to="/" />} />
        <Route path="/professional/complete-profile" element={role === 'professional' ? <CompleteProfile /> : <Navigate to="/" />} />
      </Route>

      {/* Onboarding */}
      <Route element={role === 'professional' ? <OnBoard /> : <Navigate to="/" />}>
        <Route path="/onboard/verify-mobile" element={!isMobileVerified ? <VerifyMobile /> : <Navigate to="/onboard" />} />
        <Route path="/onboard" element={isMobileVerified && !isOnboarded ? <Onboarding userData={currentUserData} /> : <Navigate to="/" />} />
        <Route path="/application/pending" element={status === 'pending' ? <Pending /> : <Navigate to="/" />} />
        <Route path="/application/rejected" element={status === 'rejected' ? <Rejected /> : <Navigate to="/" />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;



























































// import React, { useEffect, useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.js'

// import {Routes, Route, Navigate} from 'react-router-dom'
// import Home from './Pages/Home'
// import Signup from './Pages/Signup'
// import Login from './Pages/Login'
// import ForgetPass from './Components/ForgetPass'
// import OtpVerify from './Components/OtpVerify'
// import ResetPassword from './Components/ResetPassword'
// import useGetCurrentUser from './hooks/useGetCurrentUser'
// import { useSelector } from 'react-redux'
// import DashboardLayout from './Pages/DashboardLayout'
// import CustomerHome from './Customer/CustomerHome'
// import CustomerBookings from './Customer/CustomerBookings'
// import HireProfessionals from './Customer/HireProfessionals'
// import CustomerNotifications from './Customer/CustomerNotifications'
// import CustomerContact from './Customer/CustomerContact'
// import CustomerProfile from './Customer/CustomerProfile'
// import PageNotFound from './Components/PageNotFound'
// import OnBoard from './Professional/OnBoard'
// import VerifyMobile from './Professional/VerifyMobile'
// import Onboarding from './Professional/Onboarding'
// import Pending from './Professional/Pending'
// import Rejected from './Professional/Rejected'
// import ProfessionalHome from './Professional/ProfessionalHome'
// import ProfessionalProfile from './Professional/ProfessionalProfile'
// import ProfessionalBookings from './Professional/ProfessionalBookings'
// import CompleteProfile from './Professional/CompleteProfile'
// export const server_url = import.meta.env.VITE_SERVER_URL


// const App = () => {
  
//   useGetCurrentUser()
//   const {currentUserData} = useSelector(state=> state.user)
//   const role =  currentUserData?.user?.userId?.role;


//   return (
  

//     <>
//       <Routes>
//         <Route path='/' element={!currentUserData ? <Home/> : (
//           <Navigate to={role === "customer" ? 
//             ("/customer/home") : (role === "professional" ? 
//               (currentUserData?.user?.onBoarded ? 
//                 (currentUserData?.user?.status === "pending" ? 
//             ("/application/pending"):(currentUserData?.user?.status === "rejected" ? 
//               ("/application/rejected"):("/professional/home"))
//           ):("/onboard/verify-mobile")): ("/"))}/>
//           )}/>
//         <Route path='/signup' element={currentUserData ? <Navigate to="/"/> : <Signup/>}/>
//         <Route path='/login' element={currentUserData ? <Navigate to="/"/> : <Login/>}/>
//         <Route path='/forget-password' element={currentUserData ? <Navigate to="/"/> : <ForgetPass/>}/>
//         <Route path='/verify-otp' element={currentUserData ? <Navigate to="/"/> : <OtpVerify/>}/>
//         <Route path='/reset-password' element={currentUserData ? <Navigate to="/"/> : <ResetPassword/>}/>
//         <Route element={<DashboardLayout/>} >
//         {/* Customer pannel routes */}
//             <Route path='/customer/home' element={role === "customer" ? <CustomerHome/> : <Navigate to="/"/>}/>
//             <Route path='/customer/bookings' element={role === "customer" ? <CustomerBookings/> : <Navigate to="/"/>}/>
//             <Route path='/customer/hire-professionals' element={role === "customer" ? <HireProfessionals/> : <Navigate to="/"/>}/>
//             <Route path='/customer/notifications' element={role === "customer" ? <CustomerNotifications/> : <Navigate to="/"/>}/>
//             <Route path='/customer/contact' element={role === "customer" ? <CustomerContact/> : <Navigate to="/"/>}/>
//             <Route path='/customer/profile' element={role === "customer" ? <CustomerProfile/> : <Navigate to="/"/>}/>
//             <Route path='/professional/home' element={role === "professional" ? <ProfessionalHome/> : <Navigate to="/"/>}/>
//             <Route path='/professional/profile' element={role === "professional" ? <ProfessionalProfile/> : <Navigate to="/"/>}/>
//             <Route path='/professional/bookings' element={role === "professional" ? <ProfessionalBookings/> : <Navigate to="/"/>}/>
//             <Route path='/professional/complete-profile' element={role === "professional" ? <CompleteProfile/> : <Navigate to="/"/>}/>
//         {/* Professional pannel routes */}
//         </Route>
//         <Route element={role === "professional"? <OnBoard/> : <Navigate to="/"/>}>
//           <Route path='/onboard/verify-mobile' element={!currentUserData?.user?.userId?.isMobileVerified ? (<VerifyMobile/>):(<Navigate to="/onboard"/>)}/>
//           <Route path='/onboard' element={!currentUserData?.user?.userId?.isMobileVerified ? (<Navigate to="/onboard/verify-mobile"/>) : (currentUserData?.user?.onBoarded ? (<Navigate to="/"/>): (<Onboarding userData={currentUserData}/>))}/>
//           <Route path="/application/pending" element={currentUserData?.user?.status === "pending" ? (<Pending/>) : (<Navigate to="/"/>)}/>
//           <Route path="/application/rejected" element={currentUserData?.user?.status === "rejected" ? (<Rejected/>) : (<Navigate to="/"/>)}/>
//         </Route>
//         <Route path='*' element={<PageNotFound/>}/>
//       </Routes>
//     </>
//   )
// }

// export default App


