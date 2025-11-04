import React from 'react'
import '../css/footer.css'
import { FaInstagram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
const Footer = () => {
  return (
    <>
      <div className="footer px-5 py-3">
        <div>
          <ul>
          <li>
            <img src="Images/final logo.png" alt="logo" />
          </li>
          <li>
            <p>Tum Apna Dream house socho <br /> pura hum karenge! ❤️</p>
          </li>
        </ul>
        </div>
        <div>
          <ul>
            <h2>Important Links</h2>
            <li><MdKeyboardArrowRight /> Home</li>
            <li><MdKeyboardArrowRight /> About</li>
            <li><MdKeyboardArrowRight /> Login</li>
            <li><MdKeyboardArrowRight /> Register</li>
            <li><MdKeyboardArrowRight /> Contact</li>
            <li><MdKeyboardArrowRight /> Our Professionals</li>
          </ul>
        </div>
        <div>
          <ul>
            <h2>Helpful Links</h2>
            <li><MdKeyboardArrowRight /> Help</li>
            <li><MdKeyboardArrowRight /> Privacy Policy</li>
            <li><MdKeyboardArrowRight /> Refund Policy</li>
            <li><MdKeyboardArrowRight /> Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <ul>
            <h2>Our Services</h2>
            <li><MdKeyboardArrowRight /> Electritians</li>
            <li><MdKeyboardArrowRight /> Plumbers</li>
            <li><MdKeyboardArrowRight /> Workers</li>
            <li><MdKeyboardArrowRight /> Builders</li>
            <li><MdKeyboardArrowRight /> Carpenters</li>
            <li><MdKeyboardArrowRight /> Blacksmith</li>
            <li><MdKeyboardArrowRight /> Civil Engineers</li>
          </ul>
        </div>
          <div>
            <ul>
              <h2>Our Social Links</h2>
              <li><MdKeyboardArrowRight /> <FaInstagram /> Instagram</li>
              <li><MdKeyboardArrowRight /> <FaFacebookSquare /> Facebook</li>
              <li><MdKeyboardArrowRight /> <FaLinkedin />  Linked in</li>
              <li><MdKeyboardArrowRight /> <FaSquareXTwitter /> X (twitter)</li>
              <li><MdKeyboardArrowRight /> <MdOutlineMail /> himanshu@gmail.com</li>
            </ul>
          </div>
      </div>
      <div className="mx-auto container-fluid bg-secondary text-center text-light">copyright &copy; 2025 | All Rights Reserved | FixKar | Made with ❤️ Alpha tech</div>
    </>
  )
}

export default Footer
