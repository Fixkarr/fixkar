import { IoCallOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

import '../Customer/professional-public-profile.css'

const CallButton = ({ currentUserData, professionalInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCallClick = async () => {
    if (!currentUserData?.user?.userId) {
      navigate("/login", {
        state: { from: location }
      });
      return;
    }

    window.location.href = `tel:${professionalInfo?.userId?.mobile}`;
  };

  return (
      <button
        onClick={handleCallClick}
        className="public-profile__hero-action"
      >
        <span className="public-profile__hero-action-icon">
          <IoCallOutline />
          </span> 
        <span>Call</span>
      </button>

  );
};

export default CallButton;
