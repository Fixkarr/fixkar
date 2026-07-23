import { useState } from "react";
import { Card, Button, Collapse, ProgressBar } from "react-bootstrap";
import {
  FaChevronDown,
  FaChevronUp,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";

import CircularProgress from "./CircularProgress";
import RecommendationCard from "./RecommendationCard";
import SectionProgress from "./SectionProgress";
import LevelBadge from "./LevelBadge";

const ProfileHealthCard = ({ profileCompletion, navigate }) => {
  const [expanded, setExpanded] = useState(false);

  if (!profileCompletion) return null;

  const {
    percentage,
    score,
    maxScore,
    level,
    completedSections,
    totalSections,
    nextRecommendation,
    recommendations,
    sections,
  } = profileCompletion;

//   return (
//     <Card className="profile-health-card w-100 border-0 shadow-sm overflow-hidden rounded-3 mb-3">
//       {/* ================= HEADER BANNERS (FULL WIDTH & SLEEK) ================= */}
//       <div 
//         className="px-3 py-2 text-white" 
//         style={{
//           background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//         }}
//       >
//         <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          
//           {/* Left: Info & Badge */}
//           <div className="d-flex align-items-center gap-3">
//             <CircularProgress percentage={percentage} size={48} />
//             <div>
//               <div className="d-flex align-items-center gap-2">
//                 <h6 className="fw-bold mb-0 text-white" style={{ fontSize: "0.95rem" }}>
//                   Profile Health
//                 </h6>
//                 <LevelBadge level={level} />
//               </div>
//               <small className="text-white-50 d-block mt-1" style={{ fontSize: "0.75rem" }}>
//                 Complete your profile to get more customers
//               </small>
//             </div>
//           </div>

//           {/* Right: Score & Section Stats */}
//           <div className="d-flex align-items-center gap-4">
//             <div className="text-end">
//               <span className="text-white-50" style={{ fontSize: "0.75rem" }}>Sections</span>
//               <div className="fw-semibold text-white" style={{ fontSize: "0.85rem" }}>
//                 {completedSections} / {totalSections}
//               </div>
//             </div>

//             <div className="text-end border-start border-secondary ps-3">
//               <div className="d-flex align-items-baseline justify-content-end gap-1">
//                 <span className="text-white fw-bold h5 mb-0">{score}</span>
//                 <span className="text-white-50" style={{ fontSize: "0.75rem" }}>/{maxScore}</span>
//               </div>
//               <span className="badge bg-warning text-dark px-2 py-0 mt-1" style={{ fontSize: "0.7rem" }}>
//                 {percentage}% Completed
//               </span>
//             </div>
//           </div>

//         </div>

//         {/* Sleek Line Progress Bar */}
//         <ProgressBar 
//           now={percentage} 
//           className="mt-2 bg-secondary" 
//           style={{ height: "3px", opacity: 0.8 }} 
//         />
//       </div>

//       {/* ================= NEXT RECOMMENDATION BANNER ================= */}
//       {nextRecommendation && (
//         <div className="w-100 px-3 py-2 bg-light border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
//           <div className="d-flex align-items-center gap-2 overflow-hidden">
//             <span className="badge bg-warning text-dark d-flex align-items-center gap-1 px-2 py-1">
//               <FaBolt style={{ fontSize: "0.75rem" }} />
//               <span>+{nextRecommendation.scoreGain} pts</span>
//             </span>

//             <div className="text-truncate">
//               <span className="fw-bold text-dark me-1" style={{ fontSize: "0.85rem" }}>
//                 {nextRecommendation.title}:
//               </span>
//               <small className="text-secondary text-truncate" style={{ fontSize: "0.8rem" }}>
//                 {nextRecommendation.message}
//               </small>
//             </div>
//           </div>

//           <Button
//             variant="primary"
//             size="sm"
//             className="rounded-pill px-3 py-1 shadow-sm border-0 ms-auto"
//             onClick={() => navigate?.(nextRecommendation.action)}
//             style={{ fontSize: "0.75rem", fontWeight: "600" }}
//           >
//             Complete Now <FaArrowRight className="ms-1" style={{ fontSize: "0.7rem" }} />
//           </Button>
//         </div>
//       )}

//       {/* ================= TOGGLE BUTTON ================= */}
//       <div className="w-100 text-center bg-white py-1">
//         <Button
//           variant="link"
//           size="sm"
//           className="text-decoration-none fw-semibold text-muted py-0"
//           style={{ fontSize: "0.75rem" }}
//           onClick={() => setExpanded(!expanded)}
//         >
//           {expanded ? "Hide Details" : "View Details"}
//           {expanded ? <FaChevronUp className="ms-1" style={{ fontSize: "0.65rem" }} /> : <FaChevronDown className="ms-1" style={{ fontSize: "0.65rem" }} />}
//         </Button>
//       </div>

//       {/* ================= EXPANDABLE AREA ================= */}
//       <Collapse in={expanded}>
//         <div className="border-top bg-light">
//           {/* Section Progress */}
//           <div className="p-3">
//             <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: "0.85rem" }}>
//               Section Progress
//             </h6>
//             <div className="row g-2">
//               {sections.map((section) => (
//                 <div key={section.id} className="col-md-6">
//                   <SectionProgress section={section} navigate={navigate} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Recommendations */}
//           {recommendations.length > 0 && (
//             <div className="border-top p-3 bg-white">
//               <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: "0.85rem" }}>
//                 Recommended Improvements
//               </h6>
//               <div className="row g-2">
//                 {recommendations.map((item, index) => (
//                   <div key={index} className="col-lg-6">
//                     <RecommendationCard
//                       recommendation={item}
//                       navigate={navigate}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Collapse>
//     </Card>
//   );
// };

// export default ProfileHealthCard;


return (
  <Card
    className="border-0 overflow-hidden mb-3"
    style={{
      borderRadius: "22px",
      boxShadow: "0 20px 50px rgba(15,23,42,.12)",
      background: "#fff",
    }}
  >
    {/* ================= PREMIUM HEADER ================= */}
    <div
      className="position-relative overflow-hidden text-white px-4 py-4"
      style={{
        background:
          "linear-gradient(135deg,#2563eb 0%,#3b82f6 45%,#6366f1 100%)",
      }}
    >
      {/* Decorative Circles */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "170px",
          height: "170px",
          background: "rgba(255,255,255,.08)",
          top: "-80px",
          right: "-70px",
        }}
      />

      <div
        className="position-absolute rounded-circle"
        style={{
          width: "100px",
          height: "100px",
          background: "rgba(255,255,255,.06)",
          bottom: "-40px",
          left: "-30px",
        }}
      />

      <div className="position-relative">

        <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">

          {/* Left */}
          <div className="d-flex align-items-center gap-3">

            <div
              className="d-flex justify-content-center align-items-center rounded-circle"
              style={{
                width: "70px",
                height: "70px",
                background: "rgba(255,255,255,.12)",
                backdropFilter: "blur(15px)",
              }}
            >
              <CircularProgress
                percentage={percentage}
                size={56}
              />
            </div>

            <div>

              <div className="d-flex align-items-center gap-2 flex-wrap">

                <h5 className="fw-bold mb-0">
                  Profile Health
                </h5>

                <LevelBadge level={level} />

              </div>

              <div
                className="mt-2"
                style={{
                  color: "rgba(255,255,255,.85)",
                  fontSize: ".88rem",
                }}
              >
                Improve your profile to rank higher and
                receive more customer bookings.
              </div>

              {/* Benefits */}

              <div className="d-flex gap-2 flex-wrap mt-3">

                <span
                  className="px-3 py-1 rounded-pill"
                  style={{
                    background: "rgba(255,255,255,.14)",
                    fontSize: ".75rem",
                  }}
                >
                  👀 Better Visibility
                </span>

                <span
                  className="px-3 py-1 rounded-pill"
                  style={{
                    background: "rgba(255,255,255,.14)",
                    fontSize: ".75rem",
                  }}
                >
                  🚀 More Leads
                </span>

                <span
                  className="px-3 py-1 rounded-pill"
                  style={{
                    background: "rgba(255,255,255,.14)",
                    fontSize: ".75rem",
                  }}
                >
                  ⭐ Higher Trust
                </span>

              </div>

            </div>

          </div>

          {/* Right Stats */}

          <div
            className="d-flex gap-3 flex-wrap justify-content-end"
          >

            <div
              className="text-center px-3 py-3"
              style={{
                minWidth: "110px",
                borderRadius: "18px",
                background: "rgba(255,255,255,.14)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div
                style={{
                  fontSize: ".72rem",
                  opacity: .8,
                }}
              >
                Sections
              </div>

              <div
                className="fw-bold mt-1"
                style={{
                  fontSize: "1.2rem",
                }}
              >
                {completedSections}
                <span
                  style={{
                    opacity: .7,
                    fontSize: ".9rem",
                  }}
                >
                  /{totalSections}
                </span>
              </div>

            </div>

            <div
              className="text-center px-3 py-3"
              style={{
                minWidth: "120px",
                borderRadius: "18px",
                background: "rgba(255,255,255,.14)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div
                style={{
                  fontSize: ".72rem",
                  opacity: .8,
                }}
              >
                Score
              </div>

              <div
                className="fw-bold mt-1"
                style={{
                  fontSize: "1.2rem",
                }}
              >
                {score}
                <span
                  style={{
                    opacity: .7,
                    fontSize: ".9rem",
                  }}
                >
                  /{maxScore}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Progress */}

        <div className="mt-4">

          <div className="d-flex justify-content-between mb-2">

            <small
              style={{
                color: "rgba(255,255,255,.85)",
              }}
            >
              Overall Completion
            </small>

            <strong>{percentage}%</strong>

          </div>

          <ProgressBar
            now={percentage}
            style={{
              height: "9px",
              borderRadius: "50px",
              background: "rgba(255,255,255,.18)",
            }}
          />

        </div>

      </div>

    </div>

    {/* ================= NEXT RECOMMENDATION ================= */}

    {nextRecommendation && (

      <div
        className="m-3 p-3"
        style={{
          borderRadius: "18px",
          background:
            "linear-gradient(90deg,#FFF7ED,#FEF3C7)",
          border: "1px solid #FDE68A",
        }}
      >

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div className="d-flex align-items-center gap-3">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                background: "#F59E0B",
                color: "#fff",
              }}
            >
              <FaBolt />
            </div>

            <div>

              <div
                className="fw-bold"
                style={{
                  fontSize: ".95rem",
                }}
              >
                {nextRecommendation.title}
              </div>

              <div
                className="text-muted"
                style={{
                  fontSize: ".82rem",
                }}
              >
                {nextRecommendation.message}
              </div>

              <span
                className="badge mt-2"
                style={{
                  background: "#fff",
                  color: "#F59E0B",
                  border: "1px solid #FCD34D",
                }}
              >
                +{nextRecommendation.scoreGain} Score
              </span>

            </div>

          </div>

          <Button
            onClick={() =>
              navigate?.(
                nextRecommendation.action
              )
            }
            className="rounded-pill px-4 border-0 fw-semibold"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#4f46e5)",
              boxShadow:
                "0 10px 20px rgba(37,99,235,.25)",
            }}
          >
            Complete Now
            <FaArrowRight className="ms-2" />
          </Button>

        </div>

      </div>

    )}

    {/* ================= TOGGLE ================= */}

    <div className="text-center pb-3">

      <Button
        variant="light"
        onClick={() =>
          setExpanded(!expanded)
        }
        className="rounded-pill px-4 fw-semibold border"
        style={{
          borderColor: "#E2E8F0",
        }}
      >
        {expanded
          ? "Hide Insights"
          : "View Insights"}

        {expanded
          ? (
            <FaChevronUp className="ms-2" />
          )
          : (
            <FaChevronDown className="ms-2" />
          )}

      </Button>

    </div>

    {/* ================= EXPANDABLE AREA ================= */}
    <Collapse in={expanded}>
  <div
    style={{
      background: "#F8FAFC",
      borderTop: "1px solid #E2E8F0",
    }}
  >
    {/* ================= SECTION PROGRESS ================= */}

    <div className="p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h5 className="fw-bold mb-1">
            Section Progress
          </h5>

          <small className="text-muted">
            Complete each section to improve your ranking.
          </small>

        </div>

        <span
          className="badge rounded-pill px-3 py-2"
          style={{
            background: "#DBEAFE",
            color: "#1D4ED8",
            fontSize: ".8rem",
          }}
        >
          {completedSections}/{totalSections} Completed
        </span>

      </div>

      <div className="row g-3">

        {sections.map((section) => (

          <div
            key={section.id}
            className="col-lg-6"
          >

            <div
              className="h-100 p-3"
              style={{
                background: "#fff",
                borderRadius: "18px",
                border: "1px solid #E2E8F0",
                boxShadow:
                  "0 8px 20px rgba(15,23,42,.04)",
                transition: ".25s",
              }}
            >
              <SectionProgress
                section={section}
                navigate={navigate}
              />
            </div>

          </div>

        ))}

      </div>

    </div>

    {/* ================= RECOMMENDATIONS ================= */}

    {recommendations.length > 0 && (

      <div
        className="px-4 pb-4"
      >

        <div
          className="p-4"
          style={{
            background: "#fff",
            borderRadius: "22px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 10px 25px rgba(15,23,42,.05)",
          }}
        >

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <h5 className="fw-bold mb-1">
                Recommended Improvements
              </h5>

              <small className="text-muted">
                These actions will increase your profile score faster.
              </small>

            </div>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background: "#FEF3C7",
                color: "#B45309",
              }}
            >
              {recommendations.length} Tasks
            </span>

          </div>

          <div className="row g-3">

            {recommendations.map(
              (item, index) => (

                <div
                  key={index}
                  className="col-lg-6"
                >

                  <div
                    className="h-100 p-2"
                    style={{
                      borderRadius: "16px",
                      background: "#F8FAFC",
                    }}
                  >

                    <RecommendationCard
                      recommendation={item}
                      navigate={navigate}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    )}

    {/* ================= FOOTER ================= */}

    <div
      className="mx-4 mb-4 p-4 text-center"
      style={{
        borderRadius: "22px",
        background:
          "linear-gradient(135deg,#EFF6FF,#EEF2FF)",
        border: "1px solid #DBEAFE",
      }}
    >

      <div
        className="fw-bold"
        style={{
          fontSize: "1rem",
        }}
      >
        🚀 Keep Improving Your Profile
      </div>

      <div
        className="text-muted mt-2"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          fontSize: ".88rem",
        }}
      >
        Professionals with a profile score above
        <strong> 90%</strong> generally receive
        more visibility, better customer trust,
        and higher booking opportunities.
      </div>

      <div className="mt-3">

        <span
          className="badge rounded-pill px-4 py-2"
          style={{
            background:
              percentage >= 90
                ? "#DCFCE7"
                : "#DBEAFE",
            color:
              percentage >= 90
                ? "#166534"
                : "#1D4ED8",
            fontSize: ".85rem",
          }}
        >
          Current Completion : {percentage}%
        </span>

      </div>

    </div>

   </div>
    </Collapse>
  </Card>
);
};

export default ProfileHealthCard;