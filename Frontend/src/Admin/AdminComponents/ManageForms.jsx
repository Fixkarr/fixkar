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
const adminpath = import.meta.env.VITE_ADMIN_PATH

const ManageForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${server_url}/api/admin/forms`,
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
            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Purpose</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {forms.map((form) => (
                    <tr key={form._id}>
                      <td>
                        <div className="fw-semibold">
                          <FaLayerGroup className="me-2 text-primary" />
                          {form.title}
                        </div>
                        <small className="text-muted">
                          {form.key}
                        </small>
                      </td>

                      <td>
                        <span className="badge bg-info text-dark px-3 py-2">
                          {form.purpose}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          v{form.version}
                        </span>
                      </td>

                      <td>
                        {form.isActive ? (
                          <span className="text-success fw-semibold">
                            <FaToggleOn className="me-1" />
                            Active
                          </span>
                        ) : (
                          <span className="text-danger fw-semibold">
                            <FaToggleOff className="me-1" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill"
                          onClick={() =>
                            navigate(`/admin/forms/edit/${form._id}`)
                          }
                        >
                          <FaEdit className="me-1" />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageForms;
