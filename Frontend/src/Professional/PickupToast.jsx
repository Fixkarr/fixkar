import { FaMapMarkerAlt, FaArrowRight, FaTools, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PickupToast = ({ data, closeToast }) => {
    console.log("taost :", data);
    const navigate = useNavigate();

    const handleView = () => {
        navigate("/professional/pickup");
        closeToast?.();
    };

    return (
         <div
            className="position-fixed top-0 end-0 m-3"
            style={{
                width: "380px",
                maxWidth: "calc(100vw - 30px)",
                zIndex: 99999
            }}
        >
            <div className="bg-white border rounded-4 shadow-lg p-3">
        <div className="d-flex">
            <div
                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 48, height: 48 }}
            >
                <FaUserCircle className="fs-3 text-primary" />
            </div>

            <div className="ms-3 flex-grow-1">

                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">
                        New Pickup Request
                    </h6>

                    <span className="badge text-bg-danger">
                        Live
                    </span>
                </div>

                <small className="text-secondary d-block mt-1">
                    {data?.customerName}
                </small>

                <div className="d-flex flex-wrap gap-2 mt-2">

                    <span className="badge text-bg-light border text-dark">
                        <FaTools className="me-1 text-primary" />
                        {data?.serviceName}
                    </span>

                    <span className="badge text-bg-light border text-dark">
                        <FaMapMarkerAlt className="me-1 text-danger" />
                        {data?.distanceInKm} km
                    </span>

                </div>

                <button
                    onClick={handleView}
                    className="btn btn-primary btn-sm mt-3 w-100 fw-semibold"
                >
                    View Request
                    <FaArrowRight className="ms-2" />
                </button>

            </div>
        </div>
        </div>
        </div>
    );
};

export default PickupToast;