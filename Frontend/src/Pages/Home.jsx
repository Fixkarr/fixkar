import React from 'react'
import Navbar from '../Components/Navbar'
import '../css/home.css'
import Services from '../Components/Services'
import Values from '../Components/Values'
import Testimonial from '../Components/Testimonial'
import Contact from '../Components/Contact'
import Footer from '../Components/Footer'


const Home = () => {
  return (
    <>
      <Navbar/>

      {/* hero  */}
        <div className="hero">
      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="overlay">
      <div className="hero-text">
        <h1>Find Skilled Professionals Near. <br /> ~~ Fast Reliable</h1>
      </div>
    </div>
    <div className="carousel-item active" data-bs-interval="2000">
      <img src="Images/electrician.jpg" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src="Images/blacksmith.webp" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src="Images/Carpenter.webp" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src="Images/plumbing.jpg" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src="Images/Engineering.webp" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src="Images/painter.webp" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="Images/construction.jpg" className="d-block w-100" alt="..."/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
      </div>

      {/* services  */}
      <Services/>
      {/* values */}
      <Values/>
      {/* testimonials */}
      <Testimonial/>
      {/* Contact */}
      <Contact/>

      {/* Footer */}
      <Footer/>
    </>
  ) 
}

export default Home
