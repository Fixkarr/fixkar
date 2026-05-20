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
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {Helmet} from 'react-helmet-async'
const Contact = () => {
  
const location = useLocation();
const { pathname } = location;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone : ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📩 Contact Form Submitted:", formData);
    setFormData({ name: "", email: "", message: "" , phone : ""});
  };

  return (
    <>
       {pathname !== '/' &&
       <>
        <Helmet>
  <title>Contact Fixkar – Support & Help</title>
  <meta
    name="description"
    content="Contact Fixkar for support, service queries, or assistance. Our team is available to help you connect with skilled professionals efficiently."
  />
</Helmet>

      <Navbar/>
      </>
      }
    <div
      className="contact d-flex align-items-center mt-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
      }}
    >
      <div className="container  mt-5">
        {/* HEADER */}
        <div className="text-center text-white mb-5">
          <h2 className="fw-bold">Contact <span className="text-warning">Fixkar</span></h2>
          <p className="opacity-75">
            We’re always ready to help you. Get in touch with us anytime.
          </p>
        </div>

        {/* CONTENT */}
        <div className="row g-4 align-items-stretch justify-content-center">

          {/* LEFT: COMPANY DETAILS */}
          <div className="col-lg-5 col-md-6 py-5">
            <div className="bg-white h-100 p-4 rounded-4 shadow">
              <FaMessage size={36} className="text-primary mb-3" />

              <h5 className="fw-bold mb-3">Fixkar – Service Support</h5>

              <p className="text-muted small">
                Fixkar is a professional service platform connecting customers
                with verified service professionals. Reach out to us for any
                support or queries.
              </p>

              <hr />

              <ul className="list-unstyled small text-muted">
                <li className="mb-2">
                  <FaEnvelope className="me-2 text-primary" />
                  fixkarteam@gmail.com
                </li>
                <li className="mb-2">
                  <FaPhoneAlt className="me-2 text-primary" />
                  +91 9719764282
                </li>
                <li className="mb-2">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  Lohta, Varanasi, Uttar Pradesh, India
                </li>
                <li className="mb-2">
                  <FaClock className="me-2 text-primary" />
                  Working Hours: 9:00 AM – 5:00 PM
                </li>
              </ul>

              <hr />

              <h6 className="fw-semibold mb-2">Follow Us</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-primary fs-5"><FaFacebook /></a>
                <a href="#" className="text-danger fs-5"><FaInstagram /></a>
                <a href="#" className="text-primary fs-5"><FaLinkedin /></a>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="col-lg-6 col-md-6">
            <div className="bg-white h-100 p-4 rounded-4 shadow">
              <h5 className="fw-bold mb-4 text-primary">
                Send us a Message
              </h5>

              <form onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FaUser className="me-2 text-primary" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control rounded-3"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FaEnvelope className="me-2 text-primary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded-3"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FaPhone className="me-2 text-primary" />
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    className="form-control rounded-3"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* MESSAGE */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FaMessage className="me-2 text-primary" />
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="form-control rounded-3"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
                >
                  <FaPaperPlane className="me-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
    {pathname !== '/' && <Footer/>}
    </>
  );
};

export default Contact;
