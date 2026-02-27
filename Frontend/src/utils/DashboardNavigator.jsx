import React from 'react'
import { FaBell, FaClipboardList, FaHome, FaUser } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { MdOutlineEngineering } from 'react-icons/md';
import { useSelector } from 'react-redux';

const DashboardNavigator = () => {
     const { currentUserData } = useSelector((state) => state.user);
  const role = currentUserData?.user?.userId?.role;
  return (
    <div className="d-flex gap-3 fs-5">
                 <FaHome role="button" size={20} onClick={() => navigate(`/${role}/home`)} />
                 <FaClipboardList
                   role="button"
                   size={20}
                   onClick={() => navigate(`/${role}/bookings`)}
                 />
                 <FaBell
                   role="button"
                   size={20}
                   onClick={() => navigate(`/${role}/notifications`)}
                 />
                 {role === "customer" && <MdOutlineEngineering
                   size={20}
                   role="button"
                   onClick={() => navigate("/customer/hire-professionals")}
                 />}
                 {role === "professional" && <FaUser
                   size={20}
                   role="button"
                   onClick={() => navigate("/professional/profile")}
                 />}
                  <FaMessage
                           role="button"
                           size={20}
                           onClick={()=>navigate(`/${role}/messages`)}
                         />

               </div>
  )
}

export default DashboardNavigator
