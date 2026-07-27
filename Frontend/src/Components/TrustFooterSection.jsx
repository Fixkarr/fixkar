import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaShieldAlt,
  FaBuilding,
  FaIdCard,
  FaCheckCircle,
} from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { Card, Row, Col, Container } from "react-bootstrap";

export default function TrustFooterSection() {
  return (
    <Container className="my-5">
      <Row className="g-4">

        {/* Why Fixkarr */}

        {/* Security */}
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 text-primary">
                Secure & Trusted
              </h5>

              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-success bg-opacity-10 rounded-circle p-3 me-3"
                >
                  <FaShieldAlt className="text-success" size={24} />
                </div>

                <div>
                  <h6 className="mb-1 fw-bold">SSL Secured</h6>
                  <small className="text-muted">
                    Your data is encrypted.
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle p-3 me-3"
                >
                  <SiRazorpay className="text-primary" size={22} />
                </div>

                <div>
                  <h6 className="mb-1 fw-bold">Secure Payments</h6>
                  <small className="text-muted">
                    Powered by Razorpay
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Company */}
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">

              <h5 className="fw-bold text-primary mb-3">
                About Fixkar Smart Solutions Private Limited
              </h5>

              <p className="text-muted small">
                Fixkarr Smart Solutions Pvt. Ltd. connects customers with
                trusted and verified home service professionals across India.
              </p>

              <hr />

              <div className="mb-2">
                <FaBuilding className="text-primary me-2" />
                <strong>CIN</strong>
                <div className="small text-muted">
                  U62013UP2026PTC250005
                </div>
              </div>

              <div className="mb-2">
                <FaIdCard className="text-primary me-2" />
                <strong>GSTIN</strong>
                <div className="small text-muted">
                  NOT YET
                </div>
              </div>

              <div>
                <FaCheckCircle className="text-primary me-2" />
                <strong>MSME</strong>
                <div className="small text-muted">
                  UDYAM-UP-75-0197914
                </div>
              </div>

            </Card.Body>
          </Card>
        </Col>

        {/* Government */}
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">

              <h5 className="fw-bold text-primary mb-4">
                Trusted & Registered
              </h5>

              <div
                className="border rounded-4 p-3 mb-3 text-center"
              >
                <img
                  src="Images/gov.png"
                  alt=""
                  style={{ height: 55 }}
                />

                <div className="fw-semibold mt-2">
                  Government of India
                </div>

                <small className="text-muted">
                  Registered Company
                </small>
              </div>

              <div
                className="border rounded-4 p-3 text-center"
              >
                <img
                  src="Images/msme.png"
                  alt=""
                  style={{ height: 55 }}
                />

                <div className="fw-semibold mt-2">
                  MSME Registered
                </div>

                <small className="text-muted">
                  Ministry of MSME
                </small>
              </div>

            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}