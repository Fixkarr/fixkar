import React, { useState } from "react";
import "../css/contact.css";
import { FaUser, FaEnvelope, FaPaperPlane } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ ENSURE DATA SHOWS IN CONSOLE
    console.log("📩 Contact Form Submitted:", formData);

    // optional reset
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className="contact py-5"
      style={{
        background: "linear-gradient(180deg, #f8f9ff 0%, #eef3ff 100%)",
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="text-center mb-5">
        <span
          className="badge rounded-pill px-4 py-2 mb-3"
          style={{
            background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
            color: "#fff",
          }}
        >
          📞 Contact Us
        </span>

        <h3 className="fw-bold display-6">
          Get in <span className="text-primary">Touch</span>
        </h3>

        <p className="text-muted mt-2">
          Feel free to contact us — we’d love to hear from you
        </p>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="container">
        <div className="row g-4 align-items-center justify-content-center">

          {/* LEFT INFO */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="p-4 rounded-4 shadow-sm bg-white">
              <FaMessage size={40} className="text-primary mb-3" />
              <h5 className="fw-bold">Let’s Talk</h5>
              <p className="text-muted small">
                Have a question, feedback, or suggestion?  
                Drop us a message and our team will get back to you shortly.
              </p>

              <ul className="list-unstyled small text-muted mt-4">
                <li>✔ Quick response</li>
                <li>✔ Friendly support</li>
                <li>✔ Trusted Fixkar team</li>
              </ul>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="col-lg-6 col-md-10">
            <div className="card border-0 shadow rounded-4">
              <div className="card-body p-4">

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
    </div>
  );
};

export default Contact;
