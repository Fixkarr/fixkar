import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination, Autoplay} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import '../css/testimonial.css'
import { FaQuoteLeft } from "react-icons/fa";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";

const Testimonial = () => {
  return (
    <>
   <div
  className="testimonial py-5"
  style={{
    background: "linear-gradient(180deg, #f8f9ff 0%, #eef3ff 100%)",
  }}
>
  {/* ===== Header ===== */}
  <div className="text-center mb-5">
    <span
      className="badge rounded-pill px-4 py-2 mb-3"
      style={{
        background: "linear-gradient(135deg, #0d6efd, #4f9cff)",
        color: "#fff",
      }}
    >
      💬 Testimonials
    </span>

    <h3 className="fw-bold display-6">
      Our <span className="text-primary">Happy Clients</span>
    </h3>

    <p className="text-muted mt-2">
      Real experiences from customers who trust Fixkar
    </p>
  </div>

  {/* ===== Swiper ===== */}
  <div className="container">
    <Swiper
      className="swiper pb-5"
      pagination={{ clickable: true }}
      slidesPerView={3}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      modules={[Pagination, Autoplay]}
      breakpoints={{
        320: { slidesPerView: 1 },
        750: { slidesPerView: 2 },
        1150: { slidesPerView: 3 },
      }}
    >
      {[
        {
          name: "Pankaj Upadhyay",
          image: "Images/user4.jpg",
        },
        {
          name: "Arun Kumar",
          image: "Images/user1.jpg",
        },
        {
          name: "Ashish Gupta",
          image: "Images/user3.jpg",
        },
        {
          name: "Nidhi Sharma",
          image: "Images/user2.jpg",
        },
      ].map((user, index) => (
        <SwiperSlide key={index}>
          <div className="h-100 px-2">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 testimonial-card">

              {/* Quote Icon */}
              <div className="mb-3 text-primary">
                <FaQuoteLeft size={26} />
              </div>

              {/* Review */}
              <p className="text-muted small mb-4">
                I had an amazing experience using Fixkar. The professionals were
                punctual, polite, and highly skilled. The entire process was
                smooth and hassle-free. Highly recommended!
              </p>

              {/* Rating */}
              <div className="text-warning mb-3">
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStarHalf />
              </div>

              {/* User */}
              <div className="d-flex align-items-center gap-3 mt-auto">
                <img
                  src={user.image}
                  alt={user.name}
                  width="50"
                  height="50"
                  className="rounded-circle border"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <h6 className="fw-semibold mb-0">{user.name}</h6>
                  <small className="text-muted">Verified Customer</small>
                </div>
              </div>

            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</div>

    </>
  )
}

export default Testimonial
