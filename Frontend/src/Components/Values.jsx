import React from 'react'
import '../css/values.css'
const Values = () => {
  return (
    <>
      <div className="values p-3 mt-5">
        <h3 className="fs-3 text-center mx-auto mt-5">Our Core Values</h3>
        <div className="value-container container mt-5">
            <div className="contain">
                <div>
                    <img src="Images/verified.png" alt="" />
                    <span>Verified Professionals</span>
                </div>
                <p>Trained and background-checked service providers</p>
            </div>
            <div className="contain">
                <div>
                    <img src="Images/AffordablePrice.png" alt="" />
                    <span>Affordable Pricing</span>
                </div>
                <p>Transparent rates, no hidden charges.</p>
            </div>
            <div className="contain">
                <div>
                    <img src="Images/support.png" alt="" />
                    <span>24*7 Support</span>
                </div>
                <p>Always ready to help whenever you need us.</p>
            </div>
            <div className="contain">
                <div>
                    <img src="Images/trust.png" alt="" />
                    <span>Trust & Reliability</span>
                </div>
                <p>Our goal is not just to fix things, but to build long-term trust.</p>
            </div>
            <div className="contain">
                <div>
                    <img src="Images/booking.png" alt="" />
                    <span>Quick & Easy Booking</span>
                </div>
                <p>Just a click and your service is scheduled</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Values
