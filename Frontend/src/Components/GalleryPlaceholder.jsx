import React, { useState } from "react";
import { FaImages, FaCloudUploadAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { uploadMedia } from "../Customer/uploadMedia";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const GalleryPlaceholder = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
   const handleMedia = async (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      setLoading(true);
      const data = await uploadMedia(selectedFile);
      dispatch(setCurrentUserData(data))
      setLoading(false);
    };

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

      {/* Upload Button */}
      <label
        htmlFor="media"
        className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2"
      >
        {loading ? (
          <>
            <ClipLoader size={18} color="#fff" />
            Uploading...
          </>
        ) : (
          <>
            <FaCloudUploadAlt />
            Upload Media
          </>
        )}

        <input
          type="file"
          id="media"
          hidden
          disabled={loading}
          accept="image/*,video/*"
          onChange={handleMedia}
        />
      </label>

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
