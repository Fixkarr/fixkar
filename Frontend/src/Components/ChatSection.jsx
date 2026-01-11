import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import { ImAttachment } from "react-icons/im";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {clearUnseenCount, setMessages} from '../redux/chat.slice.js'
import { server_url } from "../App";
import { addMessage } from "../redux/chat.slice.js";
import axios from 'axios'
import socket from "../socket";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import useGetUserById from "../hooks/useGetUserById.jsx";
import { BsCheck } from "react-icons/bs";
import { BsCheckAll } from "react-icons/bs";
import { formatTime } from "../utils/formatTime.js";
import { useNavigate } from "react-router-dom";

const ChatSection = () => {
  const navigate = useNavigate()
    const {id} = useParams()
    useGetUserById(id);
    const dispatch = useDispatch();
    const {currentUserData} = useSelector(state => state.user);
    const { messages } = useSelector(state => state.chat);
    const {selectedUser} = useSelector(state=>state.chat);
    const {onlineUsers} = useSelector(state=>state.chat)
    const recieverId = id
    const myId = currentUserData?.user?.userId?._id
    const role = currentUserData?.user?.userId?.role
    const [loading ,setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    

    const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);

  const previewFiles = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
    type: file.type,
  }));

  setSelectedFiles((prev) => [...prev, ...previewFiles]);
};


useEffect(() => {
  const handleNewMessage = (newMessage) => {
    if (
      newMessage.sender === recieverId ||
      newMessage.reciever === recieverId
    ) {
      dispatch(addMessage(newMessage));
    }
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [recieverId, dispatch]);

useEffect(() => {
  return () => {
    selectedFiles.forEach((item) =>
      URL.revokeObjectURL(item.preview)
    );
  };
}, [selectedFiles]);

  useEffect(() => {
  if (!recieverId) return;

  // 1️⃣ Backend source of truth
  axios.put(
    `${server_url}/api/messages/mark-seen`,
    { senderId: recieverId },
    { withCredentials: true }
  );

  // 2️⃣ Redux inbox update
  dispatch(clearUnseenCount(recieverId));

}, [recieverId, dispatch]);
    
  useEffect(()=>{
       const fetchMessages = async () => {
    try {
      if (!recieverId) return;

      const res = await axios.get(
        `${server_url}/api/messages/get-messages/${recieverId}`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data.messages));

    } catch (error) {
      console.log("Fetch messages error:", error.message);
      toast.error(error.message)
    }
  };
    fetchMessages()
    },[recieverId, dispatch])


  useEffect(() => {
  const handleSeen = ({ senderId }) => {
    if (senderId !== recieverId) return;

    dispatch(
      setMessages(
        messages.map((msg) =>
          msg.sender === myId && msg.reciever === recieverId
            ? { ...msg, status: "seen", seenAt: new Date().toISOString() }
            : msg
        )
      )
    );
  };

  socket.on("messagesSeen", handleSeen);
  return () => socket.off("messagesSeen", handleSeen);
}, [messages, recieverId, myId, dispatch]);


  useEffect(() => {
  const handleDelivered = ({ messageId }) => {
    dispatch(
      setMessages(
        messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, status: "delivered" }
            : msg
        )
      )
    );
  };

  socket.on("messageDelivered", handleDelivered);

  return () => socket.off("messageDelivered", handleDelivered);
}, [messages, dispatch]);



  const [message, setMessage] = useState("");
  


  const handleSend = async () => {
      if (!message.trim() && selectedFiles.length === 0) return;

      const formData = new FormData();

      formData.append("message", message);

      selectedFiles.forEach((item)=>{
        formData.append("attachments", item.file);
      });

       try {
        setLoading(true)
        const result = await axios.post(`${server_url}/api/messages/send/${recieverId}` , formData , {withCredentials : true});
        console.log(messages);
        setMessage("");
        setSelectedFiles([])
        setLoading(false)
      } catch (error) {
        toast.error(error.response.data.message)
        setLoading(false)
      }
    
    setMessage("");
  };

  return (
  <div className="card border-0 shadow rounded-4 overflow-hidden chat-section">

  {/* ===== HEADER ===== */}
  <div
    className="card-header d-flex align-items-center gap-3 text-white"
    style={{ background: "linear-gradient(135deg,#0d6efd,#4f9cff)" }}
  >
    <img
      src={selectedUser?.profilePicture || "/Images/placeholderProfile.avif"}
      alt="profile"
      className="rounded-circle border border-2 border-white"
      width="45"
      height="45"
    />

    <div>
      <h6 className="mb-0 fw-semibold">
        {selectedUser?.userId?.fullName}
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

  {/* ===== CHAT BODY ===== */}
  <div
    className="card-body bg-light"
    style={{ height: "74vh", overflowY: "auto" }}
  >
    {messages?.map((msg) => (
      <div
        key={msg._id}
        className={`d-flex mb-3 ${
          myId == msg.sender
            ? "justify-content-end"
            : "justify-content-start"
        }`}
      >
        <div
          className={`p-2 px-3 rounded-4 shadow-sm ${
            myId === msg.sender
              ? "bg-primary bg-opacity-10"
              : "bg-white"
          }`}
          style={{ maxWidth: "75%" }}
        >
          <div className="msg-container mb-1">

            {msg.message !== "" && (
              <p className="mb-1 fw-semibold text-dark">
                {msg.message}
              </p>
            )}

            {msg.attachments?.length !== 0 &&
              msg.attachments.map((media) =>
                media.fileType === "image" ? (
                  <img
                    key={media._id}
                    src={media.url}
                    className="img-fluid rounded mb-2"
                    style={{ maxHeight: "250px" }}
                  />
                ) : (
                  <video
                    key={media._id}
                    controls
                    className="img-fluid rounded mb-2"
                    style={{ maxHeight: "250px" }}
                  >
                    <source src={media.url} />
                  </video>
                )
              )}
          </div>

          {/* Status & Time */}
          <div className="d-flex align-items-center justify-content-between gap-2">
            <small className="text-muted">
              {msg.status === "seen"
                ? formatTime(msg.seenAt)
                : msg.status === "delivered"
                ? formatTime(msg.deliveredAt)
                : formatTime(msg.createdAt)}
            </small>

            <strong
              className={
                msg.status === "seen"
                  ? "text-primary"
                  : "text-muted"
              }
            >
              {msg.status === "sent" && <BsCheck />}
              {(msg.status === "delivered" ||
                msg.status === "seen") && <BsCheckAll />}
            </strong>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* ===== SELECTED FILE PREVIEW ===== */}
  {selectedFiles.length > 0 && (
    <div className="p-2 border-top bg-light d-flex gap-2 flex-wrap">
      {selectedFiles.map((item, index) => (
        <div key={index} className="position-relative shadow-sm">

          {item.type.startsWith("image/") && (
            <img
              src={item.preview}
              className="rounded"
              width="80"
              height="80"
              style={{ objectFit: "cover" }}
            />
          )}

          {item.type.startsWith("video/") && (
            <video
              src={item.preview}
              width="100"
              height="80"
              className="rounded"
              controls
            />
          )}

          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
            onClick={() =>
              setSelectedFiles((prev) =>
                prev.filter((_, i) => i !== index)
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
    <div className="d-flex align-items-center gap-2">

      {/* Upload */}
      {role === "customer" && (
        <label className="btn btn-light mb-0 rounded-circle shadow-sm">
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

      {/* Message Input */}
      <input
        type="text"
        className="form-control rounded-pill"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Send Button */}
      <button
        className="btn btn-primary rounded-circle px-3"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} /> : <IoMdSend />}
      </button>
    </div>
  </div>
</div>

  );
};

export default ChatSection;

