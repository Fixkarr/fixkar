import React from 'react'
import { formatDate, formatTime } from '../../utils/formatTime&Date'
import { startJourneyAPI } from './startJourneyApi'
import { FaRoute } from 'react-icons/fa'
import { FaCircleArrowRight } from 'react-icons/fa6'
import { useState } from 'react'
import { toast } from 'react-toastify'
import socket from '../../socket'
import { useRef } from 'react'

const ProAcceptBooking = ({booking}) => {
  const [isStartingJourney, setIsStartingJourney] = useState(false)
  const watchIdRef = useRef(null)

  const startLocationTracking = () => { 
    if (!navigator.geolocation) { 
      toast.error("Location service is not supported on this device")
       return 
      } 
    if (watchIdRef.current !== null) { 
      return } 
      
      watchIdRef.current = navigator.geolocation.watchPosition( (position) => {
        
        const latitude = position.coords.latitude 
        const longitude = position.coords.longitude 
        console.log("Professional location:", { latitude, longitude }) 
        
        socket.emit("professionalLocation", { bookingId: booking._id, latitude, longitude }) },

        (error) => { 
          console.error("Location error:", error)
           if (error.code === 1) {
             toast.error("Please allow location permission to start journey")
             } else if (error.code === 2) {
               toast.error("Unable to detect your location") 
              } else if (error.code === 3) {
                 toast.error("Location request timed out") 
                } }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 } ) 
        }

  const handleStartJourney = async () => { 
    if (isStartingJourney) return 
    try { 
      setIsStartingJourney(true) 
      await startJourneyAPI(booking._id) 
      startLocationTracking()
    } catch (error) { 
          console.log(error) 
    } finally {
      setIsStartingJourney(false) 
    } 
  }

  return (
     <div className="alert alert-success rounded-4 shadow-sm mt-3">
          <h6 className="fw-bold mb-2">
             Booking Assigned!
          </h6>
        
          <p className="mb-2">
            You have been successfully booked for a service on
            <strong> {formatDate(booking.workDate)}</strong>.
          </p>
        
          <p className="mb-2">
            Please ensure that you reach the service location
            <strong> before {formatTime(booking.workTime)}</strong> to provide a smooth experience
            to the customer.
          </p>
        
          <p className="mb-0">
            <strong>Service Address:</strong> {booking.workAddress}
          </p>
        
          <small className="text-muted d-block mt-2">
            Best of luck! We wish you a successful service visit.
          </small>

          <button type="button" 
              className="btn btn-primary w-100 mt-3 fw-semibold" 
              onClick={handleStartJourney} 
              disabled={isStartingJourney} > 
              {isStartingJourney ? "Starting Journey..." : <> <FaRoute size={20}/> Start Journey <FaCircleArrowRight /></>} 
          </button>
        </div>
  )
}

export default ProAcceptBooking
