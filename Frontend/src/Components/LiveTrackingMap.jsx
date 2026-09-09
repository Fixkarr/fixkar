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
        label: {
          text: "🚗",
        },
      });

      // Map ko professional ke initial location tak bhi dikhao
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
