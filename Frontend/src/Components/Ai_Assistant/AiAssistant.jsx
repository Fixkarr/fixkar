import { useEffect, useRef, useState } from "react";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaSearch,
  FaCalendarCheck,
  FaCreditCard,
  FaHeadset,
  FaUserCircle,
  FaChevronRight,
  FaMapMarkerAlt,
  FaBolt,
} from "react-icons/fa";
import { MdVerified, MdOutlineTrackChanges } from "react-icons/md";
import "./AiAssistant.css";
import { server_url } from "../../App";
import axios from 'axios'

const quickActions = [
  {
    id: "find-service",
    title: "Find a service",
    description: "Find professionals near you",
    icon: <FaSearch />,
    message: "I want to find a service professional near me.",
    className: "service",
  },
  {
    id: "booking",
    title: "My booking",
    description: "Check your booking",
    icon: <FaCalendarCheck />,
    message: "I want help with my booking.",
    className: "booking",
  },
  {
    id: "track",
    title: "Track booking",
    description: "Check booking status",
    icon: <MdOutlineTrackChanges />,
    message: "I want to track my booking.",
    className: "tracking",
  },
  {
    id: "payment",
    title: "Payment help",
    description: "Payment or refund issue",
    icon: <FaCreditCard />,
    message: "I need help with a payment or refund.",
    className: "payment",
  },
];

const initialMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm Fixkar AI. I can help you find professionals, manage bookings, understand payments, and get support on Fixkar.",
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);

  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const sendMessage = async (message = input) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${server_url}/api/ai/chat`,
         {
        message: trimmedMessage,
      },
       {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );

      const aiResponse = response.data?.reply

     setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content:
         aiResponse ||
          "Sorry, I couldn't generate a response right now.",
      },
    ]);
    } catch (error) {
      console.error("Fixkar AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again or contact Fixkar support.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (message) => {
    sendMessage(message);
  };

  return (
    <>
      {/* =========================
          FLOATING AI BUTTON
      ========================== */}

      {!isOpen && (
        <button
          type="button"
          className="fixkar-ai-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open Fixkar AI Assistant"
        >
          <span className="fixkar-ai-launcher-ring"></span>

          <span className="fixkar-ai-launcher-icon">
            <FaRobot size={20}/>
          </span>

          <span className="fixkar-ai-notification">1</span>

          <span className="fixkar-ai-tooltip">
            Need help? Ask Fixkar AI
          </span>
        </button>
      )}

      {/* =========================
          AI CHAT
      ========================== */}

      {isOpen && (
        <div className="fixkar-ai-wrapper">
          <div className="fixkar-ai-panel">

            {/* HEADER */}

            <div className="fixkar-ai-header">
              <div className="fixkar-ai-brand">
                <div className="fixkar-ai-avatar">
                  <FaRobot />
                  <span className="fixkar-ai-online"></span>
                </div>

                <div>
                  <h5>Fixkar AI</h5>

                  <div className="fixkar-ai-status">
                    <span></span>
                    Online · Ready to help
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="fixkar-ai-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Fixkar AI"
              >
                <FaTimes />
              </button>
            </div>

            {/* CONTEXT BANNER */}

            <div className="fixkar-ai-context">
              <div className="fixkar-ai-context-icon">
                <FaBolt />
              </div>

              <div>
                <strong>Your Fixkar assistant</strong>

                <p>
                  Find services, manage bookings and get
                  instant help.
                </p>
              </div>
            </div>

            {/* MESSAGES */}

            <div
              ref={messagesRef}
              className="fixkar-ai-messages"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`fixkar-ai-message ${
                    message.role === "user"
                      ? "fixkar-ai-user-message"
                      : "fixkar-ai-bot-message"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="fixkar-ai-message-avatar">
                      <FaRobot />
                    </div>
                  )}

                  <div
                    className={`fixkar-ai-bubble ${
                      message.role === "user"
                        ? "fixkar-ai-user-bubble"
                        : "fixkar-ai-bot-bubble"
                    } ${
                      message.error
                        ? "fixkar-ai-error-bubble"
                        : ""
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.role === "user" && (
                    <div className="fixkar-ai-user-avatar">
                      <FaUserCircle />
                    </div>
                  )}
                </div>
              ))}

              {/* TYPING */}

              {loading && (
                <div className="fixkar-ai-message fixkar-ai-bot-message">
                  <div className="fixkar-ai-message-avatar">
                    <FaRobot />
                  </div>

                  <div className="fixkar-ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}

            {!loading && messages.length === 1 && (
              <div className="fixkar-ai-actions">
                <div className="fixkar-ai-section-title">
                  <span>How can I help?</span>
                </div>

                <div className="fixkar-ai-action-grid">
                  {quickActions.map((action) => (
                    <button
                      type="button"
                      key={action.id}
                      className="fixkar-ai-action"
                      onClick={() =>
                        handleQuickAction(action.message)
                      }
                    >
                      <div
                        className={`fixkar-ai-action-icon ${action.className}`}
                      >
                        {action.icon}
                      </div>

                      <div className="fixkar-ai-action-content">
                        <strong>{action.title}</strong>
                        <span>{action.description}</span>
                      </div>

                      <FaChevronRight className="fixkar-ai-action-arrow" />
                    </button>
                  ))}
                </div>

                <div className="fixkar-ai-trust">
                  <MdVerified />
                  <span>
                    Get help with your Fixkar experience
                  </span>
                </div>
              </div>
            )}

            {/* INPUT */}

            <form
              className="fixkar-ai-input-section"
              onSubmit={handleSubmit}
            >
              <div className="fixkar-ai-input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Fixkar AI anything..."
                  disabled={loading}
                />

                <button
                  type="submit"
                  className="fixkar-ai-send"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                >
                  <FaPaperPlane />
                </button>
              </div>

              <div className="fixkar-ai-input-footer">
                <span>
                  <FaHeadset />
                  Fixkar Support Assistant
                </span>

                <span>Enter to send</span>
              </div>
            </form>

            {/* FOOTER */}

            <div className="fixkar-ai-footer">
              <span>
                <FaMapMarkerAlt />
                Built for your Fixkar experience
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}