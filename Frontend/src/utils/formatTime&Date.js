export const formatTime = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);

  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};


export const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
