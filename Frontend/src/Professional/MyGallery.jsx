import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MyGallery = ({ media }) => {
  return (
    <div className="container my-4">
      <h4 className="fw-semibold mb-3">Gallery</h4>

      <div className="row g-3">
        {media?.map((item, index) => (
          <div key={index} className="col-4 col-sm-3 col-md-2">
            <div className="ratio ratio-1x1 rounded overflow-hidden border shadow-sm">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt="media"
                  className="img-fluid object-fit-cover w-100 h-100"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-100 h-100 object-fit-cover"
                  controls
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGallery;
