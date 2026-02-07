import { IoCallOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CallButton = ({ currentUserData, professionalInfo }) => {
  const navigate = useNavigate();

  const handleCallClick = async () => {

    if (!currentUserData?.user?.userId) {
      navigate("/login");
      return;
    }

    window.location.href = `tel:${professionalInfo?.userId?.mobile}`;
  };

  return (
    <button
      onClick={handleCallClick}
      className="btn btn-outline-light btn-sm"
    >
      <IoCallOutline /> Call
    </button>
  );
};

export default CallButton;
