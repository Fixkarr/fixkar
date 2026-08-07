import {FaTools,FaMapMarkerAlt,FaClock,FaBolt} from "react-icons/fa";

const ServiceInfo = () => {
    return (
        <div className="row g-3 mb-4">
            <div className="col-12">
                <div className="border rounded-4 p-3 bg-white">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width:"50px",height:"50px"}}>
                            <FaTools className="text-primary"/>
                        </div>
                        <div className="ms-3">
                            <small className="text-secondary d-block">Service</small>
                            <h6 className="fw-bold mb-0">Electrician</h6>
                        </div>
                        <span className="badge text-bg-danger rounded-pill ms-auto">
                            <FaBolt className="me-1"/>
                            Urgent
                        </span>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="border rounded-4 p-3 h-100 bg-white">
                    <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="text-danger fs-5"/>
                        <div className="ms-2">
                            <small className="text-secondary d-block">Distance</small>
                            <span className="fw-semibold">2.1 km</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="border rounded-4 p-3 h-100 bg-white">
                    <div className="d-flex align-items-center">
                        <FaClock className="text-success fs-5"/>
                        <div className="ms-2">
                            <small className="text-secondary d-block">Reach Time</small>
                            <span className="fw-semibold">6 mins</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceInfo;