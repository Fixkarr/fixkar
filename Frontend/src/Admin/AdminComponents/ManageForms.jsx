import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaWpforms,
  FaPlusCircle,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaLayerGroup
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { server_url } from "../../App";
import DynamicForm from "./Utils/DynamicForm";
const adminpath = import.meta.env.VITE_ADMIN_PATH

const ManageForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${server_url}/api/admin/get-all-forms`,
        { withCredentials: true }
      );
      setForms(res.data.forms || []);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  console.log(forms);

  return (
    <div className="container py-3">
      <div
        className="card border-0 shadow-lg rounded-4"
        style={{
          background: "linear-gradient(135deg, #0f2027, #2c5364)",
        }}
      >
        {/* ===== HEADER ===== */}
        <div className="card-body border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold text-light mb-1">
              <FaWpforms className="me-2 text-primary" />
              Manage Forms
            </h5>
            <small className="text-light opacity-75">
              Create and manage dynamic forms for Fixkar
            </small>
          </div>

          <button
            className="btn btn-success rounded-pill fw-semibold"
            onClick={() => navigate(`${adminpath}/manage-forms/create`)}
          >
            <FaPlusCircle className="me-2" />
            Create Form
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="card-body bg-light">
          {loading ? (
            <div className="text-center py-5">
              <ClipLoader size={35} />
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No forms created yet
            </div>
          ) : (
            <div className="container">
                  {forms.map((form) => (
                   <DynamicForm form={form}/>
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageForms;
