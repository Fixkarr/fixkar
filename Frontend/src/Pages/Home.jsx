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
import FAQSection from '../Components/FAQSection'
import TrustFooterSection from '../Components/TrustFooterSection'
const faqs =  [
  {
    question: "What is Fixkar?",
    answer:
      "FixKar is an online platform that helps customers find and hire verified electricians, plumbers, carpenters, painters, builders, labourers, civil engineers, and other home service professionals near their location."
  },
  {
    question: "How does Fixkar work?",
    answer:
      "Customers can search for nearby professionals, compare their profiles, experience, skills, ratings, and service charges, then send a hiring request directly through FixKar."
  },
  {
    question: "Are professionals on Fixkar verified?",
    answer:
      "Yes. Every professional on Fixkar completes a document verification process before becoming available for customer bookings."
  },
  {
    question: "Which services are available on Fixkar?",
    answer:
      "FixKar offers electricians, plumbers, carpenters, painters, builders, civil engineers, labourers, and other home repair and maintenance services."
  },
  {
    question: "How can I hire a professional on Fixkar?",
    answer:
      "Simply search for a service, choose a verified professional, review their profile, and click the Hire button to submit your booking request."
  },
  {
    question: "How are service charges decided?",
    answer:
      "Service charges are decided by the professional based on their skills, experience, work type, and location. Customers can review the charges before hiring."
  },
  {
    question: "Can I hire professionals near my location?",
    answer:
      "Yes. Fixkar helps customers find verified professionals based on their selected location so they can hire nearby service providers."
  },
  {
    question: "Can I compare professionals before hiring?",
    answer:
      "Yes. Customers can compare professionals based on experience, skills, ratings, reviews, availability, and pricing before making a hiring decision."
  },
  {
    question: "Is Fixkar available across India?",
    answer:
      "FixKar is expanding across India. Service availability depends on the number of verified professionals available in your city or locality."
  },
  {
    question: "How can professionals join Fixkar?",
    answer:
      "Skilled professionals can apply through the professional registration process, complete document verification, and start receiving customer hiring requests after approval."
  }
];


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

   const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
  const banners = [];
  return (
   <>
  <Helmet>
     <title>Fixkar</title>
       <meta
          name="description"
          content="Fixkar Smart Solutions is a smart service platform connecting users with skilled professionals who use modern tools and technology to deliver reliable services across multiple categories in varanasi."
        />

        {faqSchema && (
  <script type="application/ld+json">
    {JSON.stringify(faqSchema)}
  </script>
)}
  </Helmet>

  <Navbar />

  {/* ===== HERO SECTION ===== */}
{/* ===== HERO SECTION ===== */}
<section className="fixkar-home-hero">
  <div
    id="homepageBanner"
    className="carousel slide fixkar-hero-carousel"
    data-bs-ride="carousel"
    data-bs-interval="3000"
    data-bs-pause="false"
  >
    {/* Slides */}
    <div className="carousel-inner fixkar-hero-inner">
      {(banners?.length > 0
        ? banners
        : [
            { image: "/Images/banner3.jpg" },
            { image: "/Images/banner.webp" },
            { image: "/Images/banner2.webp" },
          ]
      ).map((item, index) => (
        <div
          key={index}
          className={`carousel-item ${
            index === 0 ? "active" : ""
          }`}
        >
          <div className="fixkar-hero-image-wrapper">
            <img
              src={item?.image}
              alt="Fixkar home services in varanasi"
              className="fixkar-hero-image"
            />
          </div>
        </div>
      ))}
    </div>

    {/* Previous */}
    <button
      className="carousel-control-prev fixkar-carousel-control"
      type="button"
      data-bs-target="#homepageBanner"
      data-bs-slide="prev"
      aria-label="Previous banner"
    >
      <span className="fixkar-carousel-arrow">
        <span className="carousel-control-prev-icon" />
      </span>
    </button>

    {/* Next */}
    <button
      className="carousel-control-next fixkar-carousel-control"
      type="button"
      data-bs-target="#homepageBanner"
      data-bs-slide="next"
      aria-label="Next banner"
    >
      <span className="fixkar-carousel-arrow">
        <span className="carousel-control-next-icon" />
      </span>
    </button>

    {/* Indicators */}
    <div className="carousel-indicators fixkar-carousel-indicators">
      {(banners?.length > 0
        ? banners
        : [
            { image: "/Images/banner3.jpg" },
            { image: "/Images/banner.webp" },
            { image: "/Images/banner2.webp" },
          ]
      ).map((_, index) => (
        <button
          key={index}
          type="button"
          data-bs-target="#homepageBanner"
          data-bs-slide-to={index}
          className={index === 0 ? "active" : ""}
          aria-current={
            index === 0 ? "true" : undefined
          }
          aria-label={`Go to banner ${index + 1}`}
        />
      ))}
    </div>
  </div>
</section>


  {/* ===== SERVICES ===== */}
 
    <Services />
    <Values />
    <Testimonial />
    <TrustFooterSection/>
    <Contact />
    <FAQSection faqs={faqs}/>
    
  <Footer />
</>

  ) 
}

export default Home
