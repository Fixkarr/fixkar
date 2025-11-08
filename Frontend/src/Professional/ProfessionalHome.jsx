import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import Availability from "./Availability";
import DayCard from "./DayCard";
const ProfessionalHome = () => {
  const navigate = useNavigate()
  const { currentUserData } = useSelector((state) => state.user);
  const user = currentUserData?.user;
  const userId = currentUserData?.user?.userId;
  const isProfileComplete = Boolean(user?.charges);
   const [showSelectedDays, setShowSelectedDays] = useState([]);
   useEffect(() => {
    if (currentUserData?.user?.busyDays) {
      const converted = currentUserData.user.busyDays.map(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // normalize
        return d;
      });
     setShowSelectedDays(converted)
    }
  }, [currentUserData]);


  return (
    <div className="p-md-5 p-2">
    
     <div className="d-flex justify-content-between w-full">
       <div>
        <h2 className="welcome">
          Welcome, <span className="text-primary">{userId?.fullName}!</span>
        </h2>
      </div>
      <button type="button" className="btn btn-primary" role="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <span className="hide">Mark Busy days </span> <SlCalender/>
      </button>
     <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
       <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <Availability/>
      </div>
    </div>
  </div>
</div>
     </div>

      {!isProfileComplete && (
        <div className="alert alert-warning d-flex align-items-center gap-md-3 flex-column flex-md-row p-4 rounded shadow-sm">
          <div className="flex-grow-1">
            <h5 className="mb-2 fw-bold welcome">Complete Your Profile!</h5>
            <p className="mb-2" style={{ fontSize: "0.8vmax", lineHeight: "1.4" }}>
              Your profile is currently incomplete. Please complete your profile
              so that customers can understand you better, <br /> which will increase
              your chances of getting work.
            </p>

            <ul className="mb-3 ps-3"  style={{ fontSize: "0.8vmax", lineHeight: "1.4" }}>
              {<li>Profile Description missing</li>}
              {<li>Service Charges not set</li>}
              <li>Profile looking incomplete to customers</li>
            </ul>
          </div>

          <button onClick={()=>navigate("/professional/complete-profile")} style={{fontSize : "0.9vmax"}}
            className="btn btn-primary btn-sm px-md-4 py-md-2 m-0 fw-semibold"
          >
            Complete Now
          </button>
        </div>
      )}

      
      
        {!showSelectedDays.length <= 0 && (
          <>
             <h2 className="welcome mt-lg-4">You are busy on these dates!</h2>
          <div className="d-flex flex-wrap gap-2">
        {showSelectedDays.map(d => {
          return <DayCard key={d}
             year={new Date(d).getFullYear()}
            day={String(new Date(d).getDate()).padStart(2, "0")}
            month={new Date(d).toLocaleString("default", { month: "short" })}
          />
        }
        )}
          </div>
          </>
      )} 
    
    </div>
  );
};

export default ProfessionalHome;
