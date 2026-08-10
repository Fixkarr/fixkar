import React, { useState } from 'react'

import { toast } from 'react-toastify'
import { server_url } from '../../App'
import axios from 'axios'

const ProInprogress = ({booking}) => {
    if (booking?.isPriceLocked) {
      return <div className="alert alert-success mt-3 mb-0">Upfront price locked: ₹{booking.totalAmount}. You receive: ₹{booking.professionalReceivable || 0}. No quote is required.</div>;
    }
    const [quoteAmount, setQuoteAmount] = useState('')

    const sendQuoteAPI = async (bookingId)=>{
    try {
      const result = await axios.post(`${server_url}/api/booking/send-quote-amount`, {bookingId, quoteAmount}, {withCredentials : true});
      toast.success(result.data.message);
      setQuoteAmount("")
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
    }
  }
  return (
     <div className="card border-0 shadow-sm rounded-4 mt-4">
    <div className="card-body">

      <h6 className="fw-bold mb-2">Send Work Charge</h6>

      <div className="mb-3">
        <label className="form-label">Work Amount (₹)</label>
        <input
          type="number"
          className="form-control"
          placeholder="Enter work charge"
          value={quoteAmount}
          onChange={(e) => setQuoteAmount(e.target.value)}
          min={0}
          max={6}
          required
        />
      </div>

      <button
        className="btn btn-primary w-100 fw-semibold"
        onClick={() => sendQuoteAPI(booking._id)}
      >
        Send Quote to Customer
      </button>

      <small className="text-muted d-block mt-2">
        Final amount will be shown to customer for approval & payment.
      </small>
    </div>
  </div>
  )
}

export default ProInprogress
