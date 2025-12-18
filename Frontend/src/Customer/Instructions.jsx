import React from "react";
import { BsInfoCircleFill, BsShieldLockFill } from "react-icons/bs";

const Instructions = () => {
  return (
    <div className="card border-0 shadow-sm mb-3">
      {/* Header */}
      <div className="card-header bg-warning-subtle d-flex align-items-center gap-2">
        <BsInfoCircleFill className="text-warning" />
        <h6 className="mb-0 fw-semibold">Important Instructions</h6>
      </div>

      {/* Body */}
      <div className="card-body">
        <ul className="list-unstyled mb-0">

          {/* Instruction 1 */}
          <li className="mb-3">
            <div className="d-flex gap-2">
              <BsShieldLockFill className="text-danger mt-1" />
              <div>
                <p className="mb-1 fw-semibold text-dark">
                  Never share your personal contact details in chat.
                </p>
                <p className="mb-0 text-muted small hindi">
                  कभी भी अपनी व्यक्तिगत संपर्क जानकारी (जैसे मोबाइल नंबर,
                  ईमेल, पता, OTP आदि) चैट में किसी के साथ साझा न करें।
                </p>
              </div>
            </div>
          </li>

          {/* Instruction 2 */}
          <li className="mb-3">
            <div className="d-flex gap-2">
              <BsInfoCircleFill className="text-primary mt-1" />
              <div>
                <p className="mb-1 fw-semibold text-dark">
                  Talk to the professional before hiring them.
                </p>
                <p className="mb-0 text-muted small hindi">
                  किसी भी प्रोफेशनल को हायर करने से पहले उनसे बातचीत अवश्य
                  करें। इसी उद्देश्य के लिए आपको यह चैट सुविधा प्रदान की गई
                  है।
                </p>
              </div>
            </div>
          </li>

          {/* Instruction 3 */}
          <li className="mb-3">
            <div className="d-flex gap-2">
              <BsInfoCircleFill className="text-primary mt-1" />
              <div>
                <p className="mb-1 fw-semibold text-dark">
                  Charges shown on the profile are for information purposes only.
                </p>
                <p className="mb-0 text-muted small hindi">
                  प्रोफेशनल की प्रोफ़ाइल में दिखाए गए चार्ज केवल जानकारी के
                  उद्देश्य से होते हैं। वास्तविक शुल्क काम और समय के अनुसार
                  बदल सकते हैं। सही शुल्क जानने के लिए कृपया पहले प्रोफेशनल
                  से बातचीत करें ताकि किसी भी प्रकार की भ्रम की स्थिति न हो।
                </p>
              </div>
            </div>
          </li>

          {/* Instruction 4 */}
          <li>
            <div className="d-flex gap-2">
              <BsInfoCircleFill className="text-primary mt-1" />
              <div>
                <p className="mb-1 fw-semibold text-dark">
                  Contact the support team if you have any questions or confusion.
                </p>
                <p className="mb-0 text-muted small hindi">
                  यदि आपको किसी भी प्रकार की जानकारी चाहिए या कोई भ्रम है,
                  तो बिना किसी संकोच के सपोर्ट टीम से संपर्क करें। हम आपकी
                  सहायता के लिए हमेशा उपलब्ध हैं।
                </p>
              </div>
            </div>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Instructions;
