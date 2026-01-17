import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PiSmileySadLight } from "react-icons/pi";
import { RiImageEditLine } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import "../css/profile.css";
import ReadMoreText from "../Components/ReadMoreText";
import { useEffect } from "react";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import UpdateProfileInfoForm from "./UpdateProfileInfoForm";
import CompleteProfileToast from "./CompleteProfileToast";
import UpdateCharges from "./UpdateCharges";
import MyGallery from "./MyGallery";
import ProReviews from "./ProReviews";
import { FaTools } from "react-icons/fa";

const ProfessionalProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (profilePicture) {
      const updatePicture = async () => {
        try {
          setLoading(true);
          const formData = new FormData();
          formData.append("profilePicture", profilePicture);
          const result = await axios.post(
            `${server_url}/api/user/update-profile-picture`,
            formData,
            {
              withCredentials: true,
            }
          );
          dispatch(setCurrentUserData(result?.data));
          setLoading(false);
        } catch (error) {
          toast.error(error.message);
          setLoading(false);
        }
      };
      updatePicture();
    }
  }, [profilePicture]);
  const handlePictureSubmit = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const { currentUserData } = useSelector((state) => state.user);
  const ProfessionalDetails = currentUserData?.user;
  const isProfileComplete = Boolean(ProfessionalDetails?.charges);
  const ChargesNotDefined = Boolean(
    !ProfessionalDetails?.charges?.hourly?.amount &&
      !ProfessionalDetails?.charges?.daily?.amount &&
      !ProfessionalDetails?.charges?.contract?.minAmount &&
      !ProfessionalDetails?.charges?.amountDesc
  );


  const reviews = ProfessionalDetails?.reviews
  const navigate = useNavigate();

  if (!ProfessionalDetails) {
    return (
      <>
        <div className="d-flex justify-content-center align-items-center flex-column mt-4">
          <span className="text-danger">
            <PiSmileySadLight size={50} />
          </span>
          <h2 className="welcome">Oops! Something went wrong!</h2>
          <p>Please Try Again Later!</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="profile p-2">
       <div className="profile-upper d-flex flex-column gap-4">

  {/* ===== Top Card ===== */}
  <div className="card border-0 shadow-sm rounded-4 p-4">
    <div className="row align-items-start g-4">

      {/* ===== Left : Profile Picture ===== */}
      <div className="col-md-3 text-center">
        <div className="position-relative d-inline-block">

          {/* Loader */}
          {loading && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <ClipLoader size={30} color="blue" />
            </div>
          )}

          <img
            src={
              ProfessionalDetails?.profilePicture ||
              "/Images/placeholderProfile.avif"
            }
            alt="profile"
            className="rounded-circle border shadow-sm"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
            }}
          />

          {/* Edit Icon */}
          <label
            htmlFor="profilePicture"
            className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "34px", height: "34px", cursor: "pointer" }}
            title="Change profile picture"
          >
            <RiImageEditLine />
          </label>

          <input
            type="file"
            accept="image/*"
            id="profilePicture"
            hidden
            onChange={(e) => handlePictureSubmit(e)}
          />
        </div>
      </div>

      {/* ===== Right : Profile Info ===== */}
      <div className="col-md-9">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="fw-bold mb-1">
              {ProfessionalDetails?.userId?.fullName}
            </h4>
            <span className="badge bg-primary">
              {ProfessionalDetails?.profession.name}
            </span>
          </div>

          <span
            className="btn text-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#infoModal"
            title="Edit profile"
          >
            <FaPencil />
          </span>
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="infoModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">
                  Update Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <UpdateProfileInfoForm />
            </div>
          </div>
        </div>

        <hr />

        {/* Description */}
        {isProfileComplete && (
          <>
            <small className="text-muted fw-semibold">
              Description
            </small>
            <p className="mb-3">
              <ReadMoreText
                text={ProfessionalDetails?.description}
              />
            </p>
            <hr />
          </>
        )}

        {/* Info Blocks */}
        <div className="d-flex flex-column gap-2">

          <div className="d-flex align-items-center gap-2">
            <CiLocationOn className="text-primary" />
            <ReadMoreText
              text={ProfessionalDetails?.address?.addressLine}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <MdOutlineMail className="text-primary" />
            <span>{ProfessionalDetails?.userId?.email}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <IoCallOutline className="text-primary" />
            <span>{ProfessionalDetails?.userId?.mobile}</span>
          </div>

        </div>
      </div>
    </div>
  </div>

  {/* ===== Charges Section (unchanged logic, refined UI) ===== */}
  {isProfileComplete && (
    <div className="card border-0 shadow-sm rounded-4">

      <div className="card-header bg-primary d-flex justify-content-between align-items-center rounded-top-4">
        <h5 className="mb-0 fw-semibold text-light d-flex align-items-center gap-2">
          <GiTakeMyMoney />
          My Charges
        </h5>

        <span
          className="btn text-light btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#ChargesModal"
        >
          <FaPencil />
        </span>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="ChargesModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">
                Update Charges
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <UpdateCharges />
          </div>
        </div>
      </div>

      <div className="card-body">

        {ChargesNotDefined && (
          <div className="alert alert-warning small py-2">
            ⚠️ Charges are not defined. Please update.
          </div>
        )}

        <div className="row g-3">

          {ProfessionalDetails?.charges?.hourly?.amount && (
            <div className="col-md-4">
              <div className="border rounded-3 p-3">
                <small className="text-muted">Hourly</small>
                <h6 className="fw-bold text-success mb-0">
                  <MdOutlineCurrencyRupee />
                  {ProfessionalDetails.charges.hourly.amount}
                  <span className="text-muted fs-6"> / hr</span>
                </h6>
              </div>
            </div>
          )}

          {ProfessionalDetails?.charges?.daily?.amount && (
            <div className="col-md-4">
              <div className="border rounded-3 p-3">
                <small className="text-muted">Daily</small>
                <h6 className="fw-bold text-primary mb-0">
                  <MdOutlineCurrencyRupee />
                  {ProfessionalDetails.charges.daily.amount}
                  <span className="text-muted fs-6"> / day</span>
                </h6>
              </div>
            </div>
          )}

          {ProfessionalDetails?.charges?.contract?.minAmount && (
            <div className="col-md-4">
              <div className="border rounded-3 p-3">
                <small className="text-muted">Contract</small>
                <h6 className="fw-bold mb-0">
                  <MdOutlineCurrencyRupee />
                  {ProfessionalDetails.charges.contract.minAmount}
                  {ProfessionalDetails.charges.contract.maxAmount !== "0" && (
                    <>
                      {" "}–{" "}
                      <MdOutlineCurrencyRupee />
                      {ProfessionalDetails.charges.contract.maxAmount}
                    </>
                  )}
                </h6>
              </div>
            </div>
          )}

        </div>

        {ProfessionalDetails?.charges?.amountDesc && (
          <div className="mt-3">
            <small className="text-muted fw-semibold">
              Charge Description
            </small>
            <p className="small mb-0">
              <ReadMoreText
                text={ProfessionalDetails?.charges?.amountDesc}
              />
            </p>
          </div>
        )}

      </div>
    </div>
  )}
</div>

        <hr />
        {/* ================= MY SKILLS ================= */}
{ProfessionalDetails?.selectedSkills && (
  <div className="card border-0 shadow-sm rounded-4 mb-3">

    {/* ===== HEADER ===== */}
    <div
      className="card-header d-flex justify-content-between align-items-center rounded-top-4 text-light"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #6ea8fe)",
      }}
    >
      <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
        <FaTools />
        My Skills
      </h5>

      {/* 🔥 UPDATE BUTTON */}
      <span
        className="btn btn-sm text-light"
        data-bs-toggle="modal"
        data-bs-target="#UpdateSkillsModal"
      >
        <FaPencil />
      </span>
    </div>

    {/* ===== MODAL ===== */}
    <div
      className="modal fade"
      id="UpdateSkillsModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">
              Update Your Skills
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          {/* 👇 Yahan tum future mein component inject karoge */}
          {/* <UpdateSkills /> */}
        </div>
      </div>
    </div>

    {/* ===== BODY ===== */}
    <div className="card-body">

      {/* EMPTY STATE */}
      {ProfessionalDetails.selectedSkills.length === 0 && (
        <div className="alert alert-warning small py-2 d-flex align-items-center gap-2">
          ⚠️ You have not selected any skills yet.  
          Update your skills to improve profile visibility.
        </div>
      )}

      {/* SKILLS LIST */}
      {ProfessionalDetails.selectedSkills.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {ProfessionalDetails.selectedSkills.map((skill) => (
            <span
              key={skill._id}
              className="badge px-3 py-2 rounded-pill fw-semibold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(13,110,253,0.15), rgba(110,168,254,0.15))",
                color: "#0d6efd",
                fontSize: "0.85rem",
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}

      {/* FOOTER HINT */}
      <div className="mt-3 small text-muted">
        💡 Keeping your skills updated helps customers find you faster.
      </div>
    </div>
  </div>
)}



        <div className="profile-lower p-2">
          {!isProfileComplete && <CompleteProfileToast />}
         {reviews.length !==0 && <div className="review">
            <ProReviews reviews={reviews}/>
          </div>}
         { <div className="myGallery mt-2">
            <MyGallery />
          </div>}
        </div>
      </div>
    </>
  );
};

export default ProfessionalProfile;
