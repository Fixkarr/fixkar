import {FaWallet,FaRupeeSign} from "react-icons/fa";

const EarningsCard=()=>{
    return(
        <div className="card border-0 bg-primary text-white rounded-4 mb-4 shadow-sm">
            <div className="card-body p-3">
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{width:"48px",height:"48px"}}>
                        <FaWallet className="fs-5"/>
                    </div>
                    <div className="ms-3">
                        <small className="d-block opacity-75">Estimated Earnings</small>
                        <h5 className="fw-bold mb-0">₹350</h5>
                    </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-3 p-3">
                    <div className="d-flex justify-content-between">
                        <span>Visiting Charge</span>
                        <span className="fw-semibold">₹80</span>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                        <span>Task Charge</span>
                        <span className="fw-semibold">₹300</span>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                        <span>Platform Fee</span>
                        <span className="fw-semibold text-warning">- ₹30</span>
                    </div>

                    <hr className="border-light opacity-50"/>

                    <div className="d-flex justify-content-between align-items-center">
                        <strong>You'll Receive</strong>
                        <h4 className="fw-bold mb-0 d-flex align-items-center">
                            <FaRupeeSign className="me-1"/>
                            350
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsCard;