import { IoCallOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import ProfessionalAchievementBadge from "./ProfessionalAchievementBadge";
import '../css/professional-public-profile.css'

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
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <ProfessionalAchievementBadge
        professional={professionalInfo}
        variant="dark"
      />
      <button
        onClick={handleCallClick}
        className="public-profile__hero-action"
      >
        <IoCallOutline /> Call
      </button>
    </div>
  );
};

export default CallButton;
