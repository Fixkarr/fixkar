
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { server_url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

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
      <div className="p-3 w-full d-flex justify-content-center flex-column relative">
        <center>
          <h3 className="text-primary mb-3">Mark Days You Are Not Available</h3>
          <DayPicker
            mode="multiple"
            selected={selectedDays}
            onDayClick={handleDayClick}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            disabled={{ before: new Date()}||confirm }
          />
        </center>
        {
          confirm && (
            <div className="text-dark p-4 confirm">
              <button className="close btn border border-danger text-danger" onClick={()=>setConfirm(false)}>close</button>
              <h4>Confirm to save changes</h4>
              <p className="text-danger">Once you click confirm, you cannot change it later, so make the selection carefully.</p>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? <ClipLoader size={20} /> : "Confirm"}</button>
            </div>
          )
        }
        <button className="btn btn-primary w-100 mt-3" disabled={confirm} onClick={()=>setConfirm(true)}>
          {loading ? <ClipLoader size={20} /> : "Save"}
        </button>
      </div>
    </>
  );
}
