import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { CiLocationOn } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline, IoCallOutline } from "react-icons/io5";
import { FaUserTie, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";
import RequestHireForm from "./RequestHireForm";
import { useDispatch } from "react-redux";
import { setSelectedProfessional } from "../redux/professionalInfo.slice";
import { toast } from "react-toastify";
import ProReviews from "../Professional/ProReviews";
import ProfessionalGallerySection from "./ProfessionalGallerySection";

const ProfessionalInfo = () => {
  const [loading, setLoading] = useState(false);
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const isProfessionalInfo = Boolean(professionalInfo);

  const ChargesNotDefined =
    !professionalInfo?.charges ||
    (
      !professionalInfo?.charges?.hourly?.amount &&
      !professionalInfo?.charges?.daily?.amount &&
      !professionalInfo?.charges?.contract?.minAmount &&
      !professionalInfo?.charges?.contract?.maxAmount &&
      !professionalInfo?.charges?.amountDesc
    );

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfessionalInfo = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${server_url}/api/customer/get-professional-info/${id}`,
          { withCredentials: true }
        );
        setProfessionalInfo(result?.data?.professionalInfo);
        dispatch(setSelectedProfessional(result?.data?.professionalInfo));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionalInfo();
  }, []);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <ClipLoader size={50} color="#0d6efd" />
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (!isProfessionalInfo) {
    return (
      <div className="d-flex justify-content-center min-vh-100 bg-light">
        <div className="card shadow border-0 rounded-4 p-4 text-center" style={{ maxWidth: 420 }}>
          <h5 className="fw-bold text-danger mb-2">Oops! Something went wrong</h5>
          <p className="text-muted small">
            Please refresh the page or try again later.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
              Refresh
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">

      {/* ================= HEADER CARD ================= */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div
          className="p-4 text-white rounded-top-4"
          style={{ background: "linear-gradient(135deg, #0d6efd, #4f9cff)" }}
        >
          <div className="row align-items-center">
            <div className="col-md-8 d-flex align-items-center gap-3">
              <img
                src={professionalInfo?.profilePicture}
                alt="Profile"
                className="rounded-circle border border-3 border-white"
                style={{ width: 90, height: 90, objectFit: "cover" }}
              />
              <div>
                <h4 className="fw-bold mb-1">
                  {professionalInfo?.userId?.fullName}
                </h4>
                <div className="d-flex align-items-center gap-2">
                  <FaUserTie />
                  <span>{professionalInfo?.profession}</span>
                </div>
                <span className="badge bg-success mt-2">
                  {professionalInfo?.status?.[0]?.toUpperCase() +
                    professionalInfo?.status?.slice(1)}
                </span>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => navigate(`/customer/chat/${id}`)}
              >
                <IoChatbubbleEllipsesOutline /> Chat
              </button>
              <button
                className="btn btn-light btn-sm fw-semibold"
                data-bs-toggle="modal"
                data-bs-target="#hireFormModal"
              >
                Hire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT & ADDRESS ================= */}
  <div className="card border-0 shadow rounded-4 mb-4 overflow-hidden">

  {/* Header */}
  <div
    className="px-4 py-3 text-white"
    style={{
      background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
    }}
  >
    <div className="d-flex align-items-center gap-2">
      <FaInfoCircle size={18} />
      <h6 className="mb-0 fw-semibold">Professional Details</h6>
    </div>
    <small className="opacity-75">
      About the professional & service location
    </small>
  </div>

  {/* Body */}
  <div className="card-body bg-light">

    {/* About */}
    {professionalInfo?.description && (
      <div className="mb-4">
        <div className="d-flex align-items-start gap-2 mb-1">
          <FaInfoCircle className="text-primary mt-1" />
          <h6 className="fw-semibold mb-0">About</h6>
        </div>

        <p className="text-muted small mb-0 ps-4">
          {professionalInfo.description}
        </p>
      </div>
    )}

    {/* Address */}
    {professionalInfo?.address?.addressLine && (
      <div>
        <div className="d-flex align-items-start gap-2 mb-1">
          <CiLocationOn className="text-danger mt-1" />
          <h6 className="fw-semibold mb-0">Service Address</h6>
        </div>

        <p className="text-muted small mb-0 ps-4">
          {professionalInfo.address.addressLine}
        </p>
      </div>
    )}

  </div>
</div>


      {/* ================= CHARGES ================= */}
    <div className="card border-0 shadow rounded-4 mb-4 overflow-hidden">
  
  {/* Header */}
  <div
    className="px-4 py-3 text-white"
    style={{
      background: "linear-gradient(135deg, #198754, #20c997)",
    }}
  >
    <div className="d-flex align-items-center gap-2">
      <FaMoneyBillWave size={20} />
      <h6 className="mb-0 fw-semibold">Service Charges</h6>
    </div>
    <small className="opacity-75">
      Transparent pricing provided by the professional
    </small>
  </div>

  {/* Body */}
  <div className="card-body bg-light">

    {!ChargesNotDefined ? (
      <>
        {/* Charges Cards */}
        <div className="row g-3">

          {professionalInfo?.charges?.hourly?.amount && (
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body text-center">
                  <div className="mb-2 text-success">
                    <FaMoneyBillWave size={22} />
                  </div>
                  <small className="text-muted d-block">Hourly Charge</small>
                  <h5 className="fw-bold text-dark mb-0">
                    ₹ {professionalInfo.charges.hourly.amount}
                    <span className="text-muted fs-6"> / hr</span>
                  </h5>
                </div>
              </div>
            </div>
          )}

          {professionalInfo?.charges?.daily?.amount && (
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body text-center">
                  <div className="mb-2 text-primary">
                    <FaMoneyBillWave size={22} />
                  </div>
                  <small className="text-muted d-block">Daily Charge</small>
                  <h5 className="fw-bold text-dark mb-0">
                    ₹ {professionalInfo.charges.daily.amount}
                    <span className="text-muted fs-6"> / day</span>
                  </h5>
                </div>
              </div>
            </div>
          )}

          {(professionalInfo?.charges?.contract?.minAmount ||
            professionalInfo?.charges?.contract?.maxAmount) && (
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body text-center">
                  <div className="mb-2 text-warning">
                    <FaMoneyBillWave size={22} />
                  </div>
                  <small className="text-muted d-block">Contract Charge</small>
                  <h6 className="fw-bold text-dark mb-0">
                    ₹ {professionalInfo.charges.contract.minAmount}
                    {professionalInfo.charges.contract.maxAmount && (
                      <> – ₹ {professionalInfo.charges.contract.maxAmount}</>
                    )}
                  </h6>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Charge Description */}
        {professionalInfo?.charges?.amountDesc && (
          <div className="mt-4">
            <div className="alert alert-success bg-success bg-opacity-10 border-0 rounded-4">
              <h6 className="fw-semibold text-success mb-1">
                Charge Details
              </h6>
              <p className="mb-0 small text-dark">
                {professionalInfo.charges.amountDesc}
              </p>
            </div>
          </div>
        )}
      </>
    ) : (
      <div className="alert alert-warning border-0 rounded-4 mb-0">
        <strong>Charges not available.</strong><br />
        Please contact the professional directly to know the pricing details.
      </div>
    )}

  </div>
</div>

      {/* {=======================Reviews=============} */}

      {professionalInfo?.reviews.length !==0 && <div className="review">
            <ProReviews reviews={professionalInfo?.reviews}/>
          </div>}
          
          {/* ================gallery============== */}
      {professionalInfo?.gallery.length !==0 && <ProfessionalGallerySection professionalInfo={professionalInfo}/>}

      {/* ================= MODAL ================= */}
      <div
        className="modal fade"
        id="hireFormModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">Request Hiring</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <RequestHireForm proInfo={professionalInfo} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfessionalInfo;
