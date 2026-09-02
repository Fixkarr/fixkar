import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import CustomerInfo from "./CustomerInfo";
import ServiceInfo from "./ServiceInfo";
import AddressInfo from "./AddressInfo";
import ActionButtons from "./ActionButtons";
import PricingInfo from "./PricingInfo";


import { server_url } from "../../../App";
import {
    addWaitingForCustomerConfirmation,
    removeIncomingRequest,
} from "../../../redux/pickup.slice";

const IncomingBooking = ({ request }) => {
    const dispatch = useDispatch();

    // Apne project ke according import/use karo

    // ==========================================
    // ACCEPT
    // ==========================================

    const handleAccept = async (request) => {
        try {
            const response = await axios.post(
                `${server_url}/api/user/professional/pickup-request-accept`,
                {
                    pickupRequestId:
                        request.pickupRequestId,
                },
                {
                    withCredentials: true,
                }
            );

            console.log(
                "Pickup accepted:",
                response.data
            );

            // Request ab pending nahi hai
            // isliye incoming list se remove karo
            dispatch(
                removeIncomingRequest(
                    request.pickupRequestId
                )
            );

            dispatch(
                addWaitingForCustomerConfirmation({
                    ...request,
                    ...response.data.pickupRequest,
                    pickupRequestId: request.pickupRequestId,
                    customerConfirmationExpiresAt:
                        response.data.customerConfirmationExpiresAt,
                })
            );

            toast.success(
                "Request accepted. Waiting for customer confirmation."
            );

        } catch (error) {
            console.error(
                "Accept pickup error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to accept request."
            );

            // ActionButtons ko pata chalega
            // ki API fail hui hai
            throw error;
        }
    };

    // ==========================================
    // REJECT
    // ==========================================

    const handleReject = async (request) => {
        try {
            const response = await axios.post(
                `${server_url}/api/user/professional/pickup-request-reject`,
                {
                    pickupRequestId:
                        request.pickupRequestId,
                },
                {
                    withCredentials: true,
                }
            );

            console.log(
                "Pickup rejected:",
                response.data
            );

            // Incoming list se remove
            dispatch(
                removeIncomingRequest(
                    request.pickupRequestId
                )
            );

            toast.info(
                "Pickup request rejected."
            );

        } catch (error) {
            console.error(
                "Reject pickup error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to reject request."
            );

            throw error;
        }
    };

    return (
        <section className="container-fluid bg-light min-vh-100 py-3 py-md-4">

            <div className="row justify-content-center">

                <div className="col-12 col-md-10 col-lg-8 col-xl-6">

                    <div className="card border-0 shadow rounded-4 overflow-hidden">

                        {/* HEADER */}

                        <div className="px-3 px-md-4 pt-3">

                            <span className="badge text-bg-danger rounded-pill px-3 py-2">
                                New Request
                            </span>

                        </div>

                        <div className="card-body p-3 p-md-4">

                            {/* CUSTOMER */}

                            <CustomerInfo
                                request={request}
                            />

                            {/* SERVICE */}

                            <ServiceInfo
                                request={request}
                            />

                            {/* ADDRESS + PROBLEM */}

                            <AddressInfo
                                request={request}
                            />

                            {/* PRICE */}

                            <PricingInfo
                                request={request}
                            />

                            {/* ACCEPT / REJECT */}

                            <ActionButtons
                                request={request}
                                onAccept={handleAccept}
                                onReject={handleReject}
                            />

                        </div>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default IncomingBooking;
