import React from "react";
import "./../css/FixkarLoader.css"

const FixkarLoader = () => {
  return (
    <div className="fixkar-loader-wrapper">
      
      <div className="logo-container">
        {/* Animated Circle Background */}
        <div className="pulse-ring"></div>

        {/* Fixkar Logo */}
        <div className="logo-box">
         <img src="/favicon.png" alt="Fixkar" className="logo-img" />
        </div>
      </div>

      <p className="loading-text">Please wait...</p>
    </div>
  );
};

export default FixkarLoader;
