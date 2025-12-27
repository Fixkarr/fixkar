import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { IoCloudUploadOutline, IoArrowBack } from "react-icons/io5";
import { FaImages, FaTrashAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

import GalleryPlaceholder from "../Components/GalleryPlaceholder";
import { uploadMedia } from "../Customer/uploadMedia";
import { setCurrentUserData } from "../redux/user.slice";

const MyGallery = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES (UI ONLY)
  const [selectedMedia, setSelectedMedia] = useState(null);

  const { currentUserData } = useSelector((state) => state.user);
  const media = currentUserData?.user?.gallery;

  const handleMedia = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setLoading(true);
    const data = await uploadMedia(selectedFile);
    dispatch(setCurrentUserData(data));
    setLoading(false);
  };

  return media?.length !== 0 ? (
    <div className="container my-4">

      {/* ===== Header ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <FaImages className="text-primary fs-4" />
            <div>
              <h5 className="mb-0 fw-semibold">My Gallery</h5>
              <small className="text-muted">
                Tap on any media to preview
              </small>
            </div>
          </div>

          <label
            htmlFor="media"
            className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <ClipLoader size={16} color="#fff" />
                Uploading...
              </>
            ) : (
              <>
                <IoCloudUploadOutline size={18} />
                Upload Media
              </>
            )}

            <input
              type="file"
              hidden
              id="media"
              disabled={loading}
              accept="image/*, video/*"
              onChange={handleMedia}
            />
          </label>
        </div>
      </div>

      {/* ===== Gallery Grid ===== */}
      <div className="row g-3">
        {media?.map((item, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="ratio ratio-1x1">
                {item.mediaType === "image" ? (
                  <img
                    src={item.mediaUrl}
                    alt="gallery"
                    className="img-fluid object-fit-cover w-100 h-100"
                    role="button"
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    className="w-100 h-100 object-fit-cover"
                    role="button"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Preview Modal ===== */}
      {selectedMedia && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 bg-dark rounded-4">

              {/* Header */}
              <div className="modal-header border-0">
                <button
                  className="btn btn-light rounded-pill d-flex align-items-center gap-2"
                  onClick={() => setSelectedMedia(null)}
                >
                  <IoArrowBack />
                  Back
                </button>

                <button className="btn btn-danger rounded-pill d-flex align-items-center gap-2">
                  <FaTrashAlt />
                  Delete
                </button>
              </div>

              {/* Body */}
              <div className="modal-body text-center p-0">
                {selectedMedia.mediaType === "image" ? (
                  <img
                    src={selectedMedia.mediaUrl}
                    alt="preview"
                    className="img-fluid rounded-bottom-4"
                    style={{ maxHeight: "80vh" }}
                  />
                ) : (
                  <video
                    src={selectedMedia.mediaUrl}
                    controls
                    autoPlay
                    className="w-100 rounded-bottom-4"
                    style={{ maxHeight: "80vh" }}
                  />
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  ) : (
    <GalleryPlaceholder />
  );
};

export default MyGallery;
