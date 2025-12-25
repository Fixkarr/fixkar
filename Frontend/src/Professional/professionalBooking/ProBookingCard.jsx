import React from 'react'
import  {GetStatusBadge} from '../../utils/GetStatusBadge'
import { formatDate, formatTime } from '../../utils/formatTime&Date';
import { useNavigate } from 'react-router-dom';

const ProBookingCard = ({booking}) => {

  const navigate = useNavigate();

  return booking &&(
    <div className='booking-card' onClick={()=>navigate(`/professional/bookings/${booking?._id}`)}>
       <div className="card border-0 shadow-sm rounded-4 mb-3">
      <div className="card-body rounded-4 border-0 p-3">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="fw-semibold text-primary mb-0">
             {booking?.customerName}
            </h6>
            <small className="text-muted">
              Booking ID: {booking?._id}
            </small>
          </div>

          <GetStatusBadge status={booking?.status}/>
        </div>

        <hr className="my-2" />

        {/* Details */}
        <div className="row g-2">
          <div className="col-6">
            <small className="text-muted d-block">Visiting Charge</small>
            <span className="fw-semibold text-dark">
             ₹{booking?.visitingCharge}
            </span>
          </div>

          <div className="col-6">
            <small className="text-muted d-block">Work Time</small>
            <span className="fw-semibold text-dark">
              {formatTime(booking?.workTime)}
            </span>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Work Date</small>
            <span className="fw-semibold text-dark">
              {formatDate(booking?.workDate)}
            </span>
          </div>

          <div className="col-12 mt-2">
            <small className="text-muted d-block">Work Address</small>
            <span className="fw-semibold text-dark">
              {booking?.workAddress}
            </span>
          </div>
        </div>

      </div>
    </div>
    </div>
  )
}

export default ProBookingCard
