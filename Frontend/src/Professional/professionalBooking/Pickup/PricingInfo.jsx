import React from "react";
import {
    FaWallet,
    FaRupeeSign,
    FaTools,
    FaMapMarkerAlt,
} from "react-icons/fa";

const PricingInfo = ({ request }) => {
    const taskPrice = Number(request?.charge?.taskPrice) || 0;
    const visitingCharge = Number(request?.charge?.visitingCharge) || 0;
    const totalAmount = Number(request?.charge?.totalAmount) || 0;

    return (
        <div className="bg-primary text-white rounded-4 p-3 p-md-4 mb-4 shadow-sm">

            {/* HEADER */}
            <div className="d-flex align-items-center justify-content-between gap-3 mb-3">

                <div className="d-flex align-items-center">

                    <div
                        className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                            width: "48px",
                            height: "48px",
                        }}
                    >
                        <FaWallet size={20} />
                    </div>

                    <div className="ms-3">
                        <small className="opacity-75 d-block">
                            Estimated Earnings
                        </small>

                        <h3 className="fw-bold mb-0 d-flex align-items-center">
                            <FaRupeeSign size={19} />
                            {totalAmount.toLocaleString("en-IN")}
                        </h3>
                    </div>

                </div>

                <span className="badge bg-white text-primary rounded-pill px-3 py-2">
                    Fixed Price
                </span>

            </div>

            {/* PRICE BREAKDOWN */}
            <div className="bg-white bg-opacity-10 rounded-4 p-3">

                {/* VISITING CHARGE */}
                <div className="d-flex justify-content-between align-items-center gap-3">

                    <div className="d-flex align-items-center gap-2">
                        <FaMapMarkerAlt className="opacity-75" />

                        <span>
                            Visiting Charge
                        </span>
                    </div>

                    <span className="fw-semibold text-nowrap d-flex align-items-center">
                        <FaRupeeSign size={12} />
                        {visitingCharge.toLocaleString("en-IN")}
                    </span>

                </div>

                {/* TASK CHARGE */}
                <div className="d-flex justify-content-between align-items-center gap-3 mt-3">

                    <div className="d-flex align-items-center gap-2">
                        <FaTools className="opacity-75" />

                        <span>
                            Task Charge
                        </span>
                    </div>

                    <span className="fw-semibold text-nowrap d-flex align-items-center">
                        <FaRupeeSign size={12} />
                        {taskPrice.toLocaleString("en-IN")}
                    </span>

                </div>

                <hr className="border-light opacity-50 my-3" />

                {/* TOTAL */}
                <div className="d-flex justify-content-between align-items-center">

                    <div>
                        <strong className="d-block">
                            You'll Receive
                        </strong>

                        <small className="opacity-75">
                            Visiting + Task charge
                        </small>
                    </div>

                    <h4 className="fw-bold mb-0 d-flex align-items-center text-nowrap">
                        <FaRupeeSign size={18} />
                        {totalAmount.toLocaleString("en-IN")}
                    </h4>

                </div>

            </div>

            {/* NOTE */}
            <div className="mt-3 small opacity-75">
                Final amount is based on the charges shown above.
            </div>

        </div>
    );
};

export default PricingInfo;

