import {FaCheck,FaTimes,FaClock} from "react-icons/fa";

const ActionButtons=()=>{
    return(
        <>
            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-secondary d-flex align-items-center">
                        <FaClock className="me-2 text-danger"/>
                        Auto Reject
                    </small>
                    <strong className="text-danger">18 sec</strong>
                </div>

                <div className="progress" style={{height:"8px"}}>
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                        style={{width:"35%"}}
                    />
                </div>
            </div>

            <div className="row g-2">
                <div className="col-6">
                    <button className="btn btn-outline-danger w-100 rounded-3 py-3 fw-semibold">
                        <FaTimes className="me-2"/>
                        Reject
                    </button>
                </div>

                <div className="col-6">
                    <button className="btn btn-primary w-100 rounded-3 py-3 fw-semibold">
                        <FaCheck className="me-2"/>
                        Accept
                    </button>
                </div>
            </div>
        </>
    );
};

export default ActionButtons;