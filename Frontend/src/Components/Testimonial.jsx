import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import {Pagination, Autoplay} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import '../css/testimonial.css'
const Testimonial = () => {
  return (
    <>
     <div className="testimonial py-5">
              <h3 className="fs-3 text-center mx-auto">Our Testimonials</h3>
              <p className='p-title text-center my-3'>Our Happy Clients</p>
              <div className="swiperContainer">
               <Swiper className='swiper'
                pagination={true}
                slidesPerView={3}
                autoplay={true}
                modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { // mobile
            slidesPerView: 1,
          },
          750: { // tablet
            slidesPerView: 2,
          },
          1150: { // tablet
            slidesPerView: 3,
          },
          // 1280: { // large screen
          //   slidesPerView: 3,
          // },
        }}
                  >
                <SwiperSlide>
                   <div className="swipCard">
                  <div className="author">
                    <div className="image">
                    <img src="Images/user4.jpg" alt="" />
                  </div>
                  <div>
                    <b className='text-center'>Pankaj Upadhyay</b>
                    <p><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStarHalf /></p>
                  </div>
                  
                  </div>
                  <div className="info">
                    <p>I had an amazing experience using this service. The professionals were on time, polite, and really knew what they were doing. It saved me so much effort and I'll definitely use it again.</p>
                  </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                   <div className="swipCard">
                  <div className="author">
                    <div className="image">
                    <img src="Images/user1.jpg" alt="" />
                  </div>
                  <div>
                    <b className='text-center'>Arun Kumar</b>
                    <p><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStarHalf /></p>
                  </div>
                  
                  </div>
                  <div className="info">
                    <p>I had an amazing experience using this service. The professionals were on time, polite, and really knew what they were doing. It saved me so much effort and I'll definitely use it again.</p>
                  </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                   <div className="swipCard">
                  <div className="author">
                    <div className="image">
                    <img src="Images/user3.jpg" alt="" />
                  </div>
                  <div>
                    <b className='text-center'>Ashish Gupta</b>
                    <p><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStarHalf /></p>
                  </div>
                  
                  </div>
                  <div className="info">
                    <p>I had an amazing experience using this service. The professionals were on time, polite, and really knew what they were doing. It saved me so much effort and I'll definitely use it again.</p>
                  </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                   <div className="swipCard">
                  <div className="author">
                    <div className="image">
                    <img src="Images/user2.jpg" alt="" />
                  </div>
                  <div>
                    <b className='text-center'>Nidhi Sharma</b>
                    <p><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStarHalf /></p>
                  </div>
                  
                  </div>
                  <div className="info">
                    <p>I had an amazing experience using this service. The professionals were on time, polite, and really knew what they were doing. It saved me so much effort and I'll definitely use it again.</p>
                  </div>
                </div>
                </SwiperSlide>
               </Swiper>
              </div>
     </div> 
    </>
  )
}

export default Testimonial
