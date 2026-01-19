import React from 'react'
import { useParams } from 'react-router-dom'

const AdminBookingDetail = () => {
    const {bookingId} = useParams()
  return (
    <div>
      {bookingId}
    </div>
  )
}

export default AdminBookingDetail
