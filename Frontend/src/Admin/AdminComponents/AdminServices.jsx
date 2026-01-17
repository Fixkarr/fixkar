import React from "react";
import {
  FaTools,
  FaPlus,
  FaUsers,
  FaInfoCircle,
  FaPen,
} from "react-icons/fa";
import AddServiceForm from "./Utils/AddServiceForm";
import useGetServices from "../../hooks/useGetServices";
import { useSelector } from "react-redux";
import UpdateServiceForm from "./Utils/UpdateServiceForm";

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
             Manage all platform services & skills
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
       <div className="row g-4">
        {services?.length > 0 ? (
          services.map((service) => (
            <div className="col-xl-3 col-lg-4 col-md-6" key={service._id}>
              <div className="card border-0 shadow-lg rounded-4 h-100 service-card">
                {/* Image */}
                <img
                  src={service.image}
                  alt={service.name}
                  className="card-img-top rounded-top-4"
                  style={{ height: 160, objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  {/* Title */}
                  <h5 className="fw-bold mb-1">{service.name}</h5>
                  <p className="text-muted small">
                    {service.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-3">
                    {service.skills?.length > 0 ? (
                      service.skills.map((skill) => (
                        <span
                          key={skill._id}
                          className="badge bg-primary me-2 mb-2 px-3 py-2 rounded-pill"
                        >
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small">
                        No skills added
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-success px-3 py-2 rounded-pill">
                      <FaUsers className="me-1" />
                      {service.professionalCount} Pros
                    </span>

                     <button className="btn btn-outline-primary rounded-pill"
            data-bs-toggle="modal"
            data-bs-target="#UpdateServiceModal"
          >
            <FaPen className="me-2" />
            Update Service
          </button>
             <div className="modal fade" id="UpdateServiceModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Service</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <UpdateServiceForm serviceId={service._id}/>
      </div>
    </div>
  </div>
</div>

                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-white opacity-75 py-5">
            No services found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
