import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaGift,
  FaPlusCircle,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaPercentage
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { server_url } from "../../App";
import DynamicForm from "./Utils/DynamicForm";

const adminpath = import.meta.env.VITE_ADMIN_PATH;

const ManageOffers = () => {
  const [offersForm, setOffersForm] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchOffersForm = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${server_url}/api/admin/get-offer-forms`,
        { withCredentials: true }
      );
      setOffersForm(res.data.offerForms || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersForm();
  }, []);

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

        {/* ===== BODY ===== */}
        <div className="card-body bg-light">
          {loading ? (
            <div className="text-center py-5">
              <ClipLoader size={35} />
            </div>
          ) : offersForm.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No offers created yet
            </div>
          ) : (
            <div className="row">
              {offersForm?.map((offerForm) => (
                <DynamicForm form={offerForm}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOffers;
