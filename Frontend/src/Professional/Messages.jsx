import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
   const { currentUserData } = useSelector((state) => state.user);
  const role = currentUserData?.user?.userId?.role;
  const {conversations} = useSelector(state => state.messages);
return (
<div
  className="min-vh-100"
  style={{
    background: "linear-gradient(180deg,#f8fbff,#eef4ff)"
  }}
>

  {/* 🔵 PREMIUM HEADER */}
  <div
    className="px-4 pt-4 pb-4"
    style={{
      background: "linear-gradient(135deg,#0d6efd,#3a86ff)",
      borderBottomLeftRadius: "30px",
      borderBottomRightRadius: "30px"
    }}
  >
    <h5 className="text-white fw-bold mb-1">Messages</h5>
    <small className="text-white opacity-75">
      Your recent conversations
    </small>
  </div>


  {/* 🔵 MESSAGE LIST CONTAINER */}
  <div className="container py-4">

    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

      {/* EMPTY STATE */}
      {conversations.length === 0 && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <FaUserCircle size={70} className="text-secondary mb-3" />
          <h6 className="fw-semibold mb-1">No recent messages</h6>
          <p className="text-muted small mb-0">
            Conversations will appear here
          </p>
        </div>
      )}


      {/* CONVERSATION LIST */}
      {conversations?.map((conv, index) => (
        <div
          key={conv.user._id}
          className={`d-flex align-items-center px-4 py-3 ${
            index !== conversations.length - 1 ? "border-bottom" : ""
          }`}
          style={{
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onClick={() => navigate(`/${role}/chat/${conv.user._id}`)}
        >

          {/* Avatar */}
          <div className="position-relative me-3">
            {conv.user.profilePicture ? (
              <img
                src={conv.user.profilePicture}
                alt="profile"
                className="rounded-circle shadow-sm"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover"
                }}
              />
            ) : (
              <FaUserCircle size={50} className="text-secondary" />
            )}

            {/* Online Indicator */}
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

              {conv.unseenCount > 0 && (
                <span
                  className="badge rounded-pill"
                  style={{
                    background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
                    fontSize: "0.7rem",
                    padding: "6px 8px"
                  }}
                >
                  {conv.unseenCount}
                </span>
              )}

            </div>
          </div>

        </div>
      ))}

    </div>

  </div>

</div>
);
};

export default Messages;
