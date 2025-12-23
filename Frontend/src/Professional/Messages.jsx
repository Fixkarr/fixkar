import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Messages = () => {
  const {onlineUsers} = useSelector(state=>state.chat)
  const {currentUserData}  = useSelector(state=>state.user);
  const role = currentUserData?.user?.userId?.role;
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMyConversation = async () => {
      try {
        const result = await axios.get(
          `${server_url}/api/messages/get-my-conversations`,
          { withCredentials: true }
        );
        setConversations(result?.data?.conversations);
        console.log(result?.data?.conversations)  
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchMyConversation();
  }, []);

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white">
        <h6 className="mb-0 fw-semibold">Messages</h6>
      </div>

      <div className="list-group list-group-flush">
        {conversations?.map((chat) => (
          <button
            key={chat.user._id}
            className="list-group-item list-group-item-action d-flex align-items-center gap-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(role == "professional" ? `/professional/chat/${chat.user._id}` : `/customer/chat/${chat.user._id}`)}
          >
            {/* Avatar */}
            <div className="position-relative">
              <img
                src="/Images/placeholderProfile.avif"
                alt={chat.user.fullName}
                width="45"
                height="45"
              />
              <span
                className={`position-absolute bottom-0 end-0 rounded-circle border border-white ${
                  isOnline(chat.user._id) ? "bg-success" : "bg-secondary"
                }`}
                style={{ width: "12px", height: "12px" }}
              ></span>
            </div>

            {/* Message Info */}
            <div className="flex-grow-1 overflow-hidden">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 text-truncate">{chat.user.fullName}</h6>
                {chat.unseenCount > 0 && (
                  <span className="badge bg-primary rounded-pill">
                    {chat.unseenCount}
                  </span>
                )}
              </div>
              <small className="text-muted text-truncate d-block">
                {chat.lastMessage}
              </small>
            </div>
          </button>
        ))}

        {(!conversations || conversations.length === 0) && (
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center"
            style={{ height: "75vh" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
              alt="No messages"
              width="120"
              className="mb-3 opacity-75"
            />

            <h6 className="fw-semibold text-muted mb-1">
              No conversations yet
            </h6>

            <p className="text-muted small mb-0">
              When customers message you, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
