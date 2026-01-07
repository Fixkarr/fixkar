import { useSelector } from "react-redux";
import NoBookingsPlaceholder from "../Components/NoBookingsPlaceholder";
import ProBookingCard from "./professionalBooking/ProBookingCard";

export default function ProfessionalBookings() {

  const { myBookings } = useSelector((state) => state.bookings);

  
  return myBookings.length !== 0 ? (
    <div className="container py-4">
      <h4 className="fw-bold text-primary mb-4">My Bookings</h4>

      {myBookings?.map((booking) => (
        <div
          key={booking._id}
        >
          <ProBookingCard booking={booking}/>
        </div>
      ))}
    </div>
  ) : (
    <NoBookingsPlaceholder />
  );
}
