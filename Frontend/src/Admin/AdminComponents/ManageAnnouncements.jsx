import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBullhorn,
  FaImage,
  FaTrash,
  FaUser,
  FaUsers,
  FaLink,
} from "react-icons/fa";

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "all",
    userType: "all",
    image: null,
    link: "", // 🔥 NEW FIELD
  });

  const [bannerImages, setBannerImages] = useState([]);
  const [tempBanner, setTempBanner] = useState([]);

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image
  const handleImage = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle banner multiple images
  const handleBannerImages = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setTempBanner(previews);
  };

  // Apply banner images
  const applyBanner = () => {
    setBannerImages(tempBanner);
    setTempBanner([]); // clear preview input
  };

  // Submit announcement
  const handleSubmit = (e) => {
    e.preventDefault();

    const newAnnouncement = {
      id: Date.now(),
      ...formData,
      image: formData.image
        ? URL.createObjectURL(formData.image)
        : null,
    };

    setAnnouncements([newAnnouncement, ...announcements]);

    setFormData({
      title: "",
      message: "",
      audience: "all",
      userType: "all",
      image: null,
      link: "",
    });
  };

  // Delete
  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  // Redirect click
  const handleRedirect = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="container-fluid p-4">
      <h3 className="mb-4 fw-bold">
        <FaBullhorn /> Manage Announcements
      </h3>

      <div className="row">
        {/* LEFT */}
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h5 className="mb-3">Create Announcement</h5>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="form-control mb-3"
                value={formData.title}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Message"
                className="form-control mb-3"
                value={formData.message}
                onChange={handleChange}
              />

              {/* 🔥 LINK INPUT */}
              <input
                type="text"
                name="link"
                placeholder="Redirect Link (optional)"
                className="form-control mb-3"
                value={formData.link}
                onChange={handleChange}
              />

              <select
                name="audience"
                className="form-select mb-3"
                value={formData.audience}
                onChange={handleChange}
              >
                <option value="all">All Users</option>
                <option value="customer">Customers</option>
                <option value="professional">Professionals</option>
              </select>

              <select
                name="userType"
                className="form-select mb-3"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="all">All</option>
                <option value="registered">Registered</option>
                <option value="non-registered">
                  Non Registered
                </option>
              </select>

              <input
                type="file"
                className="form-control mb-3"
                onChange={handleImage}
              />

              <button className="btn btn-dark w-100 rounded-pill">
                Post Announcement
              </button>
            </form>
          </div>

          {/* 🔥 MULTIPLE BANNER SYSTEM */}
          <div className="card mt-4 shadow border-0 rounded-4 p-4">
            <h5>
              <FaImage /> Banner Slider
            </h5>

            <input
              type="file"
              multiple
              className="form-control mt-3"
              onChange={handleBannerImages}
            />

            {/* Preview */}
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {tempBanner.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  width="80"
                  className="rounded"
                />
              ))}
            </div>

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={applyBanner}
            >
              Apply Banner Images
            </button>

            {/* Active banner */}
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {bannerImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  width="80"
                  className="rounded border"
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-7">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h5 className="mb-3">All Announcements</h5>

            {announcements.length === 0 && (
              <p>No announcements yet</p>
            )}

            {announcements.map((item) => (
              <div
                key={item.id}
                className="border rounded-3 p-3 mb-3 position-relative cursor-pointer"
                onClick={() => handleRedirect(item.link)}
                style={{ cursor: item.link ? "pointer" : "default" }}
              >
                <h6 className="fw-bold">{item.title}</h6>
                <p>{item.message}</p>

                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="img-fluid rounded mb-2"
                  />
                )}

                {item.link && (
                  <small className="text-primary">
                    <FaLink /> Click to open link
                  </small>
                )}

                <div className="d-flex gap-2 small text-muted mt-2">
                  <span>
                    <FaUsers /> {item.audience}
                  </span>
                  <span>
                    <FaUser /> {item.userType}
                  </span>
                </div>

                <button
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation(); // important
                    deleteAnnouncement(item.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;