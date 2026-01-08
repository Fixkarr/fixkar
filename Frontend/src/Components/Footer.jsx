import React from 'react'
import '../css/footer.css'
import { FaInstagram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
   <>
  {/* ===== FOOTER ===== */}
  <footer
    className="pt-5 pb-3"
    style={{
      background: "linear-gradient(135deg, #0d6efd, #1e3c72)",
      color: "#fff",
    }}
  >
    <div className="container">
      <div className="row g-4">

        {/* BRAND */}
        <div className="col-md-2">
           <img src="/Images/logo1.png" className="img-fluid" alt="fixkar logo" style={{
      height : "40px", width : "138px",
      // filter: "invert(-60%)" 
    }}/>
          <p className="small opacity-75">
            Tum apna dream house socho,<br />
            pura hum karenge! ❤️
          </p>
        </div>

        {/* IMPORTANT LINKS */}
        <div className="col-6 col-md-3">
          <h6 className="fw-semibold mb-3">Important Links</h6>
          <ul className="list-unstyled small">
            <li><MdKeyboardArrowRight /> Home</li>
            <li><MdKeyboardArrowRight /> About</li>
            <li><MdKeyboardArrowRight /> Login</li>
            <li><MdKeyboardArrowRight /> Register</li>
            <li><MdKeyboardArrowRight /> Contact</li>
            <li><MdKeyboardArrowRight /> Our Professionals</li>
          </ul>
        </div>

        {/* HELPFUL LINKS */}
        <div className="col-6 col-md-3">
          <h6 className="fw-semibold mb-4">Helpful Links</h6>
          <ul className="list-unstyled small">
            <li><MdKeyboardArrowRight /> Help</li> 
             <li><MdKeyboardArrowRight /> <Link to="/privacy-policy" className='text-light' >Privacy Policy</Link></li>
           
            <li><MdKeyboardArrowRight /> <Link to="/terms&conditions" className='text-light' >Terms & Condition</Link></li>
             <li><MdKeyboardArrowRight /> <Link to="/cancellation-refund-policy" className='text-light' >Cancellation & Refund Policy</Link></li>
            <li><MdKeyboardArrowRight /> <Link to="/service-delievery" className='text-light' >Service Delievery Policy</Link></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className="col-6 col-md-2">
          <h6 className="fw-semibold mb-3">Our Services</h6>
          <ul className="list-unstyled small">
            <li><MdKeyboardArrowRight /> Electricians</li>
            <li><MdKeyboardArrowRight /> Plumbers</li>
            <li><MdKeyboardArrowRight /> Workers</li>
            <li><MdKeyboardArrowRight /> Builders</li>
            <li><MdKeyboardArrowRight /> Carpenters</li>
            <li><MdKeyboardArrowRight /> Blacksmith</li>
            <li><MdKeyboardArrowRight /> Civil Engineers</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="col-6 col-md-2">
          <h6 className="fw-semibold mb-3">Connect With Us</h6>
          <ul className="list-unstyled small">
            <li><MdKeyboardArrowRight /> <FaInstagram className="me-1 text-warning" /> Instagram</li>
            <li><MdKeyboardArrowRight /> <FaFacebookSquare className="me-1 text-info" /> Facebook</li>
            <li><MdKeyboardArrowRight /> <FaLinkedin className="me-1 text-primary" /> LinkedIn</li>
            <li><MdKeyboardArrowRight /> <FaSquareXTwitter className="me-1" /> X (Twitter)</li>
            <li><MdKeyboardArrowRight /> <MdOutlineMail className="me-1" /> himanshu@gmail.com</li>
          </ul>
        </div>

      </div>
    </div>

    {/* ===== COPYRIGHT ===== */}
    <div className="text-center mt-4 pt-3 border-top border-light border-opacity-25 small">
     © {new Date(Date.now()).getFullYear()} <strong>Fixkar</strong>. All Rights Reserved |
      Made with ❤️ by <strong>Alpha Tech</strong>
    </div>
  </footer>
</>

  )
}

export default Footer
