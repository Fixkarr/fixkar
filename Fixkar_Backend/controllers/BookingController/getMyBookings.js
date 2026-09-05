import { Booking } from "../../models/bookingModel.js";
import { Customer, Professional, User } from "../../models/userModel.js";

export const getMyBookings = async (req, res) => {
  try {
    const myId = req.userId;

    // 1️⃣ Get logged-in user
    const user = await User.findById(myId).select('role');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Role based config
    const roleConfig = {
      customer: {
        model: Customer,
        bookingField: "customerId",
      },
      professional: {
        model: Professional,
        bookingField: "professionalId",
      },
    };

    const config = roleConfig[user.role];
    if (!config) {
      return res.status(400).json({ message: "Invalid user role" });
    }

    // 3️⃣ Fetch customer / professional
    const profile = await config.model
      .findOne({ userId : myId })

    if (!profile) {
      return res.status(404).json({
        message: `${user.role} profile not found`,
      });
    }
    
    // 4️⃣ Fetch bookings
    const bookings = await Booking.find({
      [config.bookingField]: profile._id,
    }).populate({
      path : "customerId",
      populate : {
        path : "userId",
        model : "User",
        select : "fullName"
      }
    }).populate({
    path: "professionalId",
    select: "profilePicture address userId profession shortCode",
    populate: [{
      path: "userId",
      model: "User",
      select: "fullName",
    },
  { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
     {path : "selectedSkills", select : "name"}
],
  }).populate('currentPaymentId', 'paymentType status amount').populate('review').sort({createdAt : -1});

    return res.status(200).json({
      message: bookings.length
        ? "Bookings fetched successfully"
        : "No bookings found",
      bookings,
    });
  } catch (error) {
    console.error("Error in getMyBookings:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
