import axios from "axios";

export const calculateDistanceForProfessionals = async ({
  customerLocation,
  professionals,
}) => {
  try {
    if (!professionals.length) return [];

    const origins = [
      {
        waypoint: {
          location: {
            latLng: {
              latitude: customerLocation.lat,
              longitude: customerLocation.lng,
            },
          },
        },
      },
    ];

    const destinations = professionals.map((pro) => ({
      waypoint: {
        location: {
          latLng: {
            latitude: pro.address.lat,
            longitude: pro.address.lng,
          },
        },
      },
    }));

    const response = await axios.post(
      "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
      {
        origins,
        destinations,
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE",
      },
      {
        headers: {
          "X-Goog-Api-Key": process.env.GOOGLE_MAP_API_KEY,
          "X-Goog-FieldMask":
            "originIndex,destinationIndex,distanceMeters,duration,status",
        },
      }
    );

    const rows = response.data;

    const result = professionals.map((professional, index) => {
      const route = rows.find(
        (r) => r.destinationIndex === index
      );

      const distance =
        (route?.distanceMeters || 0) / 1000;

      return {
        professional,
        distanceInKm: Number(distance.toFixed(2)),
      };
    });

    result.sort(
      (a, b) => a.distanceInKm - b.distanceInKm
    );

    return result;
  } catch (error) {
    console.log(error.response?.data || error);
    throw error;
  }
};