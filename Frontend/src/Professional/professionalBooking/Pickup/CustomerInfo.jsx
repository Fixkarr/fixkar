import {FaUserCircle,FaCheckCircle,FaPhoneAlt,FaStar} from "react-icons/fa";

const CustomerInfo = () => {
    return (
        <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width:"60px",height:"60px"}}>
                    <FaUserCircle className="fs-1 text-primary"/>
                </div>
                <div className="ms-3">
                    <h5 className="fw-bold mb-1">Rahul Sharma</h5>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <span className="badge text-bg-success rounded-pill">
                            <FaCheckCircle className="me-1"/>
                            Verified
                        </span>
                        <span className="badge text-bg-light border text-dark rounded-pill">
                            <FaStar className="text-warning me-1"/>
                            4.8
                        </span>
                        <small className="text-secondary">
                            Requested 10 sec ago
                        </small>
                    </div>
                </div>
            </div>
            <button className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center" style={{width:"48px",height:"48px"}}>
                <FaPhoneAlt className="text-primary"/>
            </button>
        </div>
    );
};

export default CustomerInfo;