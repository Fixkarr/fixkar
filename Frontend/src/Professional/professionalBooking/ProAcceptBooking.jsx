import React, { useEffect, useRef, useState } from 'react'
import { formatDate, formatTime } from '../../utils/formatTime&Date'
import { startJourneyAPI } from './startJourneyApi'
import { FaRoute } from 'react-icons/fa'
import { FaCircleArrowRight } from 'react-icons/fa6'
import { toast } from 'react-toastify'



const ProAcceptBooking = ({ booking }) => {

  const [isStartingJourney, setIsStartingJourney] = useState(false)

  // ----START JOURNEY
  // ----------------------------------------
  const handleStartJourney = async () => {

    if (isStartingJourney) return

    try {

      setIsStartingJourney(true)

      await startJourneyAPI(booking._id)

      // IMPORTANT:
      // Journey API successful hone ke baad hi tracking start hoga

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Unable to start journey"
      )

    } finally {
      setIsStartingJourney(false)
    }
  }

  // ----------------------------------------
  // CLEANUP
  // ----------------------------------------

  return (
    <div className="alert alert-success rounded-4 shadow-sm mt-3">

      <h6 className="fw-bold mb-2">
        Booking Assigned!
      </h6>

      <p className="mb-2">
        You have been successfully booked for a service on
        <strong>
          {" "}{formatDate(booking.workDate)}
        </strong>.
      </p>

      <p className="mb-2">
        Please ensure that you reach the service location
        <strong>
          {" "}before {formatTime(booking.workTime)}
        </strong>
        {" "}to provide a smooth experience to the customer.
      </p>

      <p className="mb-0">
        <strong>Service Address:</strong>{" "}
        {booking.workAddress}
      </p>

      <small className="text-muted d-block mt-2">
        Best of luck! We wish you a successful service visit.
      </small>

      <button
        type="button"
        className="btn btn-primary w-100 mt-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
        onClick={handleStartJourney}
        disabled={isStartingJourney}
      >

        {isStartingJourney ? (
          "Starting Journey..."
        ) : (
          <>
            <FaRoute size={20} />
            Start Journey
            <FaCircleArrowRight />
          </>
        )}

      </button>

    </div>
  )
}

export default ProAcceptBooking