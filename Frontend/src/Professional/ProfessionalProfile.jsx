import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PiSmileySadLight } from "react-icons/pi";
import { RiImageEditLine } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { FaShareAlt, FaTools } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { setCurrentUserData } from "../redux/user.slice";
import "../css/profile.css";
import ReadMoreText from "../Components/ReadMoreText";
import axios from "axios";
import { server_url } from "../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import UpdateProfileInfoForm from "./UpdateProfileInfoForm";
import CompleteProfileToast from "./CompleteProfileToast";
import MyGallery from "./MyGallery";
import ProReviews from "./ProReviews";
import UpdateSkills from "./UpdateSkills";
import DynamicForm from "../Admin/AdminComponents/Utils/DynamicForm";
import useGetForm from "../hooks/useGetForm";
import FormResponseSummary from "../Admin/AdminComponents/Utils/FormResponseSummary";
import DashboardNavigator from "../utils/DashboardNavigator";
import ProfessionalAchievementCard from "./ProfessionalAchievementCard";

const ProfessionalProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { currentUserData } = useSelector((state) => state.user);
  const ProfessionalDetails = currentUserData?.user;
  const navigate = useNavigate();

  useEffect(() => {
    if (!profilePicture) return;
    const updatePicture = async () => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);
        const result = await axios.post(`${server_url}/api/user/update-profile-picture`, formData, { withCredentials: true });
        dispatch(setCurrentUserData(result?.data));
      } catch (error) { toast.error(error.response?.data?.message || error.message); }
      finally { setLoading(false); }
    };
    updatePicture();
  }, [profilePicture, dispatch]);

  const handlePictureSubmit = (e) => setProfilePicture(e.target.files?.[0] || null);
  const isProfileComplete = ProfessionalDetails?.description;
  const ChargesDefined = ProfessionalDetails?.isChargesDefined;
  const reviews = ProfessionalDetails?.reviews || [];
  const form = useGetForm(ProfessionalDetails?.profession?._id);

  if (!ProfessionalDetails) return <div className="d-flex justify-content-center align-items-center flex-column mt-4"><span className="text-danger"><PiSmileySadLight size={50} /></span><h2 className="welcome">Oops! Something went wrong!</h2><p>Please Try Again Later!</p></div>;

  const profileUrl = `${window.location.origin}/s/${ProfessionalDetails.shortCode}`;
  const copyProfileLink = async () => { try { await navigator.clipboard.writeText(profileUrl); toast.success("Profile link copied."); } catch { toast.error("Unable to copy link."); } };
  const shareProfile = async () => { try { if (navigator.share) await navigator.share({ title: `${ProfessionalDetails.userId.fullName} | FixKar`, text: `Hire ${ProfessionalDetails.userId.fullName} on FixKar.`, url: profileUrl }); else await copyProfileLink(); } catch (err) { console.log(err); } };

  return <>
    <div className="profile p-2">
      <div className="text-white p-4" style={{ background: "linear-gradient(135deg,#0d6efd,#00c6ff)", borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px" }}>
        <div className="d-flex justify-content-between align-items-center"><h5 className="fw-bold mb-0">My Profile</h5><DashboardNavigator /></div>
        <p className="mt-2 small opacity-75">Manage Your Profile</p>
      </div>

      <div className="profile-upper mt-2 d-flex flex-column gap-4">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="row align-items-start g-4">
            <div className="text-center"><div className="position-relative d-inline-block">
              {loading && <div className="position-absolute top-50 start-50 translate-middle"><ClipLoader size={30} color="blue" /></div>}
              <img src={ProfessionalDetails?.profilePicture || "/Images/placeholderProfile.avif"} alt="profile" className="rounded-circle border shadow-sm" style={{ width: "140px", height: "140px", objectFit: "cover" }} />
              <label htmlFor="profilePicture" className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "34px", height: "34px", cursor: "pointer" }} title="Change profile picture"><RiImageEditLine /></label>
              <input type="file" accept="image/*" id="profilePicture" hidden onChange={handlePictureSubmit} />
            </div></div>

            <div className="d-flex gap-2"><button className="btn btn-primary rounded-pill" onClick={shareProfile}><FaShareAlt /> Share</button><button className="btn btn-outline-primary rounded-pill" onClick={copyProfileLink}>Copy URL</button></div>

            <div>
              <div className="d-flex justify-content-between align-items-start"><div><h4 className="fw-bold mb-1">{ProfessionalDetails?.userId?.fullName}</h4><span className="badge bg-primary">{ProfessionalDetails?.profession?.name}</span></div><span className="btn text-primary btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal" title="Edit profile"><FaPencil /></span></div>
              <div className="modal fade" id="infoModal" tabIndex="-1" aria-hidden="true"><div className="modal-dialog modal-dialog-centered"><div className="modal-content rounded-4"><div className="modal-header"><h5 className="modal-title fw-semibold">Update Profile</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div><UpdateProfileInfoForm /></div></div></div>
              <hr />
              {isProfileComplete && <><small className="text-muted fw-semibold">Description</small><p className="mb-3"><ReadMoreText text={ProfessionalDetails?.description} /></p><hr /></>}
              <div className="d-flex flex-column gap-2"><div className="d-flex align-items-center gap-2"><CiLocationOn className="text-primary" /><ReadMoreText text={ProfessionalDetails?.address?.addressLine} /></div><div className="d-flex align-items-center gap-2"><MdOutlineMail className="text-primary" /><span>{ProfessionalDetails?.userId?.email}</span></div><div className="d-flex align-items-center gap-2"><IoCallOutline className="text-primary" /><span>{ProfessionalDetails?.userId?.mobile}</span></div></div>
            </div>
          </div>
        </div>

        <ProfessionalAchievementCard professional={ProfessionalDetails} />

        {isProfileComplete && <div className="card border-0 shadow-sm rounded-4"><div className="card-header d-flex justify-content-between align-items-center rounded-top-4" style={{ background: "linear-gradient(135deg, #0d6efd, #6ea8fe)" }}><h5 className="mb-0 fw-semibold text-light d-flex align-items-center gap-2"><GiTakeMyMoney /> My Charges</h5><span className="btn text-light btn-sm" data-bs-toggle="modal" data-bs-target="#ChargesModal"><FaPencil /></span></div><div className="modal fade" id="ChargesModal" tabIndex="-1" aria-hidden="true"><div className="modal-dialog modal-dialog-centered"><div className="modal-content rounded-4"><div className="modal-header"><h5 className="modal-title fw-semibold">Update Charges</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div><DynamicForm form={form} initialValues={ProfessionalDetails?.charges?.responses} /></div></div></div><div className="card-body">{!ChargesDefined && <div className="alert alert-warning small py-2">⚠️ Charges are not defined. Please update.</div>}{ChargesDefined && <FormResponseSummary summary={ProfessionalDetails?.charges?.summary} />}</div></div>}

        {ProfessionalDetails?.selectedSkills && <div className="card border-0 shadow-sm rounded-4 mb-3"><div className="card-header d-flex justify-content-between align-items-center rounded-top-4 text-light" style={{ background: "linear-gradient(135deg, #0d6efd, #6ea8fe)" }}><h5 className="mb-0 fw-semibold d-flex align-items-center gap-2"><FaTools /> My Skills</h5><span className="btn btn-sm text-light" data-bs-toggle="modal" data-bs-target="#UpdateSkills"><FaPencil /></span></div><div className="modal fade" id="UpdateSkills" tabIndex="-1" aria-hidden="true"><div className="modal-dialog modal-dialog-centered modal-lg"><div className="modal-content rounded-4"><div className="modal-header"><h5 className="modal-title fw-semibold">Update Your Skills</h5><button type="button" className="btn-close" data-bs-dismiss="modal"></button></div><div className="modal-body"><UpdateSkills professional={ProfessionalDetails} /></div></div></div></div><div className="card-body">{ProfessionalDetails.selectedSkills.length===0&&<div className="alert alert-warning small py-2">⚠️ You have not selected any skills yet. Update your skills to improve profile visibility.</div>}{ProfessionalDetails.selectedSkills.length>0&&<div className="d-flex flex-wrap gap-2">{ProfessionalDetails.selectedSkills.map(skill=><span key={skill._id} className="badge px-3 py-2 rounded-pill fw-semibold" style={{ background:"linear-gradient(135deg, rgba(13,110,253,0.15), rgba(110,168,254,0.15))", color:"#0d6efd", fontSize:"0.85rem" }}>{skill.name}</span>)}</div>}<div className="mt-3 small text-muted">💡 Keeping your skills updated helps customers find you faster.</div></div></div>}
      </div>

      <hr />
      <div className="profile-lower p-2">{!isProfileComplete&&<CompleteProfileToast />}{reviews.length!==0&&<div className="review"><ProReviews reviews={reviews} /></div>}<div className="myGallery mt-2"><MyGallery /></div></div>
    </div>
  </>;
};

export default ProfessionalProfile;
