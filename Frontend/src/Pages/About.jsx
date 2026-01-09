
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const About = () => {
    const location = useLocation();
    const { pathname } = location;

  return (
    <>
      {/* ===== SEO ===== */}
    {pathname !== "/" && <>
         <Helmet>
        <title>About Fixkar – Smart & Technology Driven Service Platform</title>
        <meta
          name="description"
          content="Fixkar is a technology-driven service platform connecting users with skilled professionals who use modern tools and smart equipment to deliver reliable services across multiple categories."
        />
      </Helmet>
      <Navbar/>
     </>}

      {/* ===== ABOUT CONTENT ===== */}
      <div className="container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">

            <h1 className="fw-bold mb-4 text-primary">
              About Fixkar
            </h1>

            <p className="text-muted">
              Fixkar is a smart, technology-driven service platform designed to
              simplify the way users connect with skilled service professionals.
              We focus on quality, reliability, and efficiency by enabling
              professionals to use modern tools and smart equipment for
              delivering services across multiple categories.
            </p>

            <p className="text-muted">
              Unlike traditional service models limited to specific categories,
              Fixkar supports a wide range of service needs. Our platform allows
              users to find professionals based on availability, location, and
              service requirements, ensuring a smooth and transparent
              experience.
            </p>

            <h5 className="fw-semibold mt-4">
              Our Mission
            </h5>
            <p className="text-muted">
              Our mission is to bridge the gap between customers and trusted
              professionals by leveraging technology, smart equipment, and
              modern service practices to deliver dependable and efficient
              solutions.
            </p>

            <h5 className="fw-semibold mt-4">
              Why Choose Fixkar?
            </h5>
            <ul className="text-muted">
              <li>Technology-driven service platform</li>
              <li>Professionals equipped with modern tools</li>
              <li>Multiple service categories supported</li>
              <li>Transparent booking and service process</li>
              <li>Customer-focused support system</li>
            </ul>

            <p className="text-muted mt-4">
              At Fixkar, we are committed to building a reliable ecosystem where
              users receive high-quality services and professionals grow through
              smart, technology-enabled work practices.
            </p>

          </div>
        </div>
      </div>
      {pathname !== "/" && <Footer/>}
    </>
  );
};

export default About;
