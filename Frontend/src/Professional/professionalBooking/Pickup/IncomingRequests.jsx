import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaInbox, FaBell } from "react-icons/fa";
import IncomingBooking from "./IncomingBooking";
import { useGetPickupRequests } from "../../../hooks/useGetPickupRequests";
import WaitingForCustomerConfirmation from "./WaitingForCustomerConfirmation";
import { removeWaitingForCustomerConfirmation } from "../../../redux/pickup.slice";

const IncomingRequests = () => {
    const dispatch = useDispatch();
    useGetPickupRequests();

    const { incomingRequests, waitingForCustomerConfirmation } = useSelector(
        (state) => state.pickup
    );

    console.log( "requets : ",incomingRequests);

    return (
        <section className="container-fluid min-vh-100 bg-light py-3 py-md-4">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h5 className="fw-bold mb-1">
                            Pickup Requests
                        </h5>

                        <small className="text-muted">
                            Nearby customers are looking for professionals
                        </small>
                    </div>

                    <div className="position-relative">
                        <FaBell
                            className="text-primary"
                            size={22}
                        />

                        {incomingRequests.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {incomingRequests.length}
                            </span>
                        )}
                    </div>
                </div>

                {waitingForCustomerConfirmation.length > 0 && (
                    <div className="d-flex flex-column gap-3 mb-4">
                        {waitingForCustomerConfirmation.map((request) => (
                            <WaitingForCustomerConfirmation
                                key={request.pickupRequestId || request._id}
                                request={request}
                                onExpired={() => dispatch(removeWaitingForCustomerConfirmation(request.pickupRequestId || request._id))}
                            />
                        ))}
                    </div>
                )}

                {incomingRequests.length === 0 && waitingForCustomerConfirmation.length === 0 ? (
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center py-5">
                            <div
                                className="mx-auto mb-3 rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                                style={{
                                    width: "64px",
                                    height: "64px",
                                }}
                            >
                                <FaInbox size={25} />
                            </div>

                            <h6 className="fw-bold">
                                No pickup requests
                            </h6>

                            <p className="text-muted small mb-0">
                                New nearby service requests will appear here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {incomingRequests.map((request) => (
                            <IncomingBooking
                                key={request.pickupRequestId}
                                request={request}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default IncomingRequests;
