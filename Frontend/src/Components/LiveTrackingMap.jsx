    import React, { useEffect, useRef } from "react";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";

const LiveTrackingMap = ({ booking }) => {
  const googleLoaded = useLoadGoogleMaps();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const customerMarkerRef = useRef(null);

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

    // Map create
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: customerLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Customer destination marker
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

      mapInstanceRef.current = null;
      customerMarkerRef.current = null;
    };
  }, [googleLoaded, booking?.customerLat, booking?.customerLng]);

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
