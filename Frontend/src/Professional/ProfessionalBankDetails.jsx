import { useState } from "react";
import { FaUniversity, FaIdCard, FaFileUpload, FaLock } from "react-icons/fa";
import axios from 'axios'
import {server_url} from '../App'
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const ProfessionalBankDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    bankName: "",
    panNumber: "",
    upiId: "",
    passbookPhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.accountNumber !== formData.confirmAccountNumber) {
     toast.warning("Account Number not match!");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();


      data.append("holderName", formData.accountHolderName);
      data.append("accountNumber", formData.accountNumber);
      data.append("ifsc", formData.ifsc);
      data.append("bankName", formData.bankName);
      data.append("panNumber", formData.panNumber);

      if (formData.upiId) {
        data.append("upi", formData.upiId);
      }


      data.append("passbookImage", formData.passbookPhoto);

      const response = await axios.post(
        `${server_url}/api/user/professional/bank-details`,
        data,
        {
          withCredentials: true, // 🔐 COOKIE AUTH
        }
      );

        toast.success(response.data.message);
        dispatch(setCurrentUserData(response.data));

      setShowForm(false);
    } catch (error) {
      console.error(error);
     toast.error(
        error?.response?.data?.message ||
          "Failed to submit bank details"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-4">
      <div
        className="card shadow-lg border-0"
        style={{ borderRadius: "14px" }}
      >
        <div className="card-body p-4">
          {/* Info Message */}
          <div className="alert alert-warning">
            <strong>Bank Details Required</strong>
            <p className="mb-1 mt-2">
              Your bank details are missing. These details are <b>mandatory</b>{" "}
              to withdraw the money you have earned on Fixkar.
            </p>
            <p className="mb-1">
              We will <b>review & verify</b> your bank details. Once verified,
              you will be able to withdraw your earnings directly to your bank
              account.
            </p>
            <p className="mb-0 d-flex align-items-center gap-2">
              <FaLock />
              Your information will remain <b>secure</b>.
            </p>
          </div>

          {/* Button */}
          {!showForm && (
            <button
              className="btn btn-dark px-4"
              onClick={() => setShowForm(true)}
            >
              <FaUniversity className="me-2" />
              Add / Verify Bank Details
            </button>
          )}

          {/* Form */}
          {showForm && (
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Name as per Bank Account
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="accountHolderName"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankName"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="accountNumber"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Confirm Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="confirmAccountNumber"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ifsc"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    PAN Number <FaIdCard />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="panNumber"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    UPI ID (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="upiId"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Bank Passbook / Cancelled Cheque
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="passbookPhoto"
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">
                    Photo must clearly show Account Number, IFSC & Name
                  </small>
                </div>
              </div>

              <div className="mt-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success px-4"
                  disabled={loading}
                >
                  <FaFileUpload className="me-2" />
                  {loading ? "Submitting..." : "Submit for Verification"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBankDetails;
