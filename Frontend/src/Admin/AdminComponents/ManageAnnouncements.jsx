import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaBullhorn,
  FaTrash,
  FaUsers,
  FaLink,
} from "react-icons/fa";
import { server_url } from "../../App";
import useGetServices from "../../hooks/useGetServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
    useGetServices()
  const {services} = useSelector(state => state.services);
  const [formLoad, setFormLoad] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "all",
    image: null,
    link: "",
    professions: [], // 🔥 NEW
  });

  useEffect(()=>{
    const getAnnouncements = async ()=>{
      const res = await axios.get(`${server_url}/api/admin/get-announcements`, {withCredentials : true});
      setAnnouncements(res.data.announcements)
      toast.success(res.data.message)
    }
    
    getAnnouncements()
  },[announcements.length])

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
 const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();

  // ✅ Basic fields
  formDataToSend.append("title", formData.title);
  formDataToSend.append("message", formData.message);
  formDataToSend.append("audience", formData.audience);

  // ✅ Professions (only if professional)
  if (formData.audience === "professional") {
    formData.professions.forEach((prof) => {
      formDataToSend.append("professions", prof);
    });
  }

  // ✅ Optional fields
  if (formData.link) {
    formDataToSend.append("link", formData.link);
  }

  // ✅ Image
  if (formData.image) {
    formDataToSend.append("image", formData.image);
  }


  try {
    setFormLoad(true)
    const res = await axios.post(`${server_url}/api/admin/announcement`, formDataToSend, {withCredentials : true} );
    // reset
    setFormData({
      title: "",
      message: "",
      audience: "all",
      image: null,
      link: "",
      professions: [],
    });
    setFormLoad(false)
    toast.success("Announcement Posted!")
  } catch (error) {
    setFormLoad(false)
    toast.error("Failed to post announcement, Internal server error!")
  }
};

  // Delete
      const deleteAnnouncement = async (id) => {
       try {
        const res = await axios.delete(`${server_url}/api/admin/delete-announcement/${id}`, {withCredentials : true})
        toast.success(res.data.message);
       } catch (error) {
        toast.error(error.response.data.message)
       }
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

              {/* 🔥 PROFESSION CHECKBOX */}
              <div className="mb-3">
                <label className="fw-semibold">
                  Target Professions
                </label>

                <div className="d-flex flex-wrap gap-2 mt-2">
                  {services?.map((prof) => (
                    <div key={prof._id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.professions.includes(prof.name)}
                        onChange={() =>
                          handleProfessionChange(prof.name)
                        }
                        disabled={
                          formData.audience !== "professional"
                        }
                      />
                      <label className="form-check-label">
                        {prof.name}
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

              <button className="btn btn-dark w-100 rounded-pill" disabled={formLoad}>
               {formLoad ? "Posting..." : "Post Announcement"}
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