import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { FaCar, FaMapMarkerAlt } from "react-icons/fa";

import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";

const LiveTrackingMap = ({ booking, professionalLocation }) => {
  const googleLoaded = useLoadGoogleMaps();

  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const customerMarkerRef = useRef(null);
  const professionalMarkerRef = useRef(null);

  // ============================================
  // CREATE SVG DATA URL FROM REACT ICON
  // ============================================
  const createIconDataUrl = (icon) => {
    const svgString =
      ReactDOMServer.renderToStaticMarkup(icon);

    return (
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          ${svgString}
        </svg>
      `)
    );
  };

  // ============================================
  // CREATE MAP
  // ============================================
  useEffect(() => {
    if (!googleLoaded) return;

    if (!window.google?.maps) {
      console.log("Google Maps is not available yet");
      return;
    }

    if (
      booking?.customerLat == null ||
      booking?.customerLng == null
    ) {
      return;
    }

    if (!mapRef.current) return;

    const customerLocation = {
      lat: Number(booking.customerLat),
      lng: Number(booking.customerLng),
    };

    // ==========================================
    // CREATE MAP
    // ==========================================
    const map = new window.google.maps.Map(
      mapRef.current,
      {
        center: customerLocation,
        zoom: 15,

        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,

        gestureHandling: "greedy",
      }
    );

    mapInstanceRef.current = map;

    // ==========================================
    // DIRECTIONS SERVICE
    // ==========================================
    directionsServiceRef.current =
      new window.google.maps.DirectionsService();

    directionsRendererRef.current =
      new window.google.maps.DirectionsRenderer({
        map: map,

        // We already have our own markers
        suppressMarkers: true,

        preserveViewport: true,

        polylineOptions: {
          strokeColor: "#2563eb",
          strokeOpacity: 0.9,
          strokeWeight: 5,
        },
      });

    // ==========================================
    // CUSTOMER ICON
    // ==========================================
    const customerIcon = {
      url: createIconDataUrl(
        <FaMapMarkerAlt
          color="#dc2626"
          size={36}
        />
      ),

      scaledSize:
        new window.google.maps.Size(48, 48),

      anchor:
        new window.google.maps.Point(24, 42),
    };

    // ==========================================
    // CUSTOMER MARKER
    // ==========================================
    customerMarkerRef.current =
      new window.google.maps.Marker({
        position: customerLocation,

        map,

        title: "Customer Location",

        icon: customerIcon,

        zIndex: 10,
      });

    // ==========================================
    // MAP READY
    // ==========================================
    setMapReady(true);

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      if (customerMarkerRef.current) {
        customerMarkerRef.current.setMap(null);
      }

      if (professionalMarkerRef.current) {
        professionalMarkerRef.current.setMap(null);
      }

      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }

      mapInstanceRef.current = null;

      directionsServiceRef.current = null;

      directionsRendererRef.current = null;

      customerMarkerRef.current = null;

      professionalMarkerRef.current = null;

      setMapReady(false);
    };
  }, [
    googleLoaded,
    booking?.customerLat,
    booking?.customerLng,
  ]);

  // ============================================
  // PROFESSIONAL LIVE LOCATION
  // ============================================
  useEffect(() => {
    if (!googleLoaded) return;

    if (!window.google?.maps) return;

    if (!mapReady) return;

    if (!mapInstanceRef.current) return;

    if (
      professionalLocation?.lat == null ||
      professionalLocation?.lng == null
    ) {
      return;
    }

    if (
      booking?.customerLat == null ||
      booking?.customerLng == null
    ) {
      return;
    }

    const professionalPosition = {
      lat: Number(professionalLocation.lat),
      lng: Number(professionalLocation.lng),
    };

    const customerPosition = {
      lat: Number(booking.customerLat),
      lng: Number(booking.customerLng),
    };

    // ==========================================
    // PROFESSIONAL ICON
    // ==========================================
    const professionalIcon = {
      url: createIconDataUrl(
        <FaCar
          color="#2563eb"
          size={32}
        />
      ),

      scaledSize:
        new window.google.maps.Size(48, 48),

      anchor:
        new window.google.maps.Point(24, 24),
    };

    // ==========================================
    // CREATE PROFESSIONAL MARKER
    // ==========================================
    if (!professionalMarkerRef.current) {
      professionalMarkerRef.current =
        new window.google.maps.Marker({
          position: professionalPosition,

          map: mapInstanceRef.current,

          title: "Professional",

          icon: professionalIcon,

          zIndex: 100,
        });

      // ========================================
      // FIT BOTH LOCATIONS
      // ========================================
      const bounds =
        new window.google.maps.LatLngBounds();

      bounds.extend(customerPosition);

      bounds.extend(professionalPosition);

      mapInstanceRef.current.fitBounds(bounds);
    } else {
      // ========================================
      // UPDATE PROFESSIONAL LOCATION
      // ========================================
      professionalMarkerRef.current.setPosition(
        professionalPosition
      );
    }

    // ==========================================
    // DRAW DRIVING ROUTE
    // ==========================================
    if (
      directionsServiceRef.current &&
      directionsRendererRef.current
    ) {
      directionsServiceRef.current.route(
        {
          origin: professionalPosition,

          destination: customerPosition,

          travelMode:
            window.google.maps.TravelMode.DRIVING,
        },

        (result, status) => {
          if (status === "OK" && result) {
            directionsRendererRef.current.setDirections(
              result
            );
          } else {
            console.log(
              "Google Maps route error:",
              status
            );
          }
        }
      );
    }
  }, [
    googleLoaded,
    mapReady,
    professionalLocation,
    booking?.customerLat,
    booking?.customerLng,
  ]);

  // ============================================
  // CUSTOMER LOCATION NOT AVAILABLE
  // ============================================
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

  // ============================================
  // MAP UI
  // ============================================
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

