import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaYoutube,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {Helmet} from 'react-helmet-async'
import axios from "axios"
import { toast } from "react-toastify";
import { server_url } from "../App";
import { useSelector } from "react-redux";
import '../css/contact.css'

const Contact = () => {
  const {currentUserData} = useSelector(state=>state.user);
  const role = currentUserData?.user?.userId?.role
const location = useLocation();
const { pathname } = location;
const [loading, setLoading] = useState(false);
;  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone : ""
  });

let senderRole = "visitor";

if(currentUserData){
   senderRole = role
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.post(`${server_url}/api/user/send-enquiry`, {...formData, senderRole});
      toast.success(res?.data?.message || "message sent!")
    } catch (error) { 
      toast.error(error?.response?.data?.message || "failed to send message!")
    }finally{
        setLoading(false)
    }
    
    

    setFormData({ name: "", email: "", message: "" , phone : ""});
    
  };

  const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FixKar Smart Solutions",
  url: "https://www.fixkarr.com",
  logo: "https://fixkarr.com/Images/logo2.png",
  about : "https://fixkarr.com/about",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    phone : "+91 8795213106",
    email: "info@fixkarr.com",
    location : "varanasi uttarpradesh india",
    facebook : "https://www.facebook.com/profile.php?id=61591695204940",
    instagram : "https://www.instagram.com/fixkar.official",
    linkedin : "https://www.linkedin.com/company/fixkar-smart-solutions-pvt-ltd",
    youtube : "https://www.youtube.com/@fixkarofficial",
    availableLanguage: ["English", "Hindi"]
  }

  
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact FixKar",
  url: "https://www.fixkarr.com/contact",
  description: "Contact FixKar for customer support, booking assistance and professional registration.",

};
  return (
    <>
       {pathname !== '/' &&
       <>
        <Helmet>
  <title>Contact Fixkar – Support & Help</title>
  <meta
    name="description"
    content="Contact FixKar for booking assistance, customer support, professional registration, partnership enquiries and general questions related to home services. Our team helps customers connect with verified professionals across different service categories."
  />
  <script type="application/ld+json">
    {JSON.stringify(contactPageSchema)}
  </script>
  <script type="application/ld+json">
    {JSON.stringify(organizationSchema)}
  </script>
</Helmet>

      {pathname == "/contact" && <Navbar/>} 
      
      {currentUserData && <div
        className="text-white p-4 contact-topbar"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#00c6ff)",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center contact-topbar-inner">
          <h5 className="fw-bold mb-0 contact-topbar-title">Contact & Support</h5>
        </div>

        <p className="mt-2 small opacity-75 contact-topbar-description">
          Feel free to contact us anytime!
        </p>
      </div>}

      </>
      }
    <div
      className="contact contact-page contact-main d-flex align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
      }}
    >
      <div className="container contact-container">
        {/* HEADER */}
        <div className="text-center text-white contact-heading">
          <h1 className="fw-bold">Contact <span className="contact-heading-brand">Fixkar</span></h1>
          <p className="opacity-75">
            We’re always ready to help you. Get in touch with us anytime.
          </p>
        </div>

        {/* CONTENT */}
        <div className="row g-4 align-items-stretch justify-content-center contact-content-row">

          {/* LEFT: COMPANY DETAILS */}
          <div className="col-lg-5 col-md-6 contact-info-col">
            <div className="bg-white h-100 p-4 rounded-4 shadow contact-info-card">
             <div className="contact-info-icon">
              <FaMessage size={36} />
            </div>

              <h2 className="fw-bold contact-info-title">Fixkar – Service Support</h2>

              <p className="contact-info-description">
                Fixkar Smart Solutions is a professional service platform connecting customers
                with verified service professionals in varanasi. Reach out to us for any
                support or queries.
              </p>

              <hr className="contact-divider" />

              <ul className="list-unstyled contact-details">
                <li className="contact-detail-item">
                  <FaEnvelope className="contact-detail-icon" />
                    info@fixkarr.com
                </li>
                <li className="contact-detail-item">
                  <FaPhoneAlt className="contact-detail-icon" />
                  +91 8795213106
                </li>
                <li className="contact-detail-item">
                  <FaMapMarkerAlt className="contact-detail-icon" />
                  Varanasi, Uttar Pradesh, India
                </li>
                <li className="contact-detail-item">
                  <FaClock className="contact-detail-icon" />
                  Working Hours: 9:00 AM – 5:00 PM
                </li>
              </ul>

              <hr className="contact-divider" />

              <h6 className="fw-semibold mb-2 contact-follow-title">Follow Us</h6>
              <div className="contact-socials">
                <a href="https://www.facebook.com/profile.php?id=61591695204940" className="text-primary contact-social-link"><FaFacebook /></a>
                <a href="https://www.instagram.com/fixkar.official" className=" contact-social-instagram contact-social-link"><FaInstagram /></a>
                <a href="https://www.linkedin.com/company/fixkar-smart-solutions-pvt-ltd" className="text-primary contact-social-link"><FaLinkedin /></a>
                <a href="https://www.youtube.com/@fixkarofficial" className="text-primary contact-social-link"><FaYoutube /></a>
              </div>
              <hr className="contact-divider" />
              <h2 className="fw-semibold mb-2 fs-3"> <a href="https://fixkarr.com/about" target="_blank" className="contact-about-link">About Fixkar Smart Solutions</a></h2>

            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="col-lg-6 col-md-6 contact-form-col">
            <div className="bg-white h-100 p-4 rounded-4 shadow contact-form-card">
              <h5 className="fw-bold mb-4 text-primary contact-form-title">
                Send us a Message
              </h5>

              <form onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="contact-form-group">
                  <label className="form-label fw-semibold contact-form-label">
                    <FaUser className="me-2 text-primary" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control rounded-3 contact-form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="contact-form-group">
                  <label className="form-label fw-semibold contact-form-label">
                    <FaEnvelope className="me-2 text-primary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded-3 contact-form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label className="form-label fw-semibold contact-form-label">
                    <FaPhone className="me-2 text-primary" />
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    className="form-control rounded-3 contact-form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* MESSAGE */}
                <div className="mb-4 contact-form-group">
                  <label className="form-label fw-semibold contact-form-label">
                    <FaMessage className="me-2 text-primary" />
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="form-control rounded-3 contact-form-control"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold contact-submit"
                  disabled={loading}
                >
                  <FaPaperPlane className="me-2" />
                  {loading ?  "Sending message!" : "Send Message"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>

    {pathname == '/contact' && <Footer/>}

    </>
  );
};

export default Contact;
