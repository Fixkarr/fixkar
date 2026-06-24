import React from 'react'
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
      background: "#081028",
      color: "#fff",
    }}
  >
    <div className="container">
      <div className="row g-4">

        {/* BRAND */}
        <div className="col-md-3">
           <img src="/Images/logo1.png" className="img-fluid" alt="fixkar smart solutions private limited" style={{
      height : "30px", width : "108px",
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
             <li><MdKeyboardArrowRight /> <Link to="/about" className='text-light' >About Us</Link></li>
             <li><MdKeyboardArrowRight /> <Link to="/login" className='text-light' >Login</Link></li>
             <li><MdKeyboardArrowRight /> <Link to="/signup?role=customer" className='text-light' >Register as Coustomer</Link></li>
             <li><MdKeyboardArrowRight /> <Link to="/signup?role=professional" className='text-light' >Register as Worker/Professional</Link></li>
            <li><MdKeyboardArrowRight /> <Link to="/contact" className='text-light' >Contact Us</Link></li>
            <li><MdKeyboardArrowRight /><Link to="/services" className='text-light' >Our Services</Link></li>
          </ul>
        </div>

        {/* HELPFUL LINKS */}
        <div className="col-6 col-md-3">
          <h6 className="fw-semibold mb-4">Policy Pages</h6>
          <ul className="list-unstyled small">
             <li><MdKeyboardArrowRight /> <Link to="/privacy-policy" className='text-light' >Privacy Policy</Link></li>
           
            <li><MdKeyboardArrowRight /> <Link to="/terms-and-conditions" className='text-light' >Terms & Condition</Link></li>
             <li><MdKeyboardArrowRight /> <Link to="/cancellation-refund-policy" className='text-light' >Cancellation & Refund Policy</Link></li>
            <li><MdKeyboardArrowRight /> <Link to="/service-delievery" className='text-light' >Service Delievery Policy</Link></li>
            <li><MdKeyboardArrowRight /> <Link to="/professional-policy" className='text-light' >Professional Onboarding Policy</Link></li>
          </ul>
        </div>


        {/* SOCIAL */}
        <div className="col-6 col-md-3">
          <h6 className="fw-semibold mb-3">Connect With Us</h6>
          <ul className="list-unstyled small">
            <li><MdKeyboardArrowRight /> <FaInstagram className="me-1 text-warning" /> Instagram</li>
            <li><MdKeyboardArrowRight /> <FaFacebookSquare className="me-1 text-info" /> Facebook</li>
            <li><MdKeyboardArrowRight /> <FaLinkedin className="me-1 text-primary" /> LinkedIn</li>
            <li><MdKeyboardArrowRight /> <MdOutlineMail className="me-1" /> info@fixkarr.com</li>
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
