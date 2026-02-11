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
import { formatChatDate } from "../utils/formatChatDate";

const ChatSection = () => {
  const { id: recieverId } = useParams();
  useGetUserById(recieverId);
  const {onlineUsers} = useSelector(state => state.presence)
  const [previewMedia, setPreviewMedia] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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

  useEffect(() => {
  if (!recieverId) return;

  axios.put(
    `${server_url}/api/messages/mark-seen`,
    { senderId: recieverId },
    { withCredentials: true }
  ).catch(err => {
  });

}, [recieverId, messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (loading) return
    if (!message.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("message", message);

    selectedFiles.forEach((item) =>
      formData.append("attachments", item.file)
    );

    try {
      setLoading(true);
       setIsUploading(true);
        setUploadProgress(0);
      await axios.post(
        `${server_url}/api/messages/send/${recieverId}`,
        formData,
        { withCredentials: true,
            onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total
          );

           setUploadProgress(percent);

         }
        }
      );

      setMessage("");
      setSelectedFiles([]);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
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
   <div
  className="card border-0 shadow rounded-4 overflow-hidden d-flex flex-column"
  style={{ height: "100vh" }}
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
          role="button"
          
        />

        <div>
          <h6 className="mb-0 fw-semibold">
            {selectedConversationUser?.userId?.fullName}
          </h6>
          <small
            className={`fw-semibold ${
              onlineUsers?.includes(recieverId)
                ? "text-warning"
                : "text-light opacity-75"
            }`}
          >
            ● {onlineUsers?.includes(recieverId) ? "Online" : "Offline"}
          </small>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div
  className="card-body bg-light flex-grow-1"
  style={{ overflowY: "auto", minHeight: 0 }}
>
       {messages?.map((msg, index) => {
  const currentDate = new Date(msg.createdAt).toDateString();
  const prevDate =
    index > 0
      ? new Date(messages[index - 1].createdAt).toDateString()
      : null;

  const showDate = currentDate !== prevDate;

  return (
    <React.Fragment key={msg._id}>
      {showDate && (
        <div
          className="text-center my-3"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <span
            className="px-3 py-1 rounded-pill shadow-sm"
            style={{
              fontSize: "12px",
              backgroundColor: "#e9ecef",
              color: "#555",
            }}
          >
            {formatChatDate(msg.createdAt)}
          </span>
        </div>
      )}

      <div
        className={`d-flex mb-3 ${
          msg.sender === myId
            ? "justify-content-end"
            : "justify-content-start"
        }`}
      >
        <div
          className={`message-bubble px-3 py-2 shadow-sm ${
            msg.sender === myId
              ? "bg-primary text-white"
              : "bg-white border"
          }`}
          style={{
            maxWidth: "75%",
            borderRadius: "18px",
            borderTopRightRadius:
              msg.sender === myId ? "4px" : "18px",
            borderTopLeftRadius:
              msg.sender !== myId ? "4px" : "18px",
          }}
        >
          {msg.message && (
            <p className="mb-1 fw-semibold">{msg.message}</p>
          )}

          {msg.attachments?.map((media, idx) =>
            media.fileType === "image" ? (
              <img
                key={media.url + idx}
                src={media.url}
                className="img-fluid rounded mb-2"
                style={{ maxHeight: 250 }}
                onClick={() => setPreviewMedia({ type: "image", url: media.url })}
              />
            ) : (
              <video
                key={media.url + idx}
                controls
                className="img-fluid rounded mb-2"
                style={{ maxHeight: 250 }}
                onClick={() => setPreviewMedia({ type: "video", url: media.url })}
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
                  ? "text-info"
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
    </React.Fragment>
  );
})}

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
                onClick={() =>{
                  URL.revokeObjectURL(item.preview);
                  setSelectedFiles((p) =>
                    p.filter((_, idx) => idx !== i)
                  )
                }
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
  <div className="px-3 pb-2">
    <div
      className="progress"
      style={{ height: "6px", borderRadius: "10px" }}
    >
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${uploadProgress}%` }}
      ></div>
    </div>
    <small className="text-muted">
      Uploading... {uploadProgress}%
    </small>
  </div>
)}

      {/* ===== FOOTER ===== */}
      <div className="card-footer bg-white flex-shrink-0"
       style={{ position: "sticky", bottom: 0 }}>
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
           <IoMdSend />
          </button>
        </div>
      </div>

      {previewMedia && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
    onClick={() => setPreviewMedia(null)}
  >
    {previewMedia.type === "image" ? (
      <img
        src={previewMedia.url}
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: "10px",
        }}
      />
    ) : (
      <video
        src={previewMedia.url}
        controls
        autoPlay
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: "10px",
        }}
      />
    )}
  </div>
)}

    </div>
  );
};

export default ChatSection;
