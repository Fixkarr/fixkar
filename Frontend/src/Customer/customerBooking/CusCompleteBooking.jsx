import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa';
import axios from 'axios'
import { server_url } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const CusCompleteBooking = ({booking}) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false)
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
          setLoading(true)
          const result = await axios.post(`${server_url}/api/booking/post-review`, {rating, review, bookingId : booking._id})
          toast.info(result.data.message);
          setLoading(false)
        } catch (error) {
          console.log(error.message)
          toast.error(error.response.data.message)
          setLoading(false)
        }
    }

      const fullAmount =
    (booking.quoteAmount || 0) +
    (booking.visitingCharge || 0);

  const discountAmount =
    booking.discountAmount || 0;

  const finalPaid =
    booking.offerLocked && booking.finalCustomerPayable
      ? booking.finalCustomerPayable
      : fullAmount;


  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 my-4">

  {/* Payment Summary */}
  <h5 className="fw-bold text-success mb-3">
    Payment Successful
  </h5>

  <div className="bg-light rounded-3 p-3 mb-4">
    <div className="d-flex justify-content-between mb-2">
      <span className="text-muted">Service Charge</span>
      <span className="fw-semibold">₹{booking.quoteAmount}</span>
    </div>

    <div className="d-flex justify-content-between mb-2">
      <span className="text-muted">Visiting Charge</span>
      <span className="fw-semibold">₹{booking.visitingCharge}</span>
    </div>

        {discountAmount > 0 && (
          <div className="d-flex justify-content-between mb-2 text-success">
            <span>Discount Applied</span>
            <span>- ₹{discountAmount}</span>
          </div>
        )}

    <hr className="my-2" />

    <div className="d-flex justify-content-between">
      <span className="fw-bold">Total Paid Amount</span>
      <span className="fw-bold text-success">₹{finalPaid}</span>
    </div>
  </div>

   <div className="alert alert-success rounded-3 mb-4">
        {discountAmount > 0
          ? "Discount was successfully applied to your booking."
          : "The total amount has been successfully transferred to the professional."}
      </div>

      
  {/* Thank You Message */}
  <div className="mb-4">
    <p className="fw-semibold mb-1">
      Thank you for choosing our platform 🙏
    </p>

    <p className="text-muted mb-1">
      You have successfully hired a professional using our service.
      We hope the service provided was satisfactory and met your expectations.
    </p>

    <p className="text-muted mb-0">
      Your feedback helps us improve and also helps other users
      choose the right professional.
    </p>
  </div>

  {/* Rating & Review */}
  {!booking.review && <div className="border rounded-3 p-3 mb-4">
    <form>
   <div className="mb-3">
  <label className="form-label fw-semibold">
    Rate the Professional
  </label>

  <div className="d-flex gap-2 fs-3">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        role="button"
        style={{ cursor: "pointer" }}
        className={
          star <= rating ? "text-warning fs-2" : "text-secondary fs-2"
        }
        onClick={() => setRating(star)}
      >
        ★
      </span>
    ))}
  </div>

  <small className="text-muted">
    {rating > 0
      ? `You selected ${rating} star${rating > 1 ? "s" : ""}`
      : "Click on stars to give rating"}
  </small>


</div>


    {/* Review Input */}
    <div className="mb-3">
      <label className="form-label small text-muted">
        Your Review
      </label>
      <textarea
        className="form-control"
        rows="3"
        placeholder="Write your experience with this professional..."
        value={review}
        onChange={(e)=>setReview(e.target.value)}
      ></textarea>
    </div>

    <button className="btn btn-primary w-100 rounded-pill fw-semibold" disabled={loading} onClick={handleSubmit}>
     {loading && <ClipLoader size={10}/>} Post Review
    </button>
  </form>
  </div>}

  {/* Review Given By You */}
  {booking.review && <div className="bg-primary-subtle border border-primary rounded-3 p-3">
    <h6 className="fw-bold mb-2 text-primary">
      Review Given By You
    </h6>

    <div className="mb-1 text-warning fs-5">
       {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={18}
          color={star <= booking.review.rating  ? "#ffc107" : "#e4e5e9"}
        />
      ))}
    </div>

    <p className="mb-0 text-muted small">
     {booking.review.review}
    </p>
  </div>}

</div>

  )
}

export default CusCompleteBooking
