import React, { useState } from "react";
import { FaImages, FaCloudUploadAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import UploadMedia from "../Customer/uploadMedia";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const GalleryPlaceholder = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="card border-0 shadow rounded-4 p-4 text-center bg-light">
      
      {/* Icon */}
      <div className="mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10"
          style={{ width: "100px", height: "100px" }}
        >
          <FaImages className="text-primary fs-1" />
        </div>
      </div>

      {/* Heading */}
      <h5 className="fw-bold text-dark mb-1">
        Showcase Your Work
      </h5>

      {/* Description */}
      <p className="text-muted small mb-3">
        Upload photos or videos of your previous work to build customer
        trust and increase booking chances. A strong gallery makes
        your profile stand out.
      </p>

        <UploadMedia/>


      {/* Footer Note */}
      <div className="mt-3">
        <span className="badge bg-secondary bg-opacity-10 text-secondary">
          Supported: JPG · PNG · MP4
        </span>
      </div>
    </div>
  );
};

export default GalleryPlaceholder;
