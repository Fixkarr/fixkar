import React, { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { formatTime } from "../utils/formatTime";
import useGetMyMessages from "../hooks/useGetChatMessages";
// redux
import useGetUserById from "../hooks/useGetUserById";

const ChatSection = () => {
  const { id: recieverId } = useParams();
  useGetUserById(recieverId);
  const {onlineUsers} = useSelector(state => state.presence)
    /* ================= FETCH MESSAGES ================= */
  useGetMyMessages(recieverId);

  const messagesEndRef = useRef(null);
  const { selectedConversationUser, messages } = useSelector(
  (state) => state.chatMessages
);


  const { currentUserData } = useSelector((state) => state.user);

  const myId = currentUserData?.user?.userId?._id;
  const role = currentUserData?.user?.userId?.role;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  /* ================= FILE SELECT ================= */
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type,
    }));

    setSelectedFiles((prev) => [...prev, ...previews]);
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("message", message);

    selectedFiles.forEach((item) =>
      formData.append("attachments", item.file)
    );

    try {
      setLoading(true);
      await axios.post(
        `${server_url}/api/messages/send/${recieverId}`,
        formData,
        { withCredentials: true }
      );

      setMessage("");
      setSelectedFiles([]);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEANUP PREVIEWS ================= */
  useEffect(() => {
    return () => {
      selectedFiles.forEach((f) =>
        URL.revokeObjectURL(f.preview)
      );
    };
  }, [selectedFiles]);

  return (
    <div className="card border-0 shadow rounded-4 overflow-hidden "
    style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >

      {/* ===== HEADER ===== */}
      <div
        className="card-header d-flex align-items-center gap-3 text-white"
        style={{ background: "linear-gradient(135deg,#0d6efd,#4f9cff)" }}
      >
        <img
          src={
            selectedConversationUser?.profilePicture ||
            "/Images/placeholderProfile.avif"
          }
          className="rounded-circle border border-2 border-white"
          width="45"
          height="45"
          alt="profile"
        />

        <div>
          <h6 className="mb-0 fw-semibold">
            {selectedConversationUser?.userId.fullName}
          </h6>
          <small
            className={`fw-semibold ${
              onlineUsers.includes(recieverId)
                ? "text-warning"
                : "text-light opacity-75"
            }`}
          >
            ● {onlineUsers.includes(recieverId) ? "Online" : "Offline"}
          </small>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div
        className="card-body bg-light"
        style={{ overflowY: "auto" }}
      >
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`d-flex mb-3 ${
              msg.sender === myId
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 px-3 rounded-4 shadow-sm ${
                msg.sender === myId
                  ? "bg-primary bg-opacity-10"
                  : "bg-white"
              }`}
              style={{ maxWidth: "75%" }}
            >
              {msg.message && (
                <p className="mb-1 fw-semibold">{msg.message}</p>
              )}

              {msg.attachments?.map((media) =>
                media.fileType === "image" ? (
                  <img
                    key={media.url}
                    src={media.url}
                    className="img-fluid rounded mb-2"
                    style={{ maxHeight: 250 }}
                  />
                ) : (
                  <video
                    key={media.url}
                    controls
                    className="img-fluid rounded mb-2"
                    style={{ maxHeight: 250 }}
                  >
                    <source src={media.url} />
                  </video>
                )
              )}

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {formatTime(
                    msg.status === "seen"
                      ? msg.seenAt
                      : msg.status === "delivered"
                      ? msg.deliveredAt
                      : msg.createdAt
                  )}
                </small>

                <span
                  className={
                    msg.status === "seen"
                      ? "text-primary"
                      : "text-muted"
                  }
                >
                  {msg.status === "sent" && <BsCheck />}
                  {(msg.status === "delivered" ||
                    msg.status === "seen") && <BsCheckAll />}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== FILE PREVIEW ===== */}
      {selectedFiles.length > 0 && (
        <div className="p-2 border-top bg-light d-flex gap-2 flex-wrap">
          {selectedFiles.map((item, i) => (
            <div key={i} className="position-relative">
              {item.type.startsWith("image") ? (
                <img
                  src={item.preview}
                  width="80"
                  height="80"
                  className="rounded"
                />
              ) : (
                <video
                  src={item.preview}
                  width="100"
                  height="80"
                  className="rounded"
                  controls
                />
              )}

              <button
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() =>
                  setSelectedFiles((p) =>
                    p.filter((_, idx) => idx !== i)
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="card-footer bg-white">
        <div className="d-flex gap-2 align-items-center">

          {role === "customer" && (
            <label className="btn btn-light rounded-circle shadow-sm mb-0">
              <ImAttachment />
              <input
                type="file"
                hidden
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
              />
            </label>
          )}

          <input
            className="form-control rounded-pill"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="btn btn-primary rounded-circle px-3"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? <ClipLoader size={18} /> : <IoMdSend />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
