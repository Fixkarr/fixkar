import React from "react";
import {
    FaMapMarkerAlt,
    FaDirections,
    FaFileAlt,
    FaExternalLinkAlt,
} from "react-icons/fa";

const AddressInfo = ({ request }) => {
    const address =
        request?.workAddress || "Address not available";

    const description =
        request?.problemDescription || "No problem description provided.";

    const lat = request?.customerLocation?.customerLat;
    const lng = request?.customerLocation?.customerLng;

    const hasLocation =
        Number.isFinite(Number(lat)) &&
        Number.isFinite(Number(lng));

    const openMap = () => {
        if (!hasLocation) return;

        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="bg-white border rounded-4 p-3 shadow-sm mb-4">

            {/* CUSTOMER ADDRESS */}
            <div className="d-flex align-items-start">

                <div
                    className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                        width: "46px",
                        height: "46px",
                    }}
                >
                    <FaMapMarkerAlt className="text-danger" />
                </div>

                <div className="ms-3 flex-grow-1">

                    <small className="text-secondary d-block mb-1">
                        Customer Address
                    </small>

                    <p className="fw-semibold mb-2">
                        {address}
                    </p>

                    {/* MAP BUTTON */}
                    <button
                        type="button"
                        onClick={openMap}
                        disabled={!hasLocation}
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center gap-2"
                    >
                        <FaDirections />

                        {hasLocation
                            ? "Open Map"
                            : "Location unavailable"}

                        {hasLocation && (
                            <FaExternalLinkAlt size={10} />
                        )}
                    </button>

                    {/* COORDINATES */}
                    {hasLocation && (
                        <small className="text-muted d-block mt-2">
                            {Number(lat).toFixed(5)},{" "}
                            {Number(lng).toFixed(5)}
                        </small>
                    )}

                </div>
            </div>

            <hr className="my-3" />

            {/* PROBLEM DESCRIPTION */}
            <div className="d-flex align-items-start">

                <div
                    className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                        width: "46px",
                        height: "46px",
                    }}
                >
                    <FaFileAlt className="text-warning" />
                </div>

                <div className="ms-3 flex-grow-1">

                    <small className="text-secondary d-block mb-1">
                        Problem Description
                    </small>

                    <p
                        className="mb-0 text-dark"
                        style={{
                            lineHeight: "1.6",
                        }}
                    >
                        {description}
                    </p>

                </div>
            </div>

        </div>
    );
};

export default AddressInfo;
