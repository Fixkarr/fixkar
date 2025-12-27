import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCircle, FaRegCommentDots } from "react-icons/fa";

const Messages = () => {
  const { onlineUsers } = useSelector((state) => state.chat);
  const { currentUserData } = useSelector((state) => state.user);

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
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchMyConversation();
  }, []);

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="mt-2 p-2 card border-0 shadow rounded-4 h-100">
      
      {/* ===== Header ===== */}
      <div className="card-header bg-primary text-white rounded-top-4 d-flex align-items-center gap-2">
        <FaRegCommentDots />
        <h6 className="mb-0 fw-semibold">Messages</h6>
      </div>

      {/* ===== Chat List ===== */}
      <div className="list-group list-group-flush">

        {conversations?.map((chat) => (
          <button
            key={chat.user._id}
            className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3"
            onClick={() =>
              navigate(
                role === "professional"
                  ? `/professional/chat/${chat.user._id}`
                  : `/customer/chat/${chat.user._id}`
              )
            }
          >
            {/* Avatar */}
            <div className="position-relative">
              <img
                src="/Images/placeholderProfile.avif"
                alt={chat.user.fullName}
                width="48"
                height="48"
                className="rounded-circle object-fit-cover border"
              />

              <FaCircle
                className={`position-absolute bottom-0 end-0 border border-white ${
                  isOnline(chat.user._id)
                    ? "text-success"
                    : "text-secondary"
                }`}
                style={{ fontSize: "10px" }}
              />
            </div>

            {/* Chat Info */}
            <div className="flex-grow-1 overflow-hidden text-start">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold text-truncate">
                  {chat.user.fullName}
                </h6>

                {chat.unseenCount > 0 && (
                  <span className="badge bg-primary rounded-pill px-2">
                    {chat.unseenCount}
                  </span>
                )}
              </div>

              <small className="text-muted text-truncate d-block">
                {chat.lastMessage || "No messages yet"}
              </small>
            </div>
          </button>
        ))}

        {/* ===== Empty State ===== */}
        {(!conversations || conversations.length === 0) && (
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center px-3"
            style={{ height: "70vh" }}
          >
            <FaRegCommentDots
              size={60}
              className="text-primary opacity-50 mb-3"
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
