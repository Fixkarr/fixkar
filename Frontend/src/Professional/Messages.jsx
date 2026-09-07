import React from "react";
import { FaBell, FaClipboardList, FaHome, FaUserCircle } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import '../css/messages.css'
import useGetMyConversations from "../hooks/useGetMyConversations";
const Messages = () => {
  const navigate = useNavigate();
   const { currentUserData } = useSelector((state) => state.user);
  const role = currentUserData?.user?.userId?.role;
  useGetMyConversations();
  const {conversations} = useSelector(state => state.messages);

return (
  <div className="customer-conversations-page">

    {/* 🔵 COMPACT PREMIUM HEADER */}
    <section className="customer-conversations-hero">

      <div className="customer-conversations-glow customer-conversations-glow-one" />
      <div className="customer-conversations-glow customer-conversations-glow-two" />

      <div className="customer-conversations-hero-content">

        <div className="customer-conversations-eyebrow">
          <span className="customer-conversations-live-dot" />
          MESSAGES
        </div>

        <h2>My Conversations</h2>

        <p>
          Your recent conversations
        </p>

      </div>
    </section>


    {/* 🔵 MESSAGE LIST CONTAINER */}
    <section className="customer-conversations-section">

      <div className="customer-conversations-container">

        <div className="customer-conversations-card">

          {/* EMPTY STATE */}
          {conversations.length === 0 && (
            <div className="customer-conversations-empty">

              <div className="customer-conversations-empty-icon">
                <FaUserCircle />
              </div>

              <h6>No recent messages</h6>

              <p>
                Conversations will appear here
              </p>

            </div>
          )}


          {/* CONVERSATION LIST */}
          {conversations?.map((conv, index) => (
            <div
              key={conv.user._id}
              className={`customer-conversation-item ${
                index !== conversations.length - 1
                  ? "customer-conversation-divider"
                  : ""
              }`}
              onClick={() => navigate(`/${role}/chat/${conv.user._id}`)}
            >

              {/* Avatar */}
              <div className="customer-conversation-avatar-wrap">

                {conv.user.profilePicture ? (
                  <img
                    src={conv.user.profilePicture}
                    alt="profile"
                    className="customer-conversation-avatar"
                  />
                ) : (
                  <FaUserCircle className="customer-conversation-avatar-fallback" />
                )}

                <span
                  className={`customer-conversation-online ${
                    conv.isOnline
                      ? "customer-conversation-online-active"
                      : "customer-conversation-online-offline"
                  }`}
                />

              </div>


              {/* Message Info */}
              <div className="customer-conversation-content">

                <div className="customer-conversation-top">

                  <h6>
                    {conv.user.fullName}
                  </h6>

                  <small>
                    {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>

                </div>


                <div className="customer-conversation-bottom">

                  <p>
                    <BsCheck2All />
                    <span>{conv.lastMessage}</span>
                  </p>

                  {conv.unseenCount > 0 && (
                    <span className="customer-conversation-unread">
                      {conv.unseenCount}
                    </span>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>

  </div>
);
};

export default Messages;
