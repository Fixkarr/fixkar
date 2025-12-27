import React, { useState } from 'react'
import { FaImages } from 'react-icons/fa'
import { uploadMedia } from '../Customer/uploadMedia';
import { ClipLoader } from 'react-spinners';

const GalleryPlaceholder = () => {
  const [loading, setLoading] = useState(false);
 const handleMedia = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setLoading(true)
    await uploadMedia(selectedFile);
    setLoading(false);
  };
  
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
  <div className="mb-3">
    {/* Image / Gallery Icon */}
    <div
      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10"
      style={{ width: "90px", height: "90px" }}
    >
      <FaImages className='text-primary fs-1'/>
      
    </div>
  </div>

  <h5 className="fw-semibold text-dark mb-2">
    No Media Uploaded Yet
  </h5>

  <p className="text-muted mb-3">
    Upload pictures and videos to showcase your work and experience
    to customers. A strong gallery helps you build trust and get
    more bookings.
  </p>

  <label htmlFor="media" className="btn btn-primary rounded-pill px-4">
    <i className="bi bi-cloud-upload me-2"></i>
    <input disabled={loading} type='file' accept='image/*, video/*' id='media' hidden onChange={(e)=>handleMedia(e)}/>
    {loading && <ClipLoader size={20}/>} Upload Photos / Videos
  </label>

  <div className="mt-3">
    <small className="text-muted">
      Supported formats: JPG, PNG, MP4
    </small>
  </div>
</div>

  )
}

export default GalleryPlaceholder
