export const getBookingCountByStatus = (bookings = [], status) => {
  if (!Array.isArray(bookings) || !status) return 0;

  return bookings.filter((b) => b.status === status).length;
};