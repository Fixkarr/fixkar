import React, { useState } from "react";
import {useSelector} from 'react-redux'
import { PiSmileySadLight } from "react-icons/pi";
import { RiImageEditLine } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";


import "../css/profile.css"
import ReadMoreText from "../Components/ReadMoreText";
const ProfessionalProfile = () => {
  const {currentUserData} = useSelector(state => state.user)
  const ProfessionalDetails = currentUserData?.user
   const isProfileComplete = Boolean(ProfessionalDetails?.charges);
  const navigate = useNavigate()

  console.log(ProfessionalDetails)
  if(!ProfessionalDetails){
    return (
      <>
        <div className="d-flex justify-content-center align-items-center flex-column mt-4">
            <span className="text-danger"><PiSmileySadLight size={50}/></span>
            <h2 className="welcome">Oops! Something went wrong!
            </h2>
            <p>Please Try Again Later!</p>
        </div>
      </>
    )
  }
  return (
    <>
      <div className = "profile p-2">
          <div className="profile-upper">
              <div className="profile-upper-left">
                  <div className="profilePicture">
                    <img src={ProfessionalDetails?.profilePicture} alt="" className="img-fluid"/>
                  <span className="bg-primary text-light"> <RiImageEditLine color=""/></span>
                  </div>
              </div>
              <div className="profile-upper-right">
                  <h2 className="welcome m-0">{ProfessionalDetails?.userId?.fullName}</h2>
                  <p className="m-0 badge text-bg-primary ">{ProfessionalDetails?.profession}</p>
                  <hr />
                  <b>Description : </b><ReadMoreText text={ProfessionalDetails?.description}/>
                  <hr />
                 <div>
                  <b className="icon fw-bold"> <CiLocationOn/></b> <ReadMoreText text={ProfessionalDetails?.address?.addressLine}/>
                 </div>
                 <hr />
                 <div>
                  <b className="icon fw-bold"> <MdOutlineMail /> </b> <span>{ProfessionalDetails?.userId?.email}</span>
                 </div>
                  <hr />
                  <div>
                  <b className="icon fw-bold"> <IoCallOutline /> </b> <span>{ProfessionalDetails?.userId?.mobile}</span>
                 </div>
              </div>
          </div>
          <hr/>
          <div className="profile-lower p-2">
                {!isProfileComplete && (
        <div className="alert alert-warning d-flex align-items-center gap-md-3 flex-column flex-md-row p-4 rounded shadow-sm mt-2">
          <div className="flex-grow-1">
            <h5 className="mb-2 fw-bold welcome">Complete Your Profile!</h5>
            <p className="mb-2" style={{ fontSize: "0.8vmax", lineHeight: "1.4" }}>
              Your profile is currently incomplete. Please complete your profile
              so that customers can understand you better, <br /> which will increase
              your chances of getting work.
            </p>

            <ul className="mb-3 ps-3"  style={{ fontSize: "0.8vmax", lineHeight: "1.4" }}>
              {<li>Profile Description missing</li>}
              {<li>Service Charges not set</li>}
              <li>Profile looking incomplete to customers</li>
            </ul>
          </div>

          <button onClick={()=>navigate("/professional/complete-profile")} style={{fontSize : "0.9vmax"}}
            className="btn btn-primary btn-sm px-md-4 py-md-2 m-0 fw-semibold"
          >
            Complete Now
          </button>
        </div>
      )}

        <div className="myGallery mt-2">
          <h2 className="welcome">My Gallery</h2>
        </div>

          </div>
      </div>
    </>
  )
};

export default ProfessionalProfile;
