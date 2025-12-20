import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {server_url} from '../App'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CiLocationOn } from "react-icons/ci";
import '../css/professionalInfo.css'
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import RequestHireForm from './RequestHireForm'
import { useDispatch } from 'react-redux'
import { setSelectedProfessional } from '../redux/professionalInfo.slice'
import { toast } from 'react-toastify'


const ProfessionalInfo = () => {
    const [loading, setLoading] = useState(false)
    const [professionalInfo, setProfessionalInfo] = useState(null)
    const isProfessionalInfo = Boolean(professionalInfo);
    const ChargesNotDefined =
  !professionalInfo?.charges ||
  (
    !professionalInfo?.charges?.hourly?.amount &&
    !professionalInfo?.charges?.daily?.amount &&
    !professionalInfo?.charges?.contract?.minAmount &&
    !professionalInfo?.charges?.contract?.maxAmount &&
    !professionalInfo?.charges?.amountDesc
  );

  const dispatch = useDispatch()
    
    
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
      const fetchProfessionalInfo = async ()=>{
        try {
          setLoading(true)
          const result = await axios.get(`${server_url}/api/customer/get-professional-info/${id}`, {withCredentials : true})
          setProfessionalInfo(result?.data?.professionalInfo)
          dispatch(setSelectedProfessional(result?.data?.professionalInfo))
          setLoading(false) 
        } catch (error) {
          toast.error(error.message)
          setLoading(false)
        }
      }
      fetchProfessionalInfo();
    },[])

  return (
    <>
     <div>{loading ? <center className='mt-5'><ClipLoader size={50} color='#0d6efd' className='text-primary'/> </center>: (
      <>
        {!isProfessionalInfo &&  <div className="d-flex justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body text-center p-4">
          
          {/* Title */}
          <h5 className="fw-bold text-danger mb-2">
            Oops! Something went wrong
          </h5>

          {/* Description */}
          <p className="text-muted mb-3">
            We couldn’t complete your request.  
            Please try the following steps:
          </p>

          {/* Instructions */}
          <ul className="text-start small text-muted mb-4">
            <li>Check your internet connection</li>
            <li>Refresh the page and try again</li>
            <li>Come back later if the issue persists</li>
          </ul>

          {/* Actions */}
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-primary btn-sm px-3"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>

            <button
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>

        </div>
      </div>
    </div>}


          <div className="container my-4 professionalInfo">
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          {/* Profile Header */}
          <div className="row">
            <div className="col-8 col-md-6">
              <div className="row m-0">
                <div className="col-6 img-container">
              <img
                src={professionalInfo?.profilePicture}
                alt="Profile"
                className="img-fluid rounded-circle border"
              />
              </div>

            <div className="col-6">
              <h5 className="fw-bold mb-1">{professionalInfo?.userId?.fullName}</h5>
              <p className="text-muted mb-1">{professionalInfo?.profession}</p>
              <span className="badge bg-success">
                {professionalInfo?.status?.[0]?.toUpperCase()+professionalInfo?.status?.slice(1)}
              </span>
            </div>
              </div>
            </div>

            <div className="col-4 col-md-6">
              <div className="d-flex justify-content-start gap-3 align-items-start action">
                <span className="btn btn-outline-primary btn-sm chat" onClick={()=>navigate(`/customer/chat/${id}`)}>
                  <IoChatbubbleEllipsesOutline /> Chat
                </span>
                <span className="btn btn-outline-primary btn-sm call">
                  <IoCallOutline /> Call
                </span>
                <span className="btn btn-primary btn-sm call" data-bs-toggle="modal" data-bs-target="#hireFormModal">
                  Hire
                </span>
                <div className="modal fade" id="hireFormModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Request Hiring</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <RequestHireForm proInfo={professionalInfo}/>
      </div>
    </div>
  </div>
</div>
              </div>
            </div>
          </div>

          <hr />

          {/* About */}
          {professionalInfo?.description && <div className="mb-3">
            <h6 className="fw-semibold">About</h6>
            <p className="text-muted mb-0">
              {professionalInfo?.description}
            </p>
          </div>}

          {/* Address */}
         { professionalInfo?.address?.addressLine && <div className="mb-3">
            <h6 className="fw-semibold">Address</h6>
            <p className="text-muted mb-0">
             <CiLocationOn /> {professionalInfo?.address?.addressLine}
            </p>
          </div>}

          <hr />

          {/* Charges */}
          <h6 className="fw-semibold mb-2">Charges</h6>
          {!ChargesNotDefined ? <div className="mb-3">
            

            <div className="d-flex justify-content-between gap-3 flex-wrap">
              <div style={{minWidth : "200px"}}>
                {professionalInfo?.charges?.hourly?.amount && <div className="border rounded p-2 text-center">
                  <small className="text-muted">Hourly</small>
                  <div className="fw-bold">₹ {professionalInfo?.charges?.hourly?.amount}</div>
                </div>}
              </div>

              <div style={{minWidth : "200px"}}>
                 {professionalInfo?.charges?.daily?.amount && <div className="border rounded p-2 text-center">
                  <small className="text-muted">Daily</small>
                  <div className="fw-bold">₹ {professionalInfo?.charges?.daily?.amount}</div>
                </div>}
              </div>

             <div style={{minWidth : "200px"}}>
               {(professionalInfo?.charges?.contract?.minAmount || professionalInfo?.charges?.contract?.maxAmount) && <div className="border rounded p-2 text-center">
                  <small className="text-muted">Contract</small>
                  <div className="fw-bold">
                    ₹ {professionalInfo?.charges?.contract?.minAmount} – ₹{" "}
                    {professionalInfo?.charges?.contract?.maxAmount}
                  </div>
                </div>}
              </div>
            </div>
            {professionalInfo?.charges?.amountDesc && <div className='border mt-2 rounded p-2'>
                <p>{professionalInfo?.charges?.amountDesc}</p>
            </div>}
          </div> : (
            <div className="border rounded p-2 text-center w-full">
              <p>The professional has not defined their charges yet. You can contact the professional to know the charges.</p>
            </div>
          )}

          <hr />

          {/* Ratings */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="fw-semibold mb-0">Ratings</h6>
              <small className="text-muted">
                {professionalInfo?.ratings} ⭐ ({professionalInfo?.reviews?.length} reviews);
              </small>
            </div>

            <button className="btn btn-outline-primary btn-sm">
              View Reviews
            </button>
          </div>

        </div>
      </div>
    </div>




      
      </>
     )}</div>
    </>
  )
}

export default ProfessionalInfo
