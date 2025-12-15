import axios from "axios";
import React, { useState } from "react";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
const UpdateCharges = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
  const [chargeType, setChargeType] = useState("multiple");
  const [charges, setCharges] = useState({
    hourlyRate: "",
    dailyRate: "",
    contractMin: "",
    contractMax: "",
    chargeDescription : ""
  });

  const handleTypeChange = (e) => {
    setChargeType(e.target.value);
  };

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
      chargeType,
      charges,
    };

    try {
        setLoading(true)
        const result = await axios.post(`${server_url}/api/user/update-charges`, payload, {withCredentials : true});
        dispatch(setCurrentUserData(result?.data))
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
            value={chargeType}
            onChange={handleTypeChange}
          >
            <option value="">Select charge type</option>
            <option value="multiple">Multiple</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* MULTIPLE */}
        {chargeType === "multiple" && (
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
        {chargeType === "hourly" && (
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
        {chargeType === "daily" && (
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
        {chargeType === "contract" && (
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
          <button type="submit" className="btn btn-primary">
            Update Charges
          </button>
        </center>
      </form>
    </div>
  );
};

export default UpdateCharges;
