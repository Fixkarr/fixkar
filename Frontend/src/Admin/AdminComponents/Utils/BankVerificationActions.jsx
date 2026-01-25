import axios from "axios";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { server_url } from "../../../App"; 

const BankVerificationActions = ({ proId}) => {
  const approveBankDetails = async () => {
    try {
      const res = await axios.post(
        `${server_url}/api/admin/approve-bank/${proId}`,
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message || "Bank details approved successfully");

      // optional callback to refetch data
      
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve bank details"
      );
    }
  };

  const rejectBankDetails = async () => {
    try {
      const res = await axios.post(
        `${server_url}/api/admin/reject-bank/${proId}`,
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message || "Bank details rejected");

      
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject bank details"
      );
    }
  };

  return (
    <div className="col-12 d-flex gap-3 mt-3">
      <button
        className="btn btn-success d-flex align-items-center gap-2 px-4"
        onClick={approveBankDetails}
      >
        <FaCheckCircle />
        Approve Bank Details
      </button>

      <button
        className="btn btn-danger d-flex align-items-center gap-2 px-4"
        onClick={rejectBankDetails}
      >
        <FaTimesCircle />
        Reject Bank Details
      </button>
    </div>
  );
};

export default BankVerificationActions;
