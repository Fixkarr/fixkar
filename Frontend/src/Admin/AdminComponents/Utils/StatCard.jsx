import React from "react";

const StatCard = ({ title, value, icon, color }) => (
  <>
    <style>{`
      .fixkar-stat-card {
        position: relative;

        width: 100%;
        min-height: 108px;

        padding: 14px;

        overflow: hidden;

        border-radius: 16px;

        background: rgba(255, 255, 255, 0.055);

        border: 1px solid rgba(255, 255, 255, 0.08);

        box-shadow:
          0 12px 30px rgba(0, 0, 0, 0.16);

        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);

        transition:
          transform 0.25s ease,
          border-color 0.25s ease,
          box-shadow 0.25s ease;
      }

      .fixkar-stat-card::before {
        content: "";

        position: absolute;

        width: 95px;
        height: 95px;

        right: -38px;
        bottom: -48px;

        border-radius: 50%;

        background: var(--stat-gradient);

        opacity: 0.14;

        filter: blur(3px);

        pointer-events: none;
      }

      .fixkar-stat-card::after {
        content: "";

        position: absolute;

        top: 0;
        left: 14px;
        right: 14px;

        height: 2px;

        border-radius: 999px;

        background: var(--stat-gradient);

        opacity: 0.85;
      }

      .fixkar-stat-card:hover {
        transform: translateY(-3px);

        border-color: rgba(255, 255, 255, 0.15);

        box-shadow:
          0 18px 38px rgba(0, 0, 0, 0.22);
      }

      .fixkar-stat-content {
        position: relative;
        z-index: 2;

        min-width: 0;
      }

      .fixkar-stat-title {
        color: #94a3b8;

        font-size: 8px;
        font-weight: 700;

        text-transform: uppercase;

        letter-spacing: 0.55px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        margin-bottom: 6px;
      }

      .fixkar-stat-value {
        color: #f8fafc;

        font-size: 23px;
        line-height: 1;

        font-weight: 800;

        margin: 0;
      }

      .fixkar-stat-icon {
        position: relative;
        z-index: 2;

        width: 36px;
        height: 36px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 11px;

        color: #fff;

        background: var(--stat-gradient);

        box-shadow:
          0 8px 18px rgba(0, 0, 0, 0.20);

        font-size: 14px;

        transition:
          transform 0.25s ease;
      }

      .fixkar-stat-card:hover .fixkar-stat-icon {
        transform: scale(1.06) rotate(-2deg);
      }

      @media (max-width: 575.98px) {

        .fixkar-stat-card {
          min-height: 92px;

          padding: 11px;

          border-radius: 13px;
        }

        .fixkar-stat-title {
          font-size: 7px;

          letter-spacing: 0.35px;

          margin-bottom: 5px;
        }

        .fixkar-stat-value {
          font-size: 19px;
        }

        .fixkar-stat-icon {
          width: 31px;
          height: 31px;

          border-radius: 9px;

          font-size: 12px;
        }

        .fixkar-stat-card::after {
          left: 11px;
          right: 11px;
        }
      }
    `}</style>

    <div
      className="fixkar-stat-card"
      style={{
        "--stat-gradient": color,
      }}
    >
      <div className="d-flex justify-content-between align-items-center gap-2 h-100">

        {/* Content */}
        <div className="fixkar-stat-content">
          <div className="fixkar-stat-title">
            {title}
          </div>

          <h3 className="fixkar-stat-value">
            {value ?? 0}
          </h3>
        </div>

        {/* Icon */}
        <div className="fixkar-stat-icon">
          {icon}
        </div>

      </div>
    </div>
  </>
);

export default StatCard;