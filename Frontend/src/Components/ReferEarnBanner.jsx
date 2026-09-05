import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGift,
  FaArrowRight,
  FaCoins,
  FaStar,
  FaBolt,
  FaUserPlus,
  FaHandSparkles,
} from "react-icons/fa6";

import "../css/referEarn.css";

const ReferEarnBanner = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/referrals");
  };

  return (
    <section
      className="refer-earn-banner"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleNavigate();
        }
      }}
    >
      {/* Decorative floating icons */}
      <div className="refer-floating-icon refer-floating-one">
        <FaCoins />
      </div>

      <div className="refer-floating-icon refer-floating-two">
        <FaStar />
      </div>

      <div className="refer-floating-icon refer-floating-three">
        <FaBolt />
      </div>

      <div className="refer-banner-shine" />

      {/* Left Content */}
      <div className="refer-banner-content">
        <div className="refer-banner-badge">
          <FaHandSparkles />
          <span>EXCLUSIVE REWARD</span>
        </div>

        <div className="refer-banner-title-row">
          <div className="refer-gift-icon">
            <FaGift />
          </div>

          <div>
            <h3>Refer & Earn Cash Prize</h3>

            <p>
              Invite friends & earn rewards when they complete
              their first booking.
            </p>
          </div>
        </div>
      </div>

      {/* Reward Visual */}
      <div className="refer-reward-area">
        <div className="refer-reward-orbit refer-orbit-one" />
        <div className="refer-reward-orbit refer-orbit-two" />

        <div className="refer-reward-card">
          <div className="refer-reward-card-icon">
            <FaCoins />
          </div>

          <div className="refer-reward-card-text">
            <span>Earn up to</span>
            <strong>₹100</strong>
          </div>
        </div>

        <div className="refer-mini-reward">
          <FaUserPlus />
          <span>Refer friends</span>
        </div>
      </div>

      {/* CTA */}
      <div className="refer-banner-action">
        <span>Refer Now</span>

        <div className="refer-arrow">
          <FaArrowRight />
        </div>
      </div>
    </section>
  );
};

export default ReferEarnBanner;