import React from 'react'
import '../css/contact.css'
const Contact = () => {
  return (
    <>
      <div className="contact py-5">
        <div>
           <h3 className="fs-3 text-center mx-auto">Contact us! you can send us as messsage</h3>
          <p className='p-title text-center my-3'>Feel free to contact us</p>
        </div>
        <div className="contactForm">
         <div className="left">
           <div className="image">
            <img src="Images/contacttheme.png" alt="contactimg" className='img-fluid'/>
          </div>
         </div>
           <div className="right">
             <form>
                <input type="text" placeholder='Enter Your Name' />
                <input type="email" placeholder='Enter Your Email' />
                <textarea name="message" placeholder='Enter Your Message' rows={5}></textarea>
                <button className='btn btn-primary'>Send Message</button>
            </form>
           </div>
        </div>
      </div>
    </>
  )
}

export default Contact
