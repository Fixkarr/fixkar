import { useState } from "react";
import { FaUniversity, FaIdCard, FaFileUpload, FaLock } from "react-icons/fa";

const ProfessionalBankDetails = () => {
  const [showForm, setShowForm] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      alert("Account number and Confirm account number do not match");
      return;
    }

    console.log("Bank Details Submitted:", formData);
    alert("Bank details submitted successfully (Check console)");
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
              Your information will remain <b>secure and encrypted</b>.
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
                <button type="submit" className="btn btn-success px-4">
                  <FaFileUpload className="me-2" />
                  Submit for Verification
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
