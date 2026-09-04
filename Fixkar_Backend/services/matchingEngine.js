import { Professional } from "../models/userModel.js";

export const findEligibleProfessionals = async ( 
 { serviceId,
  taskId,
  workDate,
   customerLat,
  customerLng,
  radiusInKm = 15,
  limit = 10,}) =>{
    try {
       const lat = Number(customerLat);
        const lng = Number(customerLng);
        const maxDistance = Number(radiusInKm) * 1000;

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {
            throw new Error("Invalid customer coordinates");
        }

        if (!Number.isFinite(maxDistance)) {
            throw new Error("Invalid search radius");
        }

            const query = {
      profession: serviceId,

      // Approved only
      status: "approved",

      // Onboard completed
      onBoarded: true,

      // Customer selected task
      selectedSkills: taskId,

      // Already busy on that day?
      busyDays: {
        $ne: workDate,
      },
         location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                    $maxDistance: maxDistance,
                },
            },
    };

    const professionals = await Professional.find(query)
      .populate({
        path: "userId",
        select: "fullName mobile",
      })
      .populate({
        path: "profession",
        select: "name serviceType image",
      })
      .populate({
        path: "selectedSkills",
        select: "name bookingType pricingSource fixedPrice",
      })
      .select(
        `
        profilePicture
        address
        location
        visitingCharge
        taskPricing
        selectedSkills
        profession
        userId
      `
      ).limit(limit);

    return professionals;
    
    } catch (error) {
        console.error("findEligibleProfessionals Error:", error);
    throw error; 
    }
}
