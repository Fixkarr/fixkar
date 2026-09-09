import React, { useEffect, useRef } from "react";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";

const LiveTrackingMap = ({ booking, professionalLocation }) => {
  const googleLoaded = useLoadGoogleMaps();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const customerMarkerRef = useRef(null);
  const professionalMarkerRef = useRef(null);

  // ================================
  // CREATE MAP + CUSTOMER MARKER
  // ================================
  useEffect(() => {
    if (!googleLoaded) return;

    if (
      booking?.customerLat == null ||
      booking?.customerLng == null
    ) {
      return;
    }

    const customerLocation = {
      lat: Number(booking.customerLat),
      lng: Number(booking.customerLng),
    };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: customerLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Customer fixed destination marker
    customerMarkerRef.current = new window.google.maps.Marker({
      position: customerLocation,
      map: mapInstanceRef.current,
      title: "Customer Location",
      label: {
        text: "📍",
      },
    });

    return () => {
      if (customerMarkerRef.current) {
        customerMarkerRef.current.setMap(null);
      }

      if (professionalMarkerRef.current) {
        professionalMarkerRef.current.setMap(null);
      }

      mapInstanceRef.current = null;
      customerMarkerRef.current = null;
      professionalMarkerRef.current = null;
    };
  }, [
    googleLoaded,
    booking?.customerLat,
    booking?.customerLng,
  ]);

  // ================================
  // PROFESSIONAL LIVE MARKER
  // ================================
  useEffect(() => {
    if (!googleLoaded) return;

    if (!mapInstanceRef.current) return;

    if (
      professionalLocation?.lat == null ||
      professionalLocation?.lng == null
    ) {
      return;
    }

    const professionalPosition = {
      lat: Number(professionalLocation.lat),
      lng: Number(professionalLocation.lng),
    };

    // First location → create marker
    if (!professionalMarkerRef.current) {
  professionalMarkerRef.current = new window.google.maps.Marker({
    position: professionalPosition,
    map: mapInstanceRef.current,
    title: "Professional",

    icon: {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="white"
              stroke="#0d6efd"
              stroke-width="2"
            />

            <path
              d="M14 29
                 L16 20
                 Q17 17 20 17
                 H28
                 Q31 17 32 20
                 L34 29
                 V33
                 H30
                 V30
                 H18
                 V33
                 H14
                 Z"
              fill="#0d6efd"
            />

            <circle
              cx="19"
              cy="27"
              r="2.5"
              fill="white"
            />

            <circle
              cx="29"
              cy="27"
              r="2.5"
              fill="white"
            />

            <rect
              x="19"
              y="19"
              width="10"
              height="6"
              rx="1"
              fill="white"
            />
          </svg>
        `),

      scaledSize: new window.google.maps.Size(48, 48),
      anchor: new window.google.maps.Point(24, 24),
    },
  });

  const bounds = new window.google.maps.LatLngBounds();

  bounds.extend({
    lat: Number(booking.customerLat),
    lng: Number(booking.customerLng),
  });

  bounds.extend(professionalPosition);

  mapInstanceRef.current.fitBounds(bounds);

  return;
}

    // Next GPS update → only move marker
    professionalMarkerRef.current.setPosition(
      professionalPosition
    );
  }, [
    googleLoaded,
    professionalLocation,
    booking?.customerLat,
    booking?.customerLng,
  ]);

  if (
    booking?.customerLat == null ||
    booking?.customerLng == null
  ) {
    return (
      <div className="alert alert-warning">
        Customer location is not available.
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
};

export default LiveTrackingMap;
