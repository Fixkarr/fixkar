import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { calculateVisitingCharge } from "../utils/calculateVsitingCharge";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App";

const RequestHireForm = ({ proInfo}) => {
  const {selectedLocation} = useSelector(state=> state.location);
  const {currentUserData} = useSelector(state=> state.user);
  const {distance} = useSelector(state=> state.distance);
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;
  const mobileNumber = currentUserData?.user?.userId?.mobile
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const visitingCharge = calculateVisitingCharge(parseFloat(distance?.distance.text));
  const busyDays = proInfo?.busyDays;

    const today = new Date().toISOString().split("T")[0];
    const [minTime, setMinTime] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    workDate: "",
    workTime: "",
    problemDesc: "",
    chargeType: "",
    workAddress: `${selectedLocation?.address}`,
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   useEffect(() => {
    if (formData.workDate === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setMinTime(`${hours}:${minutes}`);
    } else {
      setMinTime("");
    }
  }, [formData.workDate, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();

      const payload = {
    customerName : formData.customerName,
    professionalId : proInfo._id,
    visitingCharge,
    profession : proInfo.profession,
    workDate : formData.workDate,
    workTime : formData.workTime,
    workAddress : formData.workAddress,
    problemDescription : formData.problemDesc,
    distanceInKm : parseFloat(distance?.distance.text),
    chargeType : formData.chargeType,
    mobileNumber,
  }

      if (busyDays.includes(formData.workDate)) {
      toast.info("This date is not available. Please select another date.");
      return;
    }
    
    if(!isMobileVerified){
  return toast.warning(
  <div>
    <h6 className="fw-bold mb-1">Mobile Not Verified</h6>
    <p className="small mb-2">
      Please verify your mobile number to hire a professional.
    </p>
    <button
      className="btn btn-sm btn-primary rounded-pill"
      onClick={() => {
        toast.dismiss();
        navigate("/customer/verify-mobile");
      }}
    >
      Verify Mobile Number
    </button>
  </div>,
  {
    autoClose: false,
    position: "top-center",
  }
);

    }
    try {
      setLoading(true)
      const result = await axios.post(`${server_url}/api/booking/create-booking`, payload, {withCredentials : true});
      toast.success(result.data.message)
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
      setLoading(false)
    }

    alert("Hire request sent successfully!");
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="fw-bold mb-3">
          Important Notice!
        </h5>

        <ul>
          <li className="text-muted small mb-4">
            The professional’s visiting charge is <b>₹${visitingCharge}</b>. This is the standard fee for the professional to visit your location. <br />
            प्रोफेशनल का विज़िट चार्ज <b>₹${visitingCharge}</b> है। यह चार्ज प्रोफेशनल के आपके स्थान तक आने के लिए लिया जाता है।
          </li>
          <li className="text-muted small mb-4">
            Once the work is completed, this visiting charge will be added to the final bill, and the total amount will need to be paid accordingly. <br />
            काम पूरा होने के बाद यह विज़िट चार्ज फाइनल बिल में जोड़ दिया जाएगा, और कुल राशि का भुगतान करना होगा।
          </li>
          <li className="text-muted small mb-4">
            In case you decide not to proceed with the work after the professional arrives, an additional ₹50 will be applicable as a visit handling charge. <br />
            यदि किसी कारणवश प्रोफेशनल के आने के बाद आप काम आगे नहीं करवाना चाहते हैं, तो ₹50 का अतिरिक्त चार्ज लगेगा।
          </li>
          <li className="text-muted small mb-4">So in that situation, the total payable amount would be <b>{`₹${visitingCharge + 50}`}</b>. <br />
            ऐसे में कुल देय राशि <b>₹${visitingCharge + 50}</b> होगी।
          </li>
        </ul>
       

        <form onSubmit={handleSubmit}>
          {/* Customer Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Your Name</label>
            <input
              type="text"
              className="form-control"
              name="customerName"
              placeholder="Enter your full name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date & Time */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Preferred Date</label>
              <input
                type="date"
                className="form-control"
                name="workDate"
                value={formData.workDate}
                min={today}
                onChange={handleChange}
                required
              />
               {busyDays?.includes(formData.workDate) && (
              <small className="text-danger">
                This date is not available
              </small>
            )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Preferred Time</label>
              <input
                type="time"
                className="form-control"
                name="workTime"
                min={minTime}
                value={formData.workTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Problem Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Describe Your Problem
            </label>
            <textarea
              className="form-control"
              name="problemDesc"
              rows="3"
              placeholder="Explain the work you want to get done"
              value={formData.problemDesc}
              onChange={handleChange}
              required
            />
          </div>

          {/* Charge Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Preferred Charge Type
            </label>
            <select
              className="form-select"
              name="chargeType"
              value={formData.chargeType}
              onChange={handleChange}
              required
            >
              <option value="">Select charge type</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Mobile Number  */}

          {
            isMobileVerified && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Mobile Number
                </label>
                <div >
                  {mobileNumber}
                </div>
              </div>
            )
          }

          {/* Address */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Work Address
            </label>
            <textarea
              className="form-control"
              name="workAddress"
              rows="2"
              placeholder="Enter full address where work is required"
              value={formData.workAddress}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn btn-primary w-100">
            {loading && <ClipLoader size={20}/>} Send Hire Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestHireForm;
