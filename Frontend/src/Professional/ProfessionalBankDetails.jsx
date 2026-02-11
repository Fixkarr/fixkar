import { useState } from "react";
import { FaUniversity,  FaFileUpload, FaLock } from "react-icons/fa";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import AsyncSelect from "react-select/async";


const ProfessionalBankDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    bankName: "",
    branch: "",
    ifsc: "",
    panNumber: "",
    upiId: "",
    passbookPhoto: null,
  });

  const handleIFSCChange = async (e) => {
  const value = e.target.value.toUpperCase();

  setFormData((prev) => ({
    ...prev,
    ifsc: value,
  }));

  // IFSC 11 characters ka hota hai
  if (value.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
    try {
      const res = await axios.get(
        `https://ifsc.razorpay.com/${value}`
      );

      // API se data mil gaya
      setFormData((prev) => ({
        ...prev,
        bankName: res.data.BANK,
        branch: res.data.BRANCH,
      }));

      toast.success("IFSC verified successfully");

    } catch (error) {
       setFormData(prev => ({
        ...prev,
        bankName: "",
        branch: ""
      }));
      toast.error("Invalid IFSC code");
    }
  }
};


  const loadBanks = async (inputValue) => {
  if (!inputValue || inputValue.length < 3) return [];

  


  try {
    const res = await axios.get(
      `${server_url}/api/user/get-banks?search=${inputValue}`,
      { withCredentials: true }
    );

    return res.data.map((b) => ({
      label: b.name,
      value: b.name,
    }));
  } catch {
    return [];
  }
};


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      toast.warning("Account Number does not match");
      return;
    }

    if (!formData.bankName) {
  toast.error("Please select your bank");
  return;
}

    if (!formData.ifsc || formData.ifsc.length !== 11) {
      toast.error("Please enter a valid 11-character IFSC code");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("holderName", formData.accountHolderName);
      data.append("accountNumber", formData.accountNumber);
      data.append("bankName", formData.bankName);
      data.append("branch", formData.branch);
      data.append("ifsc", formData.ifsc);
      data.append("panNumber", formData.panNumber);
      if (formData.upiId) data.append("upi", formData.upiId);
      data.append("passbookImage", formData.passbookPhoto);

      const response = await axios.post(
        `${server_url}/api/user/professional/bank-details`,
        data,
        { withCredentials: true }
      );

      toast.success(response.data.message);
      dispatch(setCurrentUserData(response.data));
      setShowForm(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit bank details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0" style={{ borderRadius: "14px" }}>
        <div className="card-body p-4">

          <div className="alert alert-warning">
            <strong>Bank Details Required</strong>
            <p className="mt-2 mb-1">
              These details are mandatory to withdraw your earnings.
            </p>
            <p className="mb-0 d-flex align-items-center gap-2">
              <FaLock /> Your information is secure.
            </p>
          </div>

          {!showForm && (
            <button className="btn btn-dark" onClick={() => setShowForm(true)}>
              <FaUniversity className="me-2" />
              Add / Verify Bank Details
            </button>
          )}

          {showForm && (
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label>Name as per Bank Account</label>
                  <input
                    className="form-control"
                    name="accountHolderName"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Bank Name</label>
 <AsyncSelect
  cacheOptions
  isClearable
  defaultOptions={false}
  loadOptions={loadBanks}
  placeholder="Type at least 3 letters..."
  value={
    formData.bankName
      ? { label: formData.bankName, value: formData.bankName }
      : null
  }
  loadingMessage={() => "Searching banks..."}
  noOptionsMessage={({ inputValue }) =>
    inputValue.length < 3
      ? "Type at least 3 letters"
      : "No banks found"
  }
  onChange={(opt) =>
    setFormData((prev) => ({
      ...prev,
      bankName: opt ? opt.value : "",
      branch: "",
    }))
  }
/>

                </div>

                <div className="col-md-6">
                  <label>Branch</label>
                  <input
                    className="form-control"
                    name="branch"
                    onChange={handleChange}
                    value={formData.branch} 
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Account Number</label>
                  <input
                    className="form-control"
                    name="accountNumber"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Confirm Account Number</label>
                  <input
                    className="form-control"
                    name="confirmAccountNumber"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>IFSC Code</label>
                  <input
                      className="form-control"
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleIFSCChange}
                      placeholder="Enter IFSC from passbook"
                      required
                    />
                      <small className="text-muted">
                    Please verify IFSC from your passbook or cheque
                  </small>
                </div>

                <div className="col-md-6">
                  <label>PAN Number</label>
                  <input
                    className="form-control"
                    name="panNumber"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>UPI ID (Optional)</label>
                  <input
                    className="form-control"
                    name="upiId"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label>Passbook / Cancelled Cheque</label>
                  <input
                    type="file"
                    className="form-control"
                    name="passbookPhoto"
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="mt-4 d-flex gap-2">
                <button className="btn btn-success" disabled={loading}>
                  <FaFileUpload className="me-2" />
                  {loading ? "Submitting..." : "Submit"}
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
