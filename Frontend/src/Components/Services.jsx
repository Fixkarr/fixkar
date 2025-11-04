import React, { useState } from 'react'
import '../css/services.css'
import { FaWpforms } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa6";
import { MdOutlineContactEmergency } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
const Services = () => {

 const services = [
    {
      title : "Blacksmith",
      image : "/Images/blacksmithProfile.jpg",
      description : "A person who shapes and forges metal objects by heating and hammering.",
    },
    {
      title : "Electrician",
      image : "Images/electricianProfile.jpg",
      description : "A specialist who installs, maintains, and repairs electrical wiring and systems.",
    },
    {
      title : "Carpenter",
      image : "Images/carpenterProfile.jpg",
      description : "A skilled worker who builds and repairs wooden structures and furniture.",
    },
    {
      title : "Painter",
      image : "Images/painterProfile.jpg",
      description : "A person who applies paint to walls, buildings, or objects for decoration and protection.",
    },
    {
      title : "Plumbur",
      image : "Images/plumberProfile.jpg",
      description : "A tradesperson who installs and repairs water pipes, drainage systems, and fittings.",
    },
    {
      title : "Engineer",
      image : "Images/engineerProfile.jpg",
      description : "Professionals who design, plan, and oversee the construction of infrastructure like roads, bridges, and buildings.",
    },
    {
      title : "Workers",
      image : "Images/workerProfile.jpg",
      description : "General laborers who assist in construction or other physical tasks.",
    },
  ]

  return (
    <>

       <div className="Services">
          <h3 className="fs-3 text-center mx-auto my-3">Our Services</h3>
    <p className='p-title text-center my-3'>Hire Professionals</p>

          <p className="text-center mx-auto my-3">We Provide the best professionals for your house at one place. Make Your Dream House Comfortable.</p>
         <center>
           <div className="cards container">
            {services.map((item,idx)=>{
              return <div className='cardS' key={idx}>
                <div className="image">
                  <img src={item.image} alt={item.title}/>
                </div>
                <div className="title">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <button>↗</button>
                </div>
              </div>
            })}
          </div>
         </center> <br /> <br />
           <p className='p-title text-center'>Join Our Familly</p>
         <p className="text-center mx-auto my-3">Are you the working Professional? We have the opportunity for you. <br /> You can join our familly by these simple steps.</p>
        <div className="hiring container mt-5">
  <div className="box light-blue">
   <span> <FaWpforms /></span>
    <h2 className="text-danger">Sign up as Professional</h2>
    <p>If you want to join us as a professional, the first step is sign up to our platform and verify yourself with your details.</p>
  </div>
  <div className="box light-green">
    <span><MdOutlineContactEmergency /></span>
    <h2 className="text-danger">We will contact you</h2>
    <p>Once you onboarded, our team will contact you to verify your qualifications, experience, and other required details.</p>
  </div>
  <div className="box light-yellow">
    <span> <FaBusinessTime /></span>
    <h2 className="text-danger">Wait for our Approval</h2>
    <p>After verification, our team will review and approve your application. Please wait until you receive confirmation.</p>
  </div>
  <div className="box light-purple">
    <span><FaHandshake /></span>
    <h2 className="text-danger">You will be Hired</h2>
    <p>Once approved, you will officially become a part of our platform and can start providing your services to our customers.</p>
  </div>
</div>

      </div>
    </>
  )
}

export default Services
