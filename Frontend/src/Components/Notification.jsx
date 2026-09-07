import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBullhorn,
  FaCalendarCheck,
  FaEnvelopeOpenText,
  FaBellSlash,
  FaCalendarTimes,
  FaHome,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";
import { LuCalendarCheck2 } from "react-icons/lu";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { RiMotorbikeFill } from "react-icons/ri";
import { formatDate } from "../utils/formatTime&Date";
import { server_url } from "../App";
import { setNotifications } from "../redux/notification.slice";
import { GiCardPickup } from "react-icons/gi";
import { PiHandsClappingDuotone } from "react-icons/pi";
import '../css/notification.css'
const getIcon = (type) => {
  switch (type) {
    case "announcement":
      return <FaBullhorn className="text-warning fs-5" />;
    case "booking_pending":
      return <MdOutlinePendingActions className="text-warning fs-5" />;
    case "booking_accepted":
      return <FaCalendarCheck className="text-primary fs-5" />;
    case "booking_rejected":
      return <FaCalendarTimes className="text-danger fs-5" />;
    case "booking_cancelled":
      return <FaRegCalendarXmark className="text-danger fs-5" />;
    case "booking_completed":
      return <LuCalendarCheck2 className="text-success fs-5" />;
    case "booking_reached":
      return <RiMotorbikeFill className="text-info fs-5" />;
    case "pickup_request":
      return <GiCardPickup className="text-info fs-5" />;
    case "pickup_accepted":
      return <PiHandsClappingDuotone  className="text-info fs-5" />;
    case "message":
      return <FaEnvelopeOpenText className="text-primary fs-5" />;
    default:
      return null;
  }
};

const Notifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAndMarkNotificationsRead = async () => {
      try {
        // Opening the notifications screen acknowledges every notification.
        await axios.patch(`${server_url}/api/notification/mark-all-as-read`, null, {
          withCredentials: true,
        });

        // Fetch after marking read so the badge receives the server's latest
        // unread count instead of a stale value.
        const result = await axios.get(
          `${server_url}/api/notification/get-my-notifications`,
          { withCredentials: true }
        );
        dispatch(setNotifications({
          notifications: result.data.notifications,
          unreadCount: result.data.unreadCount,
        }));
      } catch (error) {
        console.error("Could not load notifications", error);
      }
    };

    loadAndMarkNotificationsRead();
  }, [dispatch]);

  const navigate = useNavigate();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  const total = notifications?.length || 0;
  const {currentUserData} = useSelector(state=>state.user);
  const role = currentUserData?.user?.userId?.role;

 return (
  <>
    <div className="customer-notifications-page">

      {/* =========================================
          COMPACT HERO
      ========================================= */}
      <section className="customer-notifications-hero">

        <div className="customer-notifications-glow customer-notifications-glow-one" />
        <div className="customer-notifications-glow customer-notifications-glow-two" />

        <div className="customer-notifications-hero-content">

          <div className="customer-notifications-eyebrow">
            <span className="customer-notifications-live-dot" />
            FIXKAR UPDATES
          </div>

          <h2>Notifications</h2>

          <p>
            Stay updated with your Fixkar services
          </p>

        </div>
      </section>


      {/* =========================================
          STATS
      ========================================= */}
      {total > 0 && (
        <section className="customer-notifications-stats-section">

          <div className="customer-notifications-container">

            <div className="customer-notifications-stat-card">

              <div className="customer-notifications-stat-icon">
                <FaBell/>
              </div>

              <div className="customer-notifications-stat-content">
                <span>TOTAL NOTIFICATIONS</span>
                <strong>{total}</strong>
              </div>

            </div>

          </div>

        </section>
      )}


      {/* =========================================
          EMPTY STATE
      ========================================= */}
      {(!notifications || notifications.length === 0) && (
        <section className="customer-notifications-empty-section">

          <div className="customer-notifications-empty-card">

            <div className="customer-notifications-empty-icon">
              <FaBellSlash />
            </div>

            <h6>No notifications yet</h6>

            <p>
              You’re all caught up. New updates will appear here.
            </p>

          </div>

        </section>
      )}


      {/* =========================================
          NOTIFICATION LIST
      ========================================= */}
      {notifications && notifications.length > 0 && (
        <section className="customer-notifications-list-section">

          <div className="customer-notifications-container">

            <div className="customer-notifications-list-header">
              <div>
                <span>RECENT UPDATES</span>
                <h3>Your Notifications</h3>
              </div>

              <div className="customer-notifications-count">
                {total}
              </div>
            </div>

            <div className="customer-notifications-list">

              {notifications.map((item) => (
                <div
                  key={item._id}
                  className="customer-notification-card"
                >

                  <div className="customer-notification-icon">
                    {getIcon(item.type)}
                  </div>

                  <div className="customer-notification-content">

                    <h6>{item.title}</h6>

                    <p>{item.message}</p>

                    <small>
                      {formatDate(item.createdAt) || "Just now"}
                    </small>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>
      )}

    </div>
  </>
);
};

export default Notifications;
