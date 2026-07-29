import React from "react";
import { FaWifi } from "react-icons/fa";
import { Network } from "@capacitor/network";
import { Capacitor } from "@capacitor/core";

const NoInternet = () => {

  const handleRetry = async () => {
    let isConnected = false;

    if (Capacitor.isNativePlatform()) {
      const status = await Network.getStatus();
      isConnected = status.connected;
    } else {
      isConnected = navigator.onLine;
    }

    if (isConnected) {
      window.location.reload();
    } else {
      alert("Still no internet connection.");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        background: "#fff",
        padding: "20px",
      }}
    >
      <FaWifi size={80} className="text-danger mb-3" />

      <h3 className="fw-bold">No Internet Connection</h3>

      <p className="text-muted text-center px-4 mb-4">
        Please check your internet connection and try again.
      </p>

      <button
        className="btn btn-primary px-4 py-2"
        onClick={handleRetry}
      >
        Retry
      </button>
    </div>
  );
};

export default NoInternet;