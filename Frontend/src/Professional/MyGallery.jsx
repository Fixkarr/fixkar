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
    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column"
    style={{
      background:
        "radial-gradient(circle at top, #1f2937 0%, #080c14 45%, #030508 100%)",
      zIndex: 1055,
      overflow: "hidden",
    }}
  >
    {/* ================= TOP BAR ================= */}
    <div
      className="d-flex align-items-center justify-content-between px-3 px-md-4 py-3 flex-shrink-0"
      style={{
        background: "rgba(8, 12, 20, 0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* LEFT */}
      <button
        type="button"
        onClick={() => setSelectedMedia(null)}
        className="btn btn-light rounded-pill d-flex align-items-center gap-2 px-3 shadow-sm"
      >
        <IoArrowBack size={18} />

        <span className="d-none d-sm-inline fw-semibold">
          Back
        </span>
      </button>

      {/* CENTER TITLE */}
      <div className="position-absolute start-50 translate-middle-x text-center d-none d-md-block">
        <div className="text-white fw-semibold small">
          Media Preview
        </div>

        <div
          className="text-white-50"
          style={{ fontSize: "11px" }}
        >
          Your gallery
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="d-flex align-items-center gap-2">
        {/* MEDIA TYPE */}
        <div
          className="d-flex align-items-center gap-2 text-white rounded-pill px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "12px",
          }}
        >
          {selectedMedia.mediaType === "image" ? (
            <>
              <FaImages className="text-info" />
              <span className="d-none d-sm-inline">
                Image
              </span>
            </>
          ) : (
            <>
              <FaVideo className="text-warning" />
              <span className="d-none d-sm-inline">
                Video
              </span>
            </>
          )}
        </div>

        {/* DELETE */}
        <button
          type="button"
          disabled={loading}
          className="btn btn-danger rounded-pill d-flex align-items-center gap-2 px-3 shadow-sm"
          onClick={() =>
            handleDelete(selectedMedia._id)
          }
        >
          {loading ? (
            <ClipLoader size={14} color="#fff" />
          ) : (
            <FaTrashAlt size={13} />
          )}

          <span className="d-none d-sm-inline fw-semibold">
            {loading ? "Deleting..." : "Delete"}
          </span>
        </button>
      </div>
    </div>

    {/* ================= MEDIA AREA ================= */}
    <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative p-2 p-md-4">
      {/* Subtle background glow */}
      <div
        className="position-absolute top-50 start-50 translate-middle rounded-circle"
        style={{
          width: "35vw",
          height: "35vw",
          maxWidth: "500px",
          maxHeight: "500px",
          background:
            "radial-gradient(circle, rgba(13,110,253,.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Media Frame */}
      <div
        className="position-relative d-flex align-items-center justify-content-center overflow-hidden rounded-4 shadow-lg"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "1200px",
          maxHeight: "calc(100vh - 145px)",
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {selectedMedia.mediaType === "image" ? (
          <img
            src={selectedMedia.mediaUrl}
            alt="preview"
            className="img-fluid"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        ) : (
          <video
            src={selectedMedia.mediaUrl}
            controls
            autoPlay
            playsInline
            className="w-100 h-100"
            style={{
              objectFit: "contain",
              background: "#000",
            }}
          />
        )}

        {/* MEDIA TYPE FLOATING LABEL */}
        <div
          className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2 text-white rounded-pill px-3 py-2"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "11px",
          }}
        >
          {selectedMedia.mediaType === "image" ? (
            <>
              <FaImages />
              Image
            </>
          ) : (
            <>
              <FaVideo />
              Video
            </>
          )}
        </div>
      </div>
    </div>

    {/* ================= BOTTOM BAR ================= */}
    <div
      className="d-flex justify-content-center align-items-center px-3 py-2 flex-shrink-0"
      style={{
        background: "rgba(8, 12, 20, 0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="d-flex align-items-center gap-2 text-white-50 small">
        <span
          className="d-inline-block rounded-circle bg-success"
          style={{
            width: "7px",
            height: "7px",
          }}
        />

        <span>
          {selectedMedia.mediaType === "image"
            ? "Image preview"
            : "Video preview"}
        </span>
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