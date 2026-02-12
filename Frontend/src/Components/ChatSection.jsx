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
import VoiceRecorder from "./VoiceRecorder";

const ChatSection = () => {
  const { id: recieverId } = useParams();
  useGetUserById(recieverId);
  const {onlineUsers} = useSelector(state => state.presence)
  const [previewMedia, setPreviewMedia] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const messageRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);
  const longPressTimer = useRef(null);
  const [voiceBlob, setVoiceBlob] = useState(null);




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

     if (replyingTo) {
  formData.append("replyTo", replyingTo._id);
    }

    if (voiceBlob) {
  formData.append("attachments", voiceBlob, "voice.webm");
}

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
      setReplyingTo(null);
      setVoiceBlob(null);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };


 useEffect(() => {
  const handleClick = (e) => {
    if (e.target.closest(".custom-context-menu")) return;
    setContextMenu(null);
  };

  window.addEventListener("click", handleClick);
  return () => window.removeEventListener("click", handleClick);
}, []);


const handleCopy = () => {
  if (selectedMsg?.message) {
    navigator.clipboard.writeText(selectedMsg.message);
    toast.success("Copied");
  }
  setContextMenu(null);
};

const handleDownload = () => {
  const media = selectedMsg?.attachments?.[0];
  if (media?.url) {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = "file";
    link.click();
  }
  setContextMenu(null);
};


const handleReply = () => {
  setReplyingTo(selectedMsg);
  setContextMenu(null);
}; 


const scrollToMessage = (id) => {
  const element = messageRefs.current[id];
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlightedId(id);

    setTimeout(() => {
      setHighlightedId(null);
    }, 2000);
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
  className="card border-0 shadow rounded-46 d-flex flex-column"
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

           {messages?.length === 0 && (
  <div className="empty-chat-container">
    <div className="empty-card text-center p-4">
      <div className="mb-3" style={{ fontSize: "70px" }}>
        🚀
      </div>
      <h5 className="fw-bold">
        No messages yet
      </h5>
      <p className="text-muted small">
        Send a message to start chatting with{" "}
        {selectedConversationUser?.userId?.fullName}
      </p>
    </div>
  </div>
)}


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
           onTouchStart={(e) => {
  longPressTimer.current = setTimeout(() => {
    const touch = e.touches[0];
    setSelectedMsg(msg);
    setContextMenu({
      mouseX: touch.clientX,
      mouseY: touch.clientY,
    });
  }, 600); // 600ms hold
}}
onTouchEnd={() => {
  clearTimeout(longPressTimer.current);
}}
onTouchMove={() => {
  clearTimeout(longPressTimer.current);
}}
             onContextMenu={(e) => {
              e.preventDefault();
              setSelectedMsg(msg);
              setContextMenu({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
             ref={(el) => {
              if (el) messageRefs.current[msg._id] = el;
            }}
          className={`message-bubble px-3 py-2 shadow-sm ${
            msg.sender === myId
              ? "bg-primary text-white"
              : "bg-white border"
          } ${highlightedId === msg._id ? "highlight-message" : ""}`}

          style={{
            maxWidth: "75%",
            borderRadius: "18px",
            borderTopRightRadius:
              msg.sender === myId ? "4px" : "18px",
            borderTopLeftRadius:
              msg.sender !== myId ? "4px" : "18px",
          }}
        >
          {msg.replyTo && (
  <div
    className="mb-2 p-2 rounded"
    style={{
      backgroundColor: msg.sender === myId ? "rgba(255,255,255,0.2)" : "#f1f3f5",
      borderLeft: "3px solid #0d6efd",
      cursor : "pointer"
    }}
    onClick={() => scrollToMessage(msg.replyTo._id)}
  >
    <small className="fw-semibold text-muted">
     {msg.replyTo.sender?.toString() === myId ? "You" : selectedConversationUser?.userId?.fullName}
    </small>

    <div className="small text-truncate">
      {msg.replyTo.message
        ? msg.replyTo.message
        : msg.replyTo.attachments?.length > 0
        ? msg.replyTo.attachments[0].fileType === "video"
          ? "🎥 Video"
          : msg.replyTo.attachments[0].fileType === "audio"
          ? "🎤 Voice message"
          : "📷 Photo"
        : ""}
    </div>
  </div>
)}


          {msg.message && (
            <p className="mb-1 fw-semibold">{msg.message}</p>
          )}

          {msg.attachments?.map((media, idx) =>
           { if(media.fileType === "image") {
             return ( <img
                key={media.url + idx}
                src={media.url}
                className="img-fluid rounded mb-2"
                style={{ maxHeight: 250 }}
                onClick={() => setPreviewMedia({ type: "image", url: media.url })}
              />)
            } 
            if(media.fileType === "video"){
               return (
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
            }
            if(media.fileType === 'audio'){
               return (
      <div key={media.url + idx} className="audio-bubble">
          Voice Message
        <audio controls src={media.url} />
      </div>
    );
            }
              
          } 
            
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

      {replyingTo && (
  <div
    className="px-3 py-2 border-top bg-light"
    style={{
      borderLeft: "4px solid #0d6efd"
    }}
  >
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <small className="text-primary fw-semibold">
          Replying to {replyingTo.sender === myId ? "You" : selectedConversationUser?.userId?.fullName}
        </small>

        <div className="small text-muted text-truncate">
          {replyingTo.message
            ? replyingTo.message
            : replyingTo.attachments?.length > 0
            ? replyingTo.attachments[0].fileType === "video"
              ? "🎥 Video"
              : "📷 Photo"
            : ""}
        </div>
      </div>

      <button
        className="btn-close btn-sm"
        onClick={() => setReplyingTo(null)}
      ></button>
    </div>
  </div>
)}


      {/* ===== FOOTER ===== */}
     <div
  className="chat-footer bg-white flex-shrink-0 px-2 py-2"
>
  <div className="d-flex align-items-center gap-2 w-100">

    {role === "customer" && (
      <label className="attach-btn d-flex align-items-center justify-content-center">
        <ImAttachment size={22} />
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
      className="form-control chat-input"
      placeholder="Type a message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />

    <VoiceRecorder onAudioReady={(blob) => setVoiceBlob(blob)} />


    <button
      className="send-btn d-flex align-items-center justify-content-center"
      onClick={handleSend}
      disabled={loading}
    >
      <IoMdSend size={22} />
    </button>
  </div>
</div>


      {contextMenu && (
  <div
    style={{
      position: "fixed",
      top: contextMenu.mouseY,
      left: contextMenu.mouseX,
      background: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderRadius: "8px",
      padding: "8px 0",
      zIndex: 9999,
      minWidth: "180px",
    }}
  >
    {/* TEXT MESSAGE OPTIONS */}
    {selectedMsg?.message && !selectedMsg?.attachments?.length && (
      <div
        className="px-3 py-2 hover-bg"
        onClick={handleCopy}
        style={{ cursor: "pointer" }}
      >
        Copy
      </div>
    )}

    <div
      className="px-3 py-2"
      onClick={handleReply}
      style={{ cursor: "pointer" }}
    >
      Reply
    </div>

    {/* MEDIA DOWNLOAD */}
    {selectedMsg?.attachments?.length > 0 && (
      <div
        className="px-3 py-2"
        onClick={handleDownload}
        style={{ cursor: "pointer" }}
      >
        Download
      </div>
    )}
  </div>
)}

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
