import React, { useMemo, useState } from "react";
import {
  FaTools,
  FaPlus,
  FaUsers,
  FaPen,
  FaChevronRight,
  FaSearch,
  FaTasks,
  FaPercentage,
  FaTimes,
  FaTrash
} from "react-icons/fa";  

import ServiceForm from "./Utils/ServiceForm";
import useGetServices from "../../hooks/useGetServices";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server_url } from "../../App";

const AdminServices = () => {
  const adminPath = import.meta.env.VITE_ADMIN_PATH;

  const { refetchServices } = useGetServices();
  const [deletingServiceId, setDeletingServiceId] =
  useState(null);

  const { services } = useSelector(
    (state) => state.services
  );

  const handleDeleteService = async (service) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${service.name}"?`
  );

  if (!confirmed) return;

  try {
    setDeletingServiceId(service._id);

    const response = await axios.delete(
      `${server_url}/api/admin/delete-service/${service._id}`,
      {
        withCredentials: true,
      }
    );

    toast.success(
      response.data?.message ||
        "Service deleted successfully"
    );

    // Modal/list ko refresh karne ke liye
    // tumhare existing useGetServices ko dobara
    // trigger karna better hoga.
      await refetchServices();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to delete service"
    );
  } finally {
    setDeletingServiceId(null);
  }
};
  const [selectedService, setSelectedService] =
    useState(null);

  const [serviceSearch, setServiceSearch] =
    useState("");

  // =========================================================
  // SERVICE SEARCH
  // =========================================================

  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();

    if (!query) {
      return services || [];
    }

    return (services || []).filter((service) => {
      const serviceName =
        service?.name?.toLowerCase() || "";

      const description =
        service?.description?.toLowerCase() || "";

      return (
        serviceName.includes(query) ||
        description.includes(query)
      );
    });
  }, [services, serviceSearch]);

  return (
    <div
      className="container-fluid min-vh-100 py-3 py-md-4"
      style={{
        background:
          "linear-gradient(180deg,#f5f7fb 0%,#eef2f7 100%)",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="container-fluid px-0">

        <div className="bg-white border rounded-4 shadow-sm p-3 p-md-4 mb-4">

          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">

            {/* LEFT */}

            <div className="d-flex align-items-center gap-3">

              <div
                className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary flex-shrink-0"
                style={{
                  width: "48px",
                  height: "48px",
                }}
              >
                <FaTools size={20} />
              </div>

              <div>
                <h4 className="fw-bold mb-1 text-dark">
                  Services Management
                </h4>

                <p className="text-secondary small mb-0">
                  Manage services, tasks and professional
                  availability from one place.
                </p>
              </div>

            </div>

            {/* RIGHT */}

            <button
              type="button"
              className="btn btn-primary rounded-3 px-4 fw-semibold"
              data-bs-toggle="modal"
              data-bs-target="#AddServiceModal"
            >
              <FaPlus className="me-2" size={12} />
              Add New Service
            </button>

          </div>

        </div>

        {/* ===================================================
            QUICK STATS
        =================================================== */}

        <div className="row g-3 mb-4">

          <div className="col-6 col-md-4">

            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">

              <div className="d-flex align-items-center justify-content-between">

                <div>
                  <small className="text-secondary">
                    Total Services
                  </small>

                  <h4 className="fw-bold mb-0 mt-1">
                    {services?.length || 0}
                  </h4>
                </div>

                <div className="text-primary bg-primary bg-opacity-10 rounded-3 p-2">
                  <FaTools />
                </div>

              </div>

            </div>

          </div>

          <div className="col-6 col-md-4">

            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">

              <div className="d-flex align-items-center justify-content-between">

                <div>
                  <small className="text-secondary">
                    Total Tasks
                  </small>

                  <h4 className="fw-bold mb-0 mt-1">
                    {(services || []).reduce(
                      (total, service) =>
                        total +
                        (service?.skills?.length || 0),
                      0
                    )}
                  </h4>
                </div>

                <div className="text-success bg-success bg-opacity-10 rounded-3 p-2">
                  <FaTasks />
                </div>

              </div>

            </div>

          </div>

          <div className="col-12 col-md-4">

            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">

              <div className="d-flex align-items-center justify-content-between">

                <div>
                  <small className="text-secondary">
                    Active Professionals
                  </small>

                  <h4 className="fw-bold mb-0 mt-1">
                    {(services || []).reduce(
                      (total, service) =>
                        total +
                        Number(
                          service?.professionalCount || 0
                        ),
                      0
                    )}
                  </h4>
                </div>

                <div className="text-warning bg-warning bg-opacity-10 rounded-3 p-2">
                  <FaUsers />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            SEARCH + LIST HEADER
        =================================================== */}

        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">

          <div>
            <h5 className="fw-bold mb-1">
              All Services
            </h5>

            <small className="text-secondary">
              Select a service to manage its tasks and
              details.
            </small>
          </div>

          <div
            className="input-group bg-white border rounded-3 overflow-hidden"
            style={{
              maxWidth: "330px",
              height: "42px",
            }}
          >

            <span className="input-group-text bg-white border-0">
              <FaSearch
                size={13}
                className="text-secondary"
              />
            </span>

            <input
              type="text"
              className="form-control border-0 shadow-none ps-0"
              placeholder="Search services..."
              value={serviceSearch}
              onChange={(e) =>
                setServiceSearch(e.target.value)
              }
            />

            {serviceSearch && (
              <button
                type="button"
                className="btn bg-white border-0"
                onClick={() =>
                  setServiceSearch("")
                }
              >
                <FaTimes
                  size={12}
                  className="text-secondary"
                />
              </button>
            )}

          </div>

        </div>

        {/* =====================================================
            SERVICE CARDS
        ===================================================== */}

        <div className="row g-3">

          {filteredServices?.length > 0 ? (

            filteredServices.map((service) => (

              <div
                className="col-12 col-md-6 col-xl-4"
                key={service._id}
              >

                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white">

                  {/* ==========================================
                      IMAGE
                  ========================================== */}

                  <div
                    className="position-relative"
                    style={{
                      height: "125px",
                    }}
                  >

                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                      }}
                    />

                    {/* Commission */}

                    <span
                      className="position-absolute top-0 end-0 m-2 badge rounded-pill bg-dark bg-opacity-75 px-3 py-2"
                    >
                      <FaPercentage
                        size={9}
                        className="me-1"
                      />
                      {service.commission}%
                    </span>

                  </div>

                  {/* ==========================================
                      CARD BODY
                  ========================================== */}

                  <div className="card-body p-3 d-flex flex-column">

                    {/* Service title */}

                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">

                      <div className="min-w-0">

                        <h5 className="fw-bold mb-1 text-dark text-truncate">
                          {service.name}
                        </h5>

                        <small className="text-secondary">
                          Service
                        </small>

                      </div>

                      <span className="badge rounded-pill bg-success-subtle text-success px-2 py-1 flex-shrink-0">
                        <FaUsers
                          size={9}
                          className="me-1"
                        />
                        {service.professionalCount || 0}
                      </span>

                    </div>

                    {/* Description */}

                    <p
                      className="text-secondary small mb-3"
                      style={{
                        minHeight: "36px",
                        display:
                          "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient:
                          "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {service.description ||
                        "No description available for this service."}
                    </p>

                    {/* ========================================
                        TASK HEADER
                    ======================================== */}

                    <div className="d-flex align-items-center justify-content-between mb-2">

                      <div className="d-flex align-items-center gap-2">

                        <div
                          className="d-flex align-items-center justify-content-center rounded-2 bg-primary bg-opacity-10 text-primary"
                          style={{
                            width: "28px",
                            height: "28px",
                          }}
                        >
                          <FaTasks size={11} />
                        </div>

                        <div>
                          <div className="small fw-bold text-dark">
                            Tasks
                          </div>

                          <small className="text-secondary">
                            {service.skills?.length || 0}{" "}
                            available
                          </small>
                        </div>

                      </div>

                      <small className="text-primary">
                        Scroll to view
                      </small>

                    </div>

                    {/* ========================================
                        TASK SCROLL AREA
                    ======================================== */}

                    <div
                      className="border rounded-3 bg-light p-2 mb-3 overflow-auto"
                      style={{
                        maxHeight: "155px",
                      }}
                    >

                      {service.skills?.length > 0 ? (

                        <div className="d-flex flex-column gap-2">

                          {service.skills.map(
                            (skill) => (

                              <div
                                key={skill._id}
                                className="bg-white border rounded-3 px-2 py-2"
                              >

                                <div className="d-flex align-items-center gap-2">

                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary flex-shrink-0"
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                    }}
                                  >
                                    <FaChevronRight
                                      size={8}
                                    />
                                  </div>

                                  <div className="flex-grow-1 min-w-0">

                                    <div
                                      className="small fw-semibold text-dark text-truncate"
                                      title={skill.name}
                                    >
                                      {skill.name}
                                    </div>

                                    <small className="text-secondary">
                                      {skill.bookingType ===
                                      "fixed"
                                        ? "Fixed price"
                                        : "Inspection"}
                                    </small>

                                  </div>

                                  {skill.bookingType ===
                                    "fixed" &&
                                    skill.pricingSource ===
                                      "admin" && (
                                      <span className="badge rounded-pill bg-success-subtle text-success flex-shrink-0">
                                        ₹
                                        {
                                          skill.fixedPrice
                                        }
                                      </span>
                                    )}

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <div className="text-center py-3">

                          <FaTasks
                            size={18}
                            className="text-secondary mb-2"
                          />

                          <div className="small text-secondary">
                            No tasks added
                          </div>

                        </div>

                      )}

                    </div>

                    {/* ========================================
                        FOOTER
                    ======================================== */}

                    <div className="mt-auto pt-2 border-top">

  <div className="d-flex gap-2">

    {/* Manage */}
    <button
      type="button"
      className="btn btn-outline-primary rounded-3 flex-grow-1 fw-semibold"
      data-bs-toggle="modal"
      data-bs-target="#UpdateServiceModal"
      onClick={() =>
        setSelectedService(service)
      }
    >
      <FaPen
        size={11}
        className="me-2"
      />

      Manage
    </button>

    {/* Delete */}
    <button
      type="button"
      className="btn btn-outline-danger rounded-3"
      style={{
        width: "44px",
      }}
      disabled={
        deletingServiceId === service._id
      }
      onClick={() =>
        handleDeleteService(service)
      }
      title="Delete service"
    >
      {deletingServiceId === service._id ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
        />
      ) : (
        <FaTrash size={12} />
      )}
    </button>

  </div>

</div>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="col-12">

              <div className="bg-white border rounded-4 text-center py-5 px-3">

                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary"
                  style={{
                    width: "55px",
                    height: "55px",
                  }}
                >
                  <FaSearch />
                </div>

                <h6 className="fw-bold mb-1">
                  No services found
                </h6>

                <p className="text-secondary small mb-3">
                  Try searching with another service name.
                </p>

                {serviceSearch && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-pill px-4"
                    onClick={() =>
                      setServiceSearch("")
                    }
                  >
                    Clear search
                  </button>
                )}

              </div>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          ADD SERVICE MODAL
      ===================================================== */}

      <div
        className="modal fade"
        id="AddServiceModal"
        tabIndex="-1"
        aria-hidden="true"
      >

        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

          <div className="modal-content border-0 rounded-4 overflow-hidden">

            <div className="modal-header px-4 py-3">

              <div>
                <small className="text-primary fw-semibold">
                  SERVICE MANAGEMENT
                </small>

                <h5 className="modal-title fw-bold mb-0 mt-1">
                  Add New Service
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />

            </div>

            <div className="modal-body p-3 p-md-4">
              <ServiceForm mode="create" />
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          UPDATE SERVICE MODAL
      ===================================================== */}

      <div
        className="modal fade"
        id="UpdateServiceModal"
        tabIndex="-1"
        aria-hidden="true"
      >

        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">

          <div className="modal-content border-0 rounded-4 overflow-hidden">

            <div className="modal-header px-4 py-3">

              <div>

                <small className="text-primary fw-semibold">
                  SERVICE MANAGEMENT
                </small>

                <h5 className="modal-title fw-bold mb-0 mt-1">
                  Manage Service
                </h5>

                {selectedService && (
                  <small className="text-secondary">
                    {selectedService.name}
                  </small>
                )}

              </div>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />

            </div>

            <div className="modal-body p-3 p-md-4">

              {selectedService && (
                <ServiceForm
                  mode="update"
                  service={selectedService}
                />
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminServices;

