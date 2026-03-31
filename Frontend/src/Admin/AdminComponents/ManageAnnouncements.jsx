import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBullhorn,
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
    link: "",
    professions: [], // 🔥 NEW
  });

  const professionsList = [
    "electrician",
    "plumber",
    "carpenter",
    "painter",
    "ac repair",
  ];

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image
  const handleImage = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // 🔥 Handle profession checkbox
  const handleProfessionChange = (profession) => {
    let updated = [...formData.professions];

    if (updated.includes(profession)) {
      updated = updated.filter((p) => p !== profession);
    } else {
      updated.push(profession);
    }

    setFormData({ ...formData, professions: updated });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

      const payload = {
    title: formData.title,
    message: formData.message,
    audience: formData.audience,
    userType: formData.audience === "all" ? formData.userType : null,
    professions:
      formData.audience === "professional"
        ? formData.professions
        : [],
    link: formData.link || null,
    image: formData.image || null, // backend me file jayegi
    createdAt: new Date().toISOString(),
  };

    console.log("🚀 Announcement Payload:", payload);

  // (optional UI preview ke liye)
  const newAnnouncement = {
    id: Date.now(),
    ...payload,
    image: formData.image
      ? URL.createObjectURL(formData.image)
      : null,
  };

  setAnnouncements([newAnnouncement, ...announcements]);

  // reset
  setFormData({
    title: "",
    message: "",
    audience: "all",
    userType: "all",
    image: null,
    link: "",
    professions: [],
  });
  };

  // Delete
  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  // Redirect
  const handleRedirect = (link) => {
    if (link) window.open(link, "_blank");
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

              <input
                type="text"
                name="link"
                placeholder="Redirect Link (optional)"
                className="form-control mb-3"
                value={formData.link}
                onChange={handleChange}
              />

              {/* Audience */}
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

              {/* User Type */}
             {formData.audience === "all" && (
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
                )}

              {/* 🔥 PROFESSION CHECKBOX */}
              <div className="mb-3">
                <label className="fw-semibold">
                  Target Professions
                </label>

                <div className="d-flex flex-wrap gap-2 mt-2">
                  {professionsList.map((prof) => (
                    <div key={prof} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.professions.includes(prof)}
                        onChange={() =>
                          handleProfessionChange(prof)
                        }
                        disabled={
                          formData.audience !== "professional"
                        }
                      />
                      <label className="form-check-label">
                        {prof}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.audience !== "professional" && (
                  <small className="text-muted">
                    Select "Professional" to enable this
                  </small>
                )}
              </div>

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
        </div>

        {/* RIGHT */}
        <div className="col-md-7">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h5 className="mb-3">All Announcements</h5>

            {announcements.map((item) => (
              <div
                key={item.id}
                className="border rounded-3 p-3 mb-3"
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

                <div className="small text-muted mt-2">
                  <div>
                    <FaUsers /> {item.audience}
                  </div>
                  <div>
                    <FaUser /> {item.userType}
                  </div>

                  {/* 🔥 SHOW PROFESSIONS */}
                  {item.audience === "professional" &&
                    item.professions.length > 0 && (
                      <div>
                        <strong>Professions:</strong>{" "}
                        {item.professions.join(", ")}
                      </div>
                    )}
                </div>

                <button
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation();
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