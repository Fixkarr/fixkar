import React from "react";
import { FaWifi } from "react-icons/fa";

const NoInternet = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ background: "#fff" }}
    >
      <FaWifi size={80} className="text-danger mb-3" />

      <h3>No Internet Connection</h3>

      <p className="text-muted text-center px-4">
        Please check your internet connection and try again.
      </p>
    </div>
  );
};

export default NoInternet;