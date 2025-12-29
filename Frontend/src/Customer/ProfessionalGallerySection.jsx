import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaImages } from "react-icons/fa";

const ProfessionalGallerySection = ({ professionalInfo }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  if (!professionalInfo?.gallery || professionalInfo.gallery.length === 0) {
    return null;
  }

  return (
    <>
      {/* ================= GALLERY CARD ================= */}
      <div className="card border-0 shadow rounded-4 my-4 overflow-hidden">

        {/* Header */}
        <div
          className="px-4 py-3 text-white"
          style={{
            background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <FaImages size={18} />
            <h6 className="mb-0 fw-semibold">Work Gallery</h6>
          </div>
          <small className="opacity-75">
            Recent work samples shared by the professional
          </small>
        </div>

        {/* Body */}
        <div className="card-body bg-light">
          <div className="row g-3">
            {professionalInfo.gallery.map((item, index) => (
              <div
                key={index}
                className="col-6 col-sm-4 col-md-3 col-lg-2"
              >
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
                        muted
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PREVIEW MODAL ================= */}
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
    </>
  );
};

export default ProfessionalGallerySection;
