import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaGift,
} from "react-icons/fa";

import AllOffers from "./AllOffers";
import OfferForm from "./Utils/OfferForm";



const ManageOffers = () => {
  return (
    <div className="container py-3">
      <div
        className="card border-0 shadow-lg rounded-4"
        style={{
          background: "linear-gradient(135deg, #141E30, #243B55)",
        }}
      >
        {/* ===== HEADER ===== */}
        <div className="card-body border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold text-light mb-1">
              <FaGift className="me-2 text-warning" />
              Manage Offers
            </h5>
            <small className="text-light opacity-75">
              Create and manage platform discount offers
            </small>
          </div>
        </div>

        <div className="card-body bg-light">
              <OfferForm/>
        </div>

        <div className="card-body bg-light">
          <AllOffers/>
        </div>

        {/* ===== BODY ===== */}
        
      </div>
    </div>
  );
};

export default ManageOffers;
