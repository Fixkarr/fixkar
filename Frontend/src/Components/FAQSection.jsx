import { FaQuestionCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

const FAQSection = ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know!",
  faqs = []
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