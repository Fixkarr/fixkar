import { FaQuestionCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

const FAQSection = ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know!",
  faqs = [
  {
    question: "What is Fixkar?",
    answer:
      "FixKar is an online platform that helps customers find and hire verified electricians, plumbers, carpenters, painters, builders, labourers, civil engineers, and other home service professionals near their location."
  },
  {
    question: "How does Fixkar work?",
    answer:
      "Customers can search for nearby professionals, compare their profiles, experience, skills, ratings, and service charges, then send a hiring request directly through FixKar."
  },
  {
    question: "Are professionals on Fixkar verified?",
    answer:
      "Yes. Every professional on Fixkar completes a document verification process before becoming available for customer bookings."
  },
  {
    question: "Which services are available on Fixkar?",
    answer:
      "FixKar offers electricians, plumbers, carpenters, painters, builders, civil engineers, labourers, and other home repair and maintenance services."
  },
  {
    question: "How can I hire a professional on Fixkar?",
    answer:
      "Simply search for a service, choose a verified professional, review their profile, and click the Hire button to submit your booking request."
  },
  {
    question: "How are service charges decided?",
    answer:
      "Service charges are decided by the professional based on their skills, experience, work type, and location. Customers can review the charges before hiring."
  },
  {
    question: "Can I hire professionals near my location?",
    answer:
      "Yes. Fixkar helps customers find verified professionals based on their selected location so they can hire nearby service providers."
  },
  {
    question: "Can I compare professionals before hiring?",
    answer:
      "Yes. Customers can compare professionals based on experience, skills, ratings, reviews, availability, and pricing before making a hiring decision."
  },
  {
    question: "Is Fixkar available across India?",
    answer:
      "FixKar is expanding across India. Service availability depends on the number of verified professionals available in your city or locality."
  },
  {
    question: "How can professionals join Fixkar?",
    answer:
      "Skilled professionals can apply through the professional registration process, complete document verification, and start receiving customer hiring requests after approval."
  }
]
}) => {
  if (!faqs?.length) return null;

  return (
    <section className="container my-5">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

        {/* Header */}
        <div
          className="text-white p-4"
          style={{
            background: "linear-gradient(135deg,#0d6efd,#4f9cff)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: 55,
                height: 55,
              }}
            >
              <FaQuestionCircle size={24} />
            </div>

            <div>
              <h3 className="fw-bold mb-1">{title}</h3>
              <p className="mb-0 opacity-75">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="card-body p-0">

          <div className="accordion accordion-flush" id="faqAccordion">

            {faqs.map((faq, index) => (
              <div
                key={index}
                className="accordion-item border-bottom"
              >
                <h2
                  className="accordion-header"
                  id={`heading${index}`}
                >
                  <button
                    className={`accordion-button ${
                      index !== 0 ? "collapsed" : ""
                    } fw-semibold py-3`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                  >
                    <div className="d-flex align-items-center gap-2">

                      <span className="badge bg-primary rounded-pill">
                        {index + 1}
                      </span>

                      <span>{faq.question}</span>
                    </div>
                  </button>
                </h2>

                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-secondary lh-lg">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;