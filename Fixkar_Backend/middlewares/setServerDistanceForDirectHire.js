import { Professional } from "../models/userModel.js";

const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const isValidLatitude = (value) => value >= -90 && value <= 90;
const isValidLongitude = (value) => value >= -180 && value <= 180;

const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const earthRadiusKm = 6371;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const setServerDistanceForDirectHire = async (req, res, next) => {
  try {
    const { professionalId } = req.body || {};

    // Pickup bookings calculate distance in the pickup flow, so leave them unchanged.
    if (!professionalId) {
      return next();
    }

    const customerLat = toFiniteNumber(req.body.customerLat);
    const customerLng = toFiniteNumber(req.body.customerLng);

    if (
      customerLat === null ||
      customerLng === null ||
      !isValidLatitude(customerLat) ||
      !isValidLongitude(customerLng)
    ) {
      return res.status(400).json({
        message: "Valid customer location is required for a direct booking",
      });
    }

    const professional = await Professional.findById(professionalId).select("location");
    const coordinates = professional?.location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      !Number.isFinite(Number(coordinates[0])) ||
      !Number.isFinite(Number(coordinates[1]))
    ) {
      return res.status(400).json({
        message: "Professional location is not available",
      });
    }

    // GeoJSON stores coordinates as [longitude, latitude].
    const professionalLng = Number(coordinates[0]);
    const professionalLat = Number(coordinates[1]);

    if (
      !isValidLongitude(professionalLng) ||
      !isValidLatitude(professionalLat)
    ) {
      return res.status(400).json({
        message: "Professional location is invalid",
      });
    }

    req.body.distanceInKm = Number(
      haversineDistanceKm(
        customerLat,
        customerLng,
        professionalLat,
        professionalLng
      ).toFixed(2)
    );

    return next();
  } catch (error) {
    console.error("setServerDistanceForDirectHire error:", error);
    return res.status(500).json({
      message: "Unable to calculate service distance",
    });
  }
};
