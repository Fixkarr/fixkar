import React, { useState } from "react";
import {useSelector} from 'react-redux'
import { PiSmileySadLight } from "react-icons/pi";
import { RiImageEditLine } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import "../css/profile.css"
import ReadMoreText from "../Components/ReadMoreText";
import { useEffect } from "react";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import UpdateProfileInfoForm from "./UpdateProfileInfoForm";
import CompleteProfileToast from "./CompleteProfileToast";
import UpdateCharges from "./UpdateCharges";




const ProfessionalProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
   useEffect(() => {
    if (profilePicture) { // Only log if a file is actually selected (not null)
      // You can also add logic here to upload the image to a server
      // 

      const updatePicture = async ()=>{
        try {
          setLoading(true)
          const formData = new FormData();
          formData.append('profilePicture', profilePicture);
        const result = await axios.post(`${server_url}/api/user/update-profile-picture`, formData, {
          withCredentials : true
        })
        dispatch(setCurrentUserData(result?.data));
        setLoading(false)
      } catch (error) {
        toast.error(error.message)
        setLoading(false)
      }
      }
      updatePicture()
    }
  }, [profilePicture]);
  const handlePictureSubmit = (e)=>{
    setProfilePicture(e.target.files[0])
  }



  const {currentUserData} = useSelector(state => state.user)
  const ProfessionalDetails = currentUserData?.user
   const isProfileComplete = Boolean(ProfessionalDetails?.charges);
   const ChargesNotDefined = ProfessionalDetails?.charges?.hourly?.amount == "0" && ProfessionalDetails?.charges?.daily?.amount == "0" && ProfessionalDetails?.charges?.contract?.minAmount == "0"
  const navigate = useNavigate()

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
    <ToastContainer
    position="top-right" autoClose={3000} theme="colored"
    />
      <div className = "profile p-2">
          <div className="profile-upper">
              <div className="profile-upper-left">
                  <div className="profilePicture">
                   <div className="loader">
                     <p>{loading && <ClipLoader size={30} color="blue"/>}</p>
                   </div>
                    <img src={ProfessionalDetails?.profilePicture || "/Images/placeholderProfile.avif"} className="img-fluid"/>
                       <span className="bg-primary text-light cursor-pointer"> <label htmlFor="profilePicture"><RiImageEditLine color=""/></label></span>
                       <input type="file" accept="image/*" id="profilePicture" onChange={(e) =>handlePictureSubmit(e)} />
      
                  </div>
              </div>
              <div className="profile-upper-right">
                 <div >
                <span className="text-primary pen" data-bs-toggle='modal' data-bs-target='#infoModal'> <FaPencil /></span>
                    
                      <div className="modal fade" id="infoModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Profile</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <UpdateProfileInfoForm/>
    </div>
  </div>
</div>

                   <h2 className="welcome m-0">{ProfessionalDetails?.userId?.fullName}</h2>
                  <p className="m-0 badge text-bg-primary ">{ProfessionalDetails?.profession}</p>
                  <hr />
                  {isProfileComplete && <><b>Description : </b><ReadMoreText text={ProfessionalDetails?.description}/><hr /></>}
                  
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
                 <hr/>
                 </div>
                 {isProfileComplete && <div className="charges">
                  <h5 className="mt-3 text-primary welcome">My Charges</h5>
                   <div>
                     <div>
                       <span className="text-primary pen" data-bs-toggle='modal' data-bs-target='#ChargesModal'> <FaPencil /></span>
                    
                      <div className="modal fade" id="ChargesModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Charges</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <UpdateCharges/>
    </div>
  </div>
</div>

                  {
                    ChargesNotDefined && (
                      <p className="text-danger">Charges are not defined, Update the charges!</p>
                    )
                  }
                        {ProfessionalDetails?.charges?.hourly?.amount !== "0" && <p><b>Hourly :</b> <MdOutlineCurrencyRupee />{ProfessionalDetails?.charges?.hourly?.amount}/hr</p>}
                        {ProfessionalDetails?.charges?.daily?.amount  !== "0" && <p><b>Daily :</b>  <MdOutlineCurrencyRupee />{ProfessionalDetails?.charges?.daily?.amount}/day</p>}
                        {ProfessionalDetails?.charges?.contract.minAmount  !== "0" && <p><b>Contract : </b><span><MdOutlineCurrencyRupee />{ProfessionalDetails?.charges?.contract?.minAmount}</span> - <span><MdOutlineCurrencyRupee />{ProfessionalDetails?.charges?.contract?.maxAmount}</span></p>}
                    </div>
                    <div >
                       {ProfessionalDetails?.charges?.amountDesc && <>
                        <b>Charge Description</b>
                        <p className="position-static"><ReadMoreText text={ProfessionalDetails?.charges?.amountDesc}/></p></>}
                    </div>
                   </div>
                 </div>}
              </div>
          </div>
          <hr/>
          <div className="profile-lower p-2">
                {!isProfileComplete && (
                  <CompleteProfileToast/>
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
