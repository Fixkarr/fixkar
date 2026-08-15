import React, { useState } from "react";
import { FaImages, FaCloudUploadAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import UploadMedia from "../Customer/UploadMedia";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const GalleryPlaceholder = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-body p-3 p-md-4">
        {/* ================= HEADER ================= */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "44px",
              height: "44px",
            }}
          >
            <FaImages size={20} />
          </div>

          <div className="flex-grow-1">
            <h6 className="fw-bold text-dark mb-1">
              Showcase Your Work
            </h6>

            <p className="text-muted small mb-0">
              Add photos or videos to make your profile more trustworthy.
            </p>
          </div>
        </div>

        {/* ================= UPLOAD ================= */}
        <UploadMedia />

        {/* ================= FOOTER ================= */}
        <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
          <FaCloudUploadAlt
            className="text-muted"
            size={14}
          />

          <small className="text-muted">
            JPG · PNG · MP4 supported
          </small>
        </div>
      </div>
    </div>
  );
};

export default GalleryPlaceholder;