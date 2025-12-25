import React from "react";

const DayCard = ( {year, day, month} ) => {
 
  return (
    <div
      className="day-card bg-danger welcome"
    >
      {/* YEAR */}
      <small className="day-year">{year}</small>

      {/* DAY */}
      <h3 className="day-number">
        {day}
      </h3>

      {/* MONTH */}
      <small className="day-month">{month}</small>
    </div>
  );
};

export default DayCard;
