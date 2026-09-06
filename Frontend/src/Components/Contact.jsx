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
        className="contact-topbar"
      >
        <div className="contact-topbar-inner">
          <h5 className="contact-topbar-title">Contact & Support</h5>
        </div>

        <p className="contact-topbar-description">
          Feel free to contact us anytime!
        </p>
      </div>}

      </>
      }
    <div
      className="contact contact-page contact-main"
    >
      <div className="container contact-container">
        {/* HEADER */}
        <div className="contact-heading">
          <h1 className="fw-bold">Contact <span className="contact-heading-brand">Fixkar</span></h1>
          <p className="opacity-75">
            We’re always ready to help you. Get in touch with us anytime.
          </p>
        </div>

        {/* CONTENT */}
        <div className="contact-content-row">

          {/* LEFT: COMPANY DETAILS */}
          <div className="contact-info-col">
            <div className="contact-info-card">
             <div className="contact-info-icon">
              <FaMessage size={36} />
            </div>

              <h2 className="contact-info-title">Fixkar – Service Support</h2>

              <p className="contact-info-description">
                Fixkar Smart Solutions is a professional service platform connecting customers
                with verified service professionals in varanasi. Reach out to us for any
                support or queries.
              </p>

              <hr className="contact-divider" />

              <ul className="contact-details">
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

              <h6 className="contact-follow-title">Follow Us</h6>
              <div className="contact-socials">
                <a href="https://www.facebook.com/profile.php?id=61591695204940" className="contact-social-link"><FaFacebook /></a>
                <a href="https://www.instagram.com/fixkar.official" className="contact-social-instagram contact-social-link"><FaInstagram /></a>
                <a href="https://www.linkedin.com/company/fixkar-smart-solutions-pvt-ltd" className="contact-social-link"><FaLinkedin /></a>
                <a href="https://www.youtube.com/@fixkarofficial" className="contact-social-link"><FaYoutube /></a>
              </div>
              <hr className="contact-divider" />
              <h2 className="fw-semibold mb-2 fs-3"> <a href="https://fixkarr.com/about" target="_blank" className="contact-about-link">About Fixkar Smart Solutions</a></h2>

            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h5 className="contact-form-title">
                Send us a Message
              </h5>

              <form onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    <FaUser size={20}/>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="contact-form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    <FaEnvelope size={20}/>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="contact-form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    <FaPhone size={20}/>
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    className=" contact-form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* MESSAGE */}
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    <FaMessage size={20} />
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="contact-form-control"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="contact-submit"
                  disabled={loading}
                >
                  <FaPaperPlane size={20}/>
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
