import {
  FaSearch,
  FaUserCheck,
  FaComments,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTools,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaStar,
  FaCheckCircle,
  FaListAlt,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaSearch />,
    title: "Search Nearby Professionals",
    desc: "Find trusted professionals available near your location.",
  },
  {
    icon: <FaUserCheck />,
    title: "Compare Profiles",
    desc: "Compare experience, services, ratings and reviews.",
  },
  {
    icon: <FaComments />,
    title: "Chat or Hire",
    desc: "Chat with professionals or send a direct hire request.",
  },
  {
    icon: <FaClipboardCheck />,
    title: "Request Accepted",
    desc: "Professional accepts your booking request.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Professional Visit",
    desc: "Professional arrives at your location on scheduled date.",
  },
  {
    icon: <FaShieldAlt />,
    title: "OTP Verification",
    desc: "Arrival is verified securely using OTP.",
  },
  {
    icon: <FaTools />,
    title: "Work In Progress",
    desc: "Professional starts and completes the required work.",
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "Receive Final Quote",
    desc: "Professional sends the final quotation amount.",
  },
  {
    icon: <FaCreditCard />,
    title: "Make Payment",
    desc: "Pay securely after reviewing the quotation.",
  },
  {
    icon: <FaStar />,
    title: "Rate & Review",
    desc: "Share your experience with ratings and reviews.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Booking Completed",
    desc: "Your service booking is successfully completed.",
  },
  {
    icon: <FaListAlt />,
    title: "Track in My Bookings",
    desc: "View booking history and status anytime.",
  },
];

export default function Working() {
  return (
    <section className="py-5 bg-light">
      <div className="container">

        <div className="text-center mb-5">
          <span className="badge bg-primary px-3 py-2 rounded-pill mb-3">
            HOW IT WORKS
          </span>

          <h2 className="fw-bold">
            Book Local Professionals in Simple Steps
          </h2>

          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            From finding nearby professionals to completing payment and
            tracking your booking, Fixkar makes every step simple,
            transparent and secure.
          </p>
        </div>

        <div className="row g-4">

          {steps.map((step, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card border-0 shadow-sm h-100 rounded-4 how-card">

                <div className="card-body text-center p-4">

                  <div className="step-number">
                    {index + 1}
                  </div>

                  <div className="icon-box mb-3">
                    {step.icon}
                  </div>

                  <h5 className="fw-bold mb-2">
                    {step.title}
                  </h5>

                  <p className="text-muted small mb-0">
                    {step.desc}
                  </p>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}