import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import {
  IoCloudUploadOutline,
  IoArrowBack,
  IoPlayCircleOutline,
  IoClose,
} from "react-icons/io5";
import {
  FaImages,
  FaTrashAlt,
  FaVideo,
  FaExpand,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";

import GalleryPlaceholder from "../Components/GalleryPlaceholder";
import { setCurrentUserData } from "../redux/user.slice";
import UploadMedia from "../Customer/UploadMedia";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";

const MyGallery = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleDelete = async (mediaId) => {
    try {
      setLoading(true);

      const result = await axios.delete(
        `${server_url}/api/user/delete-media/${mediaId}`,
        { withCredentials: true }
      );

      dispatch(setCurrentUserData(result.data));
      setSelectedMedia(null);
      toast.success(result.data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setSelectedMedia(null);
      setLoading(false);
    }
  };

  const { currentUserData } = useSelector((state) => state.user);
  const media = currentUserData?.user?.gallery;

  return media?.length !== 0 ? (
    <div className="container-fluid px-2 px-md-4 py-3 py-md-4">
      <div className="container">
        {/* ================= HEADER ================= */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <div
            className="card-body p-3 p-md-4 text-white"
            style={{
              background:
                "linear-gradient(135deg, #0d6efd 0%, #4f8dfd 55%, #6f42c1 100%)",
            }}
          >
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <FaImages size={21} />
                </div>

                <div>
                  <h5 className="fw-bold mb-1">My Gallery</h5>
                  <small className="opacity-75">
                    Showcase your best work to customers
                  </small>
                </div>
              </div>

              <div className="w-100 w-sm-auto">
                <UploadMedia />
              </div>
            </div>
          </div>
        </div>

        {/* ================= GALLERY INFO ================= */}
        <div className="d-flex align-items-center justify-content-between mb-3 px-1">
          <div>
            <h6 className="fw-bold mb-1">Your work</h6>
            <small className="text-muted">
              {media.length} {media.length === 1 ? "item" : "items"} in gallery
            </small>
          </div>

          <div className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
            Tap to preview
          </div>
        </div>

        {/* ================= GALLERY GRID ================= */}
        <div className="row g-2 g-md-3">
          {media?.map((item, index) => (
            <div
              key={index}
              className="col-6 col-sm-4 col-md-3 col-lg-2"
            >
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                onClick={() => setSelectedMedia(item)}
                style={{
                  cursor: "pointer",
                  transition: "transform .2s ease, box-shadow .2s ease",
                }}
              >
                <div className="ratio ratio-1x1 position-relative bg-dark">
                  {item.mediaType === "image" ? (
                    <img
                      src={item.mediaUrl}
                      alt="gallery"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="w-100 h-100 object-fit-cover"
                    />
                  )}

                  {/* Overlay */}
                  <div
                    className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-end p-2"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,.55), transparent 45%)",
                    }}
                  >
                    {item.mediaType === "video" && (
                      <span className="badge bg-dark bg-opacity-75 rounded-pill d-flex align-items-center gap-1">
                        <IoPlayCircleOutline size={15} />
                        Video
                      </span>
                    )}

                    <span className="ms-auto bg-dark bg-opacity-75 text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      <FaExpand size={11} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PREVIEW MODAL ================= */}
        {selectedMedia && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-4"
            style={{
              backgroundColor: "rgba(8, 12, 20, 0.94)",
              zIndex: 1055,
            }}
          >
            <div
              className="w-100"
              style={{
                maxWidth: "1100px",
                maxHeight: "95vh",
              }}
            >
              {/* Modal Header */}
              <div className="d-flex align-items-center justify-content-between gap-2 mb-2 mb-md-3">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3 d-flex align-items-center gap-2"
                  onClick={() => setSelectedMedia(null)}
                >
                  <IoArrowBack size={18} />
                  <span className="d-none d-sm-inline">
                    Back
                  </span>
                </button>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-2">
                    {selectedMedia.mediaType === "image" ? (
                      <>
                        <FaImages className="me-1" />
                        Image
                      </>
                    ) : (
                      <>
                        <FaVideo className="me-1" />
                        Video
                      </>
                    )}
                  </span>

                  <button
                    type="button"
                    disabled={loading}
                    className="btn btn-danger rounded-pill px-3 d-flex align-items-center gap-2"
                    onClick={() =>
                      handleDelete(selectedMedia._id)
                    }
                  >
                    {loading ? (
                      <ClipLoader size={14} color="#fff" />
                    ) : (
                      <FaTrashAlt size={14} />
                    )}

                    <span className="d-none d-sm-inline">
                      Delete
                    </span>
                  </button>
                </div>
              </div>

              {/* Media */}
              <div
                className="bg-black rounded-4 overflow-hidden d-flex align-items-center justify-content-center"
                style={{
                  minHeight: "300px",
                  maxHeight: "82vh",
                }}
              >
                {selectedMedia.mediaType === "image" ? (
                  <img
                    src={selectedMedia.mediaUrl}
                    alt="preview"
                    className="img-fluid"
                    style={{
                      maxHeight: "82vh",
                      width: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <video
                    src={selectedMedia.mediaUrl}
                    controls
                    autoPlay
                    className="w-100"
                    style={{
                      maxHeight: "82vh",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>

              {/* Close */}
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedMedia(null)}
                  className="btn btn-outline-light rounded-pill px-4 d-inline-flex align-items-center gap-2"
                >
                  <IoClose />
                  Close preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <GalleryPlaceholder />
  );
};

export default MyGallery;