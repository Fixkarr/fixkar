import React, { useEffect, useRef } from "react";

const MapPinDrop = ({ coords, setCoords }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  // 🔹 Reverse Geocoding
  const updateAddress = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setCoords((prev) => ({
          ...prev,
          lat,
          lng,
          address: results[0].formatted_address,
        }));
      }
    });
  };

  // 🔹 Init Map (ONCE)
  useEffect(() => {
    if (!coords.lat || !coords.lng || mapInstance.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: coords,
      zoom: 16,
    });

    markerRef.current = new window.google.maps.Marker({
      position: coords,
      map: mapInstance.current,
      draggable: true,
    });

    // Marker drag
    markerRef.current.addListener("dragend", (e) => {
      updateAddress(e.latLng.lat(), e.latLng.lng());
    });

    // Map click
    mapInstance.current.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      markerRef.current.setPosition({ lat, lng });
      updateAddress(lat, lng);
    });
  }, [coords.lat, coords.lng]);

  // 🔹 Marker move only
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setPosition(coords);
      mapInstance.current.panTo(coords);
    }
  }, [coords.lat, coords.lng]);

  return <div ref={mapRef} style={{ height: "350px", width: "100%" }} />;
};

export default MapPinDrop;
