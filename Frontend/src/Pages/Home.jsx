import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Services from '../Components/Services'
import Values from '../Components/Values'
import Testimonial from '../Components/Testimonial'
import Contact from '../Components/Contact'
import Footer from '../Components/Footer'
import { FaTools, FaMapMarkerAlt, FaBolt } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import {Helmet} from 'react-helmet-async'
import { useSelector } from 'react-redux'

const Home = () => {
  const { currentUserData } = useSelector((state) => state.user);
  const { currentAdmin } = useSelector((state) => state.admin);
  const adminpath = import.meta.env.VITE_ADMIN_PATH
  const role = currentUserData?.user?.userId?.role;
  const isOnboarded = currentUserData?.user?.onBoarded;
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;
  const status = currentUserData?.user?.status;


  const navigate = useNavigate()

    useEffect(() => {
    if (!currentUserData && !currentAdmin) return;

     if(currentAdmin){
      navigate(adminpath)
     }

    if (role === "customer") {
      navigate("/customer/home", { replace: true });
      return;
    }

    if (role === "professional") {
      if (!isMobileVerified) {
        navigate("/onboard/verify-mobile", { replace: true });
        return;
      }

      if (!isOnboarded) {
        navigate("/onboard", { replace: true });
        return;
      }

      if (status === "pending") {
        navigate("/application/pending", { replace: true });
        return;
      }

      navigate("/professional/home", { replace: true });
    }
  }, [
    currentUserData,
    currentAdmin,
    role,
    isOnboarded,
    isMobileVerified,
    status,
    navigate,
  ]);

  const banners = [];
  return (
   <>
  <Helmet>
     <title>Fixkar – Smart Service Platform</title>
       <meta
          name="description"
          content="Fixkar is a smart service platform connecting users with skilled professionals who use modern tools and technology to deliver reliable services across multiple categories."
        />
  </Helmet>

  <Navbar />

  {/* ===== HERO SECTION ===== */}
<section className="mb-4 mt-4">
  <div
    id="homepageBanner"
    className="carousel slide"
    data-bs-ride="carousel"
    data-bs-interval="3000"
  >
    <div className="carousel-inner rounded-4 overflow-hidden shadow-sm">

      {(banners?.length > 0
        ? banners
        : [{ image: "/Images/banner.webp" },{ image: "/Images/banner2.webp" }]
      ).map((item, index) => (
        <div
          key={index}
          className={`carousel-item ${index === 0 ? "active" : ""}`}
        >
          <img
            src={item?.image}
            alt={`banner-${index}`}
            className="w-100 d-block img-fluid"
            style={{
              height: "auto",
            }}
          />
        </div>
      ))}
    </div>

    {/* Controls */}
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#homepageBanner"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" />
    </button>

    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#homepageBanner"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" />
    </button>

    {/* Indicators */}
    <div className="carousel-indicators mb-2">
      {(banners?.length > 0 ? banners : [1]).map((_, index) => (
        <button
          key={index}
          type="button"
          data-bs-target="#homepageBanner"
          data-bs-slide-to={index}
          className={index === 0 ? "active" : ""}
        />
      ))}
    </div>
  </div>
</section>


  {/* ===== SERVICES ===== */}
 
    <Services />
    <Values />
    <Testimonial />
    <Contact />
  <Footer />
</>

  ) 
}

export default Home
