import axios from "axios";
import React, { useState } from "react";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
const UpdateCharges = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
  const [charges, setCharges] = useState({
    hourlyRate: "",
    dailyRate: "",
    contractMin: "",
    contractMax: "",
    chargeDescription : "",
    chargeType : "multiple"
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharges((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();

    const payload = {
        amountDesc : charges.chargeDescription,
        chargeType : charges.chargeType,
        hourlyRate : charges.hourlyRate ? { amount: Number(charges.hourlyRate) } : undefined,
        dailyRate : charges.dailyRate ? { amount: Number(charges.dailyRate) } : undefined,
        contract : 
        charges.contractMin || charges.contractMax ? 
        {
          contractMin : Number(charges.contractMin),
          contractMax : Number(charges.contractMax)
        } : undefined
    };

    try {
        setLoading(true)
        const result = await axios.post(`${server_url}/api/user/update-charges`, payload, {withCredentials : true});
        dispatch(setCurrentUserData(result?.data))
        toast.success(result?.data?.message)
        setLoading(false); 

    } catch (error) {
        console.log(error.message);
        setLoading(false)
    }
  };

  return (
    <div className="modal-body">
      <form onSubmit={handleSubmit}>
        {/* Select Charge Type */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Charge Type</label>
          <select
            className="form-select"
            value={charges.chargeType}
            onChange={handleChange}
          >
            <option value="">Select charge type</option>
            <option value="multiple">Multiple</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* MULTIPLE */}
        {charges.chargeType === "multiple" && (
          <>
            <div className="mb-3">
              <label className="form-label fw-semibold">Hourly Rate</label>
              <input
                type="number"
                className="form-control"
                name="hourlyRate"
                placeholder="Enter hourly rate"
                value={charges.hourlyRate}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Daily Rate</label>
              <input
                type="number"
                className="form-control"
                name="dailyRate"
                placeholder="Enter daily rate"
                value={charges.dailyRate}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Contract Rate (Min - Max)
              </label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  name="contractMin"
                  placeholder="Min"
                  value={charges.contractMin}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  className="form-control"
                  name="contractMax"
                  placeholder="Max"
                  value={charges.contractMax}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {/* HOURLY */}
        {charges.chargeType === "hourly" && (
          <div className="mb-3">
            <label className="form-label fw-semibold">Hourly Rate</label>
            <input
              type="number"
              className="form-control"
              name="hourlyRate"
              placeholder="Enter hourly rate"
              value={charges.hourlyRate}
              onChange={handleChange}
            />
          </div>
        )}

        {/* DAILY */}
        {charges.chargeType === "daily" && (
          <div className="mb-3">
            <label className="form-label fw-semibold">Daily Rate</label>
            <input
              type="number"
              className="form-control"
              name="dailyRate"
              placeholder="Enter daily rate"
              value={charges.dailyRate}
              onChange={handleChange}
            />
          </div>
        )}

        {/* CONTRACT */}
        {charges.chargeType === "contract" && (
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Contract Rate (Min - Max)
            </label>
            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-control"
                name="contractMin"
                placeholder="Min"
                value={charges.contractMin}
                onChange={handleChange}
              />
              <input
                type="number"
                className="form-control"
                name="contractMax"
                placeholder="Max"
                value={charges.contractMax}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold">Charge Description</label>
            <input
                type="text"
                className="form-control"
                name="chargeDescription"
                placeholder="Define Your Charges"
                value={charges.chargeDescription}
                onChange={handleChange}
              />
        </div>


        {/* Submit */}
        <center>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading && <>
              <ClipLoader size={20}/>
            </>}
            Update Charges
          </button>
        </center>
      </form>
    </div>
  );
};

export default UpdateCharges;
