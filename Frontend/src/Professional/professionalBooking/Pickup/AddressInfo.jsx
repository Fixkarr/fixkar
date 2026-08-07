import {FaMapMarkerAlt,FaDirections,FaFileAlt} from "react-icons/fa";

const AddressInfo=()=>{
    return(
        <div className="border rounded-4 p-3 mb-4 bg-white">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex">
                    <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width:"46px",height:"46px"}}>
                        <FaMapMarkerAlt className="text-danger"/>
                    </div>
                    <div className="ms-3">
                        <small className="text-secondary d-block">Customer Address</small>
                        <p className="fw-semibold mb-0">
                            B-32, Lanka Road, Near BHU Main Gate, Varanasi
                        </p>
                    </div>
                </div>
                <button className="btn btn-outline-primary btn-sm rounded-pill">
                    <FaDirections className="me-2"/>
                    Map
                </button>
            </div>

            <hr className="my-3"/>

            <div className="d-flex">
                <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width:"46px",height:"46px"}}>
                    <FaFileAlt className="text-warning"/>
                </div>
                <div className="ms-3">
                    <small className="text-secondary d-block">Problem Description</small>
                    <p className="mb-0">
                        Switch board se spark aa raha hai aur MCB baar-baar trip ho rahi hai. Jaldi repair ki zarurat hai.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddressInfo;