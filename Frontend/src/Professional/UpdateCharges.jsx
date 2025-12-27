import axios from "axios";
import React, { useState } from "react";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { MdOutlineCurrencyRupee } from "react-icons/md";

const UpdateCharges = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [charges, setCharges] = useState({
    chargeType: "",
    hourlyRate: "",
    dailyRate: "",
    contractMin: "",
    contractMax: "",
    chargeDescription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharges((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    chargeType: charges.chargeType,
    amountDesc: charges.chargeDescription || undefined,
  };

  // HOURLY
  if (charges.chargeType === "hourly") {
    payload.hourlyRate = {
      amount: Number(charges.hourlyRate),
    };
  }

  // DAILY
  if (charges.chargeType === "daily") {
    payload.dailyRate = {
      amount: Number(charges.dailyRate),
    };
  }

  // CONTRACT
  if (charges.chargeType === "contract") {
    payload.contract = {
      contractMin: Number(charges.contractMin),
      contractMax: Number(charges.contractMax || 0),
    };
  }

  // MULTIPLE
  if (charges.chargeType === "multiple") {
    if (charges.hourlyRate) {
      payload.hourlyRate = {
        amount: Number(charges.hourlyRate),
      };
    }

    if (charges.dailyRate) {
      payload.dailyRate = {
        amount: Number(charges.dailyRate),
      };
    }

    if (charges.contractMin || charges.contractMax) {
      payload.contract = {
        contractMin: Number(charges.contractMin),
        contractMax: Number(charges.contractMax || 0),
      };
    }
  }

  try {
    setLoading(true);

    const result = await axios.post(
      `${server_url}/api/user/update-charges`,
      payload,
      { withCredentials: true }
    );

    dispatch(setCurrentUserData(result.data));
    toast.success(result.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update charges");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-body">
      <form onSubmit={handleSubmit}>

        {/* Charge Type */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Charge Type</label>
          <select
            className="form-select"
            name="chargeType"
            value={charges.chargeType}
            onChange={handleChange}
            required
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
                placeholder="₹ per hour"
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
                placeholder="₹ per day"
                value={charges.dailyRate}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Contract (Min - Max)
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
              placeholder="₹ per hour"
              value={charges.hourlyRate}
              onChange={handleChange}
              required
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
              placeholder="₹ per day"
              value={charges.dailyRate}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* CONTRACT */}
        {charges.chargeType === "contract" && (
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Contract (Min - Max)
            </label>
            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-control"
                name="contractMin"
                placeholder="Min"
                value={charges.contractMin}
                onChange={handleChange}
                required
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

        {/* Description */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Charge Description
          </label>
          <input
            type="text"
            className="form-control"
            name="chargeDescription"
            placeholder="Explain your charges clearly"
            value={charges.chargeDescription}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary rounded-pill px-4"
          >
            {loading ? <ClipLoader size={18} color="#fff" /> : "Update Charges"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default UpdateCharges;
