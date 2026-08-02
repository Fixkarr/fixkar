import React from 'react'
import { FaBell, FaClipboardList, FaHome, FaUserCircle } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { MdOutlineEngineering } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardNavigator = () => {
     const { currentUserData } = useSelector((state) => state.user);
  const unreadNotifications = useSelector(
    (state) => state.notifications.unreadCount
  );
  const unreadMessages = useSelector(
    (state) => state.messages.totalUnreadCount
  );
  const role = currentUserData?.user?.userId?.role;
  const navigate = useNavigate()

  const IconWithUnreadDot = ({ hasUnread, children, onClick, label }) => (
    <button
      type="button"
      aria-label={label}
      className="position-relative border-0 bg-transparent text-light p-0 d-flex"
      onClick={onClick}
    >
      {children}
      {hasUnread > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle bg-danger border border-white rounded-circle"
          style={{ width: 9, height: 9 }}
          aria-label={`${hasUnread} unread`}
        />
      )}
    </button>
  );

  return (
    <div className="d-flex gap-3 fs-5 text-light">
                 <FaHome role="button" size={20} onClick={() => navigate(`/${role}/home`)} />
                 <FaClipboardList
                   role="button"
                   size={20}
                   onClick={() => navigate(`/${role}/bookings`)}
                 />
                 <IconWithUnreadDot
                   hasUnread={unreadNotifications}
                   label="Notifications"
                   onClick={() => navigate(`/${role}/notifications`)}
                 >
                   <FaBell size={20} />
                 </IconWithUnreadDot>
                 <IconWithUnreadDot
                   hasUnread={unreadMessages}
                   label="Messages"
                   onClick={() => navigate(`/${role}/messages`)}
                 >
                   <FaMessage size={20} />
                 </IconWithUnreadDot>
                 {role === "customer" && <MdOutlineEngineering
                   size={20}
                   role="button"
                   onClick={() => navigate("/customer/hire-professionals")}
                 />}
                 {role === "professional" && <FaUserCircle
                   size={20}
                   role="button"
                   onClick={() => navigate("/professional/profile")}
                 />}
                

               </div>
  )
}

export default DashboardNavigator
