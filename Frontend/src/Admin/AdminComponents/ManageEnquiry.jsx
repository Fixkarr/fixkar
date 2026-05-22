import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaReply,
  FaTrash,
  FaSearch,
  FaUserCircle,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa";
import axios from  "axios"
import { server_url } from "../../App";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatTime&Date";

const ManageEnquiry = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);

 useEffect(()=>{
    const getEnquiries = async ()=>{
        try {
            const res = await axios.get(`${server_url}/api/admin/get-enquiries`, {withCredentials : true});
        setEnquiries(res?.data?.enquiries);
        toast.success(res?.data.message);
        } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to get Enquiries!")
        }
    }

    getEnquiries();
 },[])

  // Delete Enquiry
  const deleteEnquiry = (id) => {
    setEnquiries(enquiries?.filter((item) => item.id !== id));

    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  // Reply Function
  const handleReply = async (enquiryId) => {
    if (!replyText.trim()) {
      alert("Please write a reply message");
      return;
    }

    try {
        setLoading(true)
        const res = await axios.post(`${server_url}/api/admin/reply-enquiry/${enquiryId}`, {replyMessage : replyText}, {withCredentials : true} );

        toast.success(res?.data?.message)
    } catch (error) {
           toast.error(error?.response?.data?.message || "Failed to reply enquiry!")
    }finally{
        setLoading(false)
    }

    setEnquiries(
      enquiries?.map((item) =>
        item._id === selectedMessage._id
          ? { ...item, replied: true }
          : item
      )
    );

    setReplyText("");
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* HEADER */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-4"
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            Manage Enquiries
          </h2>

          <p style={{ color: "#94a3b8", marginBottom: "0" }}>
            Manage customer contact messages & replies
          </p>
        </div>

      </div>

      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-lg-5 mb-4">
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.08)",
              height: "80vh",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: "600" }}>Inbox Messages</h5>

              <span
                className="badge"
                style={{
                  background: "#2563eb",
                  padding: "10px 15px",
                  borderRadius: "10px",
                }}
              >
                {enquiries?.length} Messages
              </span>
            </div>

            {enquiries?.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMessage(item)}
                className="mb-3"
                style={{
                  cursor: "pointer",
                  padding: "18px",
                  borderRadius: "16px",
                  background:
                    selectedMessage?.id === item.id
                      ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                      : "#111827",
                  border:
                    selectedMessage?.id === item.id
                      ? "1px solid #3b82f6"
                      : "1px solid rgba(255,255,255,0.06)",
                  transition: "0.3s",
                }}
              >
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <FaUserCircle size={45} color="#cbd5e1" />

                    <div>
                      <h6 style={{ marginBottom: "3px" }}>{item.name}</h6>

                      <span className="badge rounded-pill bg-danger">{item.senderRole}</span>

                      <small style={{ color: "#cbd5e1" }}>
                        {item.email}
                      </small> <br />
                      <small style={{ color: "#cbd5e1" }}>
                        {item.phone}
                      </small>
                    </div>
                  </div>

                  <small style={{ color: "#cbd5e1" }}>{formatDate(item.createdAt)}</small>
                </div>

                <p
                  style={{
                    color: "#e2e8f0",
                    marginTop: "12px",
                    fontSize: "14px",
                  }}
                >
                  {item.message.slice(0, 80)}...
                </p>

                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className="badge"
                    style={{
                      background:
                        item.replied
                        ? "#16a34a"
                        : "#dc2626",
                      padding: "8px 12px",
                      borderRadius: "8px",
                    }}
                  >
                    {item.replied ? "Replied" : "Not Replied"}
                  </span>

                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEnquiry(item.id);
                    }}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      borderRadius: "10px",
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-7">
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "20px",
              padding: "25px",
              border: "1px solid rgba(255,255,255,0.08)",
              minHeight: "80vh",
            }}
          >
            {selectedMessage ? (
              <>
                {/* TOP */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <FaUserCircle size={55} color="#cbd5e1" />

                    <div>
                      <h4>{selectedMessage.name}</h4>

                      <p
                        style={{
                          color: "#94a3b8",
                          marginBottom: "0",
                        }}
                      >
                        <FaEnvelope className="me-2" />
                        {selectedMessage.email}
                      </p>
                      <p
                        style={{
                          color: "#94a3b8",
                          marginBottom: "0",
                        }}
                      >
                        <FaPhone className="me-2" />
                        {selectedMessage.phone}
                      </p>
                    </div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      background:
                        selectedMessage.replied
                        ? "#16a34a"
                          : "#dc2626",
                      padding: "10px 15px",
                      borderRadius: "10px",
                    }}
                  >
                    {selectedMessage.replied ? "Replied" : "Not Replied"}
                  </span>
                </div>

                {/* MESSAGE */}
                <div
                  style={{
                    background: "#111827",
                    padding: "25px",
                    borderRadius: "18px",
                    marginBottom: "25px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h5 className="mb-3">Customer Message</h5>

                  <p
                    style={{
                      lineHeight: "30px",
                      color: "#d1d5db",
                    }}
                  >
                    {selectedMessage.message}
                  </p>
                </div>

                {/* REPLY BOX */}
               {!selectedMessage.replied && <div>
                  <h5 className="mb-3">
                    <FaReply className="me-2" />
                    Reply to Customer
                  </h5>

                  <textarea
                    rows="7"
                    className="form-control shadow-none"
                    placeholder="Write your professional reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "white",
                      borderRadius: "16px",
                      padding: "20px",
                      resize: "none",
                    }}
                  />

                  <button
                    onClick={()=>handleReply(selectedMessage._id)}
                    disabled={loading}
                    className="btn mt-4 px-4 py-3"
                    style={{
                      background:
                        "linear-gradient(135deg,#2563eb,#7c3aed)",
                      color: "white",
                      border: "none",
                      borderRadius: "14px",
                      fontWeight: "600",
                      boxShadow: "0 8px 25px rgba(59,130,246,0.4)",
                    }}
                  >
                    <FaPaperPlane className="me-2" />
                    {loading ? "Replying" : "Send Reply"}
                  </button>
                </div>}
              </>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center flex-column"
                style={{
                  height: "70vh",
                }}
              >
                <FaEnvelope size={70} color="#475569" />

                <h4 className="mt-4">No Message Selected</h4>

                <p style={{ color: "#94a3b8" }}>
                  Select an enquiry from the left panel to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEnquiry;