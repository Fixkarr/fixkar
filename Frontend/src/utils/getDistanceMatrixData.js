export const getDistanceMatrixData = ({
  customerLat,
  customerLng,
  professionalLat,
  professionalLng,
  travelMode = "DRIVING",
}) => {
  return new Promise((resolve, reject) => {
    
    if (!window.google || !window.google.maps) {
      reject("Google Maps API not loaded");
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [
          { lat: Number(customerLat), lng: Number(customerLng) }
        ],
        destinations: [
          { lat: Number(professionalLat), lng: Number(professionalLng) }
        ],
        travelMode: travelMode,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status !== "OK") {
          reject(status);
          return;
        }

        const element = response?.rows?.[0]?.elements?.[0];

        if (!element || element.status !== "OK") {
          reject(element?.status || "NO_DATA");
          return;
        }

        resolve({
          // 🔹 Raw response (poora)
          rawResponse: response,

          // 🔹 Distance info
          distance: {
            text: element.distance.text, // "12.4 km"
            value: element.distance.value, // meters
          },

          // 🔹 Duration info
          duration: {
            text: element.duration.text, // "25 mins"
            value: element.duration.value, // seconds
          },

          // 🔹 Extra details
          originAddress: response.originAddresses[0],
          destinationAddress: response.destinationAddresses[0],
          travelMode,
        });
      }
    );
  });
};
