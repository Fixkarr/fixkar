import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import ForgetPass from './Components/ForgetPass'
import OtpVerify from './Components/OtpVerify'
import ResetPassword from './Components/ResetPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import DashboardLayout from './Pages/DashboardLayout'
import CustomerHome from './Customer/CustomerHome'
import CustomerBookings from './Customer/CustomerBookings'
import HireProfessionals from './Customer/HireProfessionals'
import CustomerNotifications from './Customer/CustomerNotifications'
import CustomerContact from './Customer/CustomerContact'
import CustomerProfile from './Customer/CustomerProfile'
import PageNotFound from './Components/PageNotFound'
import OnBoard from './Professional/OnBoard'
import VerifyMobile from './Professional/VerifyMobile'
import Onboarding from './Professional/Onboarding'
import Pending from './Professional/Pending'
import Rejected from './Professional/Rejected'
export const server_url = "http://localhost:3000"


const App = () => {
  
  useGetCurrentUser()
  const {currentUserData} = useSelector(state=> state.user)
  const role =  currentUserData?.user?.userId?.role;

  // console.log(currentUserData);

  return (
  

    <>
      <Routes>
        <Route path='/' element={!currentUserData ? <Home/> : (
          <Navigate to={role === "customer" ? 
            ("/customer/home") : (role === "professional" ? 
              (currentUserData?.user?.onBoarded ? 
                (currentUserData?.user?.status === "pending" ? 
            ("/application/pending"):(currentUserData?.user?.status === "rejected" ? 
              ("/application/rejected"):("/professional/home"))
          ):("/onboard/verify-mobile")): ("/admin"))}/>
          )}/>
        <Route path='/signup' element={currentUserData ? <Navigate to="/"/> : <Signup/>}/>
        <Route path='/login' element={currentUserData ? <Navigate to="/"/> : <Login/>}/>
        <Route path='/forget-password' element={currentUserData ? <Navigate to="/"/> : <ForgetPass/>}/>
        <Route path='/verify-otp' element={currentUserData ? <Navigate to="/"/> : <OtpVerify/>}/>
        <Route path='/reset-password' element={currentUserData ? <Navigate to="/"/> : <ResetPassword/>}/>
        <Route element={<DashboardLayout/>} >

        {/* Customer pannel routes */}
            <Route path='/customer/home' element={role === "customer" ? <CustomerHome/> : <Navigate to="/"/>}/>
            <Route path='/customer/bookings' element={role === "customer" ? <CustomerBookings/> : <Navigate to="/"/>}/>
            <Route path='/customer/hire-professionals' element={role === "customer" ? <HireProfessionals/> : <Navigate to="/"/>}/>
            <Route path='/customer/notifications' element={role === "customer" ? <CustomerNotifications/> : <Navigate to="/"/>}/>
            <Route path='/customer/contact' element={role === "customer" ? <CustomerContact/> : <Navigate to="/"/>}/>
            <Route path='/customer/profile' element={role === "customer" ? <CustomerProfile/> : <Navigate to="/"/>}/>
        {/* Professional pannel routes */}
        </Route>
        <Route element={role === "professional"? <OnBoard/> : <Navigate to="/"/>}>
          <Route path='/onboard/verify-mobile' element={!currentUserData?.user?.userId?.isMobileVerified ? (<VerifyMobile/>):(<Navigate to="/onboard"/>)}/>
          <Route path='/onboard' element={!currentUserData?.user?.userId?.isMobileVerified ? (<Navigate to="/onboard/verify-mobile"/>) : (currentUserData?.user?.onBoarded ? (<Navigate to="/"/>): (<Onboarding userData={currentUserData}/>))}/>
          <Route path="/application/pending" element={<Pending/>}/>
          <Route path="/application/rejected" element={<Rejected/>}/>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </>
  )
}

export default App
