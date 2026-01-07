import React from "react";
import {
  FaTools,
  FaPlus,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";
import AddServiceForm from "./Utils/AddServiceForm";
import useGetServices from "../../hooks/useGetServices";
import { useSelector } from "react-redux";

const AdminServices = () => {

  useGetServices()
  const {services} = useSelector(state => state.services);
  return (
    <div className="container-fluid py-4"
       style={{
          background: "linear-gradient(135deg, #0f2027, #2c5364)",
          minHeight : "100vh"
        }}
    > 
      {/* ================= HEADER ================= */}
      <div
        className="card border-0 shadow-lg rounded-4 mb-4 text-white"
        style={{
          background: "linear-gradient(135deg, #0f2027, #2c5364)",
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1">
                <FaTools className="me-2 text-warning" />
              Services Management
            </h4>
            <p className="mb-0 text-light opacity-75">
              Manage all platform services & professionals
            </p>
          </div>

          <button className="btn btn-warning fw-semibold px-4 rounded-pill shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#AddServiceModal"
          >
            <FaPlus className="me-2" />
            Add New Service
          </button>


          <div className="modal fade" id="AddServiceModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Add Service</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <AddServiceForm/>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Description</th>
                <th className="text-center">
                  <FaUsers className="me-1" />
                  Professionals
                </th>
                <th className="text-center">
                  <FaInfoCircle />
                </th>
              </tr>
            </thead>

            <tbody>
              {services.length > 0 ? (
                services?.map((service, index) => (
                  <tr key={service._id || index}>
                    {/* Index */}
                    <td className="fw-semibold">{index + 1}</td>

                    {/* Service Image + Name */}
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={service.image}
                          alt={service.name}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          className="shadow-sm"
                        />
                        <span className="fw-semibold">
                          {service.name}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="text-muted">
                      {service.description}
                    </td>

                    {/* Professionals Count */}
                    <td className="text-center">
                      <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
                        {service.professionalCount}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-info rounded-pill px-3">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
