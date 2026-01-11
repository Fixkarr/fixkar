import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import useGetMyConversations from "../hooks/useGetMyConversations";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  useGetMyConversations();
   const { currentUserData } = useSelector((state) => state.user);
  const role = currentUserData?.user?.userId?.role;
  const {conversations} = useSelector(state => state.messages);
  console.log(conversations);
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">

      {/* Header */}
      <div
        className="px-4 py-3 text-white rounded-top-4"
        style={{
          background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        }}
      >
        <h6 className="mb-0 fw-semibold">Messages</h6>
        <small className="opacity-75">Recent conversations</small>
      </div>

      {/* Body */}
      <div className="card-body p-0">

        {/* Placeholder */}
        {conversations.length === 0 && (
          <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
            <FaUserCircle size={64} className="text-muted mb-3" />
            <h6 className="fw-semibold mb-1">No recent messages</h6>
            <p className="text-muted small mb-0">
              Start a conversation to see messages here
            </p>
          </div>
        )}

        {/* Conversation List */}
        {conversations?.map((conv) => (
          <div
            key={conv.user._id}
            className="d-flex align-items-center px-3 py-3 border-bottom message-item"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/${role}/chat/${conv.user._id}`)}
          >
            {/* Avatar */}
            <div className="position-relative me-3">
              {conv.user.profilePicture ? (
                <img
                  src={conv.user.profilePicture}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: 48, height: 48, objectFit: "cover" }}
                />
              ) : (
                <FaUserCircle size={48} className="text-secondary" />
              )}

              {/* Online indicator */}
              <span
                className={`position-absolute bottom-0 end-0 rounded-circle border border-white ${
                  conv.isOnline ? "bg-success" : "bg-secondary"
                }`}
                style={{ width: 12, height: 12 }}
              />
            </div>

            {/* Message Info */}
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold text-dark">
                  {conv.user.fullName}
                </h6>
                <small className="text-muted">
                  {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-1">
                <p className="mb-0 text-muted small text-truncate">
                  <BsCheck2All className="me-1 text-primary" />
                  {conv.lastMessage}
                </p>

                {/* Unread Count */}
                {conv.unseenCount > 0 && (
                  <span className="badge bg-danger rounded-pill ms-2">
                    {conv.unseenCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Messages;
