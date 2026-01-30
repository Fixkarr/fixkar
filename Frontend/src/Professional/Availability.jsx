
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { server_url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { FaCalendarAlt, FaExclamationTriangle, FaSave, FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function Availability() {
  const { currentUserData } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false)
  const [selectedDays, setSelectedDays] = useState([]);
  const dispatch = useDispatch();

 

  const handleDayClick = (day) => {
    const normalized = new Date(day);
    normalized.setHours(0, 0, 0, 0);

    if (normalized < new Date().setHours(0, 0, 0, 0)) return;

    const exists = selectedDays.some(
      d => d.toDateString() === normalized.toDateString()
    );

    if (exists) {
      setSelectedDays(selectedDays.filter(d => d.toDateString() !== normalized.toDateString()));
    } else {
      setSelectedDays([...selectedDays, normalized]);
    }
  };

  const modifiers = {
    selected: selectedDays,
    unselected: date => !selectedDays.some(d => d.toDateString() === date.toDateString())
  };

  const modifiersStyles = {
    selected: {
      backgroundColor: "red",
      color: "white",
      borderRadius: "50px"
    },
    unselected: {
      backgroundColor: "#e6fad2",
      color: "black",
      borderRadius: "50px"
    }
  };

  const handleSave = async () => {

    try {
      setLoading(true);

      const result = await axios.post(`${server_url}/api/user/professional/set-busy-days`, {
        busyDays: selectedDays.map(d => d.toLocaleDateString("en-CA"))
      }, { withCredentials: true });

      dispatch(setCurrentUserData(result.data));
      setLoading(false);
      setConfirm(false)

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
      setConfirm(false)
    }
  };

  return (
    <>
  <div
    className="card border-0 shadow-lg rounded-4 p-3 p-md-4 w-100"
    style={{ maxWidth: "520px" }}
  >

    {/* ===== Header ===== */}
    <div
      className="text-white rounded-4 p-3 mb-3"
      style={{
        background: "linear-gradient(135deg,#0d6efd,#4f9cff)",
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <FaCalendarAlt size={20} />
        <h5 className="mb-0 fw-bold">Availability Settings</h5>
      </div>
      <small className="opacity-75">
        Mark days when you are not available
      </small>
    </div>

    {/* ===== Calendar ===== */}
    <div className="text-center mb-3">
      <DayPicker
        mode="multiple"
        selected={selectedDays}
        onDayClick={handleDayClick}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        disabled={{ before: new Date() } || confirm}
      />
    </div>

    {/* ===== Confirm Box ===== */}
    {confirm && (
      <div
        className="p-3 rounded-4 mb-3"
        style={{
          background: "rgba(255, 193, 7, 0.08)",
          border: "1px solid rgba(255,193,7,0.4)",
        }}
      >
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2 text-warning fw-semibold">
            <FaExclamationTriangle />
            Confirm Changes
          </div>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setConfirm(false)}
          >
            <IoClose />
          </button>
        </div>

        <p className="small text-muted mb-3">
          Once you confirm, these unavailable days cannot be changed later.
          Please review your selection carefully.
        </p>

        <button
          className="btn btn-warning w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={18} color="#000" />
          ) : (
            <>
              <FaCheckCircle />
              Confirm & Save
            </>
          )}
        </button>
      </div>
    )}

    {/* ===== Save Button ===== */}
    <button
      className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
      style={{
        background: "linear-gradient(135deg,#0d6efd,#4f9cff)",
        border: "none",
      }}
      disabled={confirm}
      onClick={() => setConfirm(true)}
    >
      {loading ? (
        <ClipLoader size={18} color="#fff" />
      ) : (
        <>
          <FaSave />
          Save Selection
        </>
      )}
    </button>
  </div>

    </>
  );
}
