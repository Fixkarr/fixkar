import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { FaCar, FaMapMarkerAlt } from "react-icons/fa";

import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";

const LiveTrackingMap = ({
  booking,
  professionalLocation,
}) => {
  const googleLoaded = useLoadGoogleMaps();

  const [mapReady, setMapReady] = useState(false);
  const [routesReady, setRoutesReady] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const RouteRef = useRef(null);

  const customerMarkerRef = useRef(null);
  const professionalMarkerRef = useRef(null);

  const routePolylinesRef = useRef([]);

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
      console.log(
        "Google Maps is not available yet"
      );
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
    // LOAD ROUTES LIBRARY
    // ==========================================
    const loadRoutesLibrary = async () => {
      try {
        const { Route } =
          await window.google.maps.importLibrary(
            "routes"
          );

        RouteRef.current = Route;

        setRoutesReady(true);

        console.log(
          "Google Maps Routes Library loaded"
        );
      } catch (error) {
        console.error(
          "Failed to load Routes Library:",
          error
        );
      }
    };

    loadRoutesLibrary();

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

      // Remove all route polylines
      routePolylinesRef.current.forEach(
        (polyline) => {
          polyline.setMap(null);
        }
      );

      routePolylinesRef.current = [];

      mapInstanceRef.current = null;

      RouteRef.current = null;

      customerMarkerRef.current = null;

      professionalMarkerRef.current = null;

      setMapReady(false);
      setRoutesReady(false);
    };
  }, [
    googleLoaded,
    booking?.customerLat,
    booking?.customerLng,
  ]);

  // ============================================
  // PROFESSIONAL LIVE LOCATION + ROUTE
  // ============================================
  useEffect(() => {
    if (!googleLoaded) return;

    if (!window.google?.maps) return;

    if (!mapReady) return;

    if (!routesReady) return;

    if (!mapInstanceRef.current) return;

    if (!RouteRef.current) return;

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
  url: "/Images/professional-icon.png",

  scaledSize: new window.google.maps.Size(
    64,
    64
  ),

  anchor: new window.google.maps.Point(
    32,
    32
  ),
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
      // FIT CUSTOMER + PROFESSIONAL
      // ========================================
      const bounds =
        new window.google.maps.LatLngBounds();

      bounds.extend(customerPosition);
      bounds.extend(professionalPosition);

      mapInstanceRef.current.fitBounds(bounds);
    } else {
      // ========================================
      // UPDATE PROFESSIONAL POSITION
      // ========================================
      professionalMarkerRef.current.setPosition(
        professionalPosition
      );
    }

    // ==========================================
    // CALCULATE NEW ROUTE
    // ==========================================
    const calculateRoute = async () => {
      try {
        const Route = RouteRef.current;

        if (!Route) return;

        const request = {
          origin: professionalPosition,

          destination: customerPosition,

          travelMode: "DRIVING",

          fields: [
            "path",
            "distanceMeters",
            "durationMillis",
          ],
        };

        const { routes } =
          await Route.computeRoutes(request);

        if (!routes || routes.length === 0) {
          return;
        }

        const route = routes[0];

        // ========================================
        // REMOVE OLD ROUTE
        // ========================================
        routePolylinesRef.current.forEach(
          (polyline) => {
            polyline.setMap(null);
          }
        );

        routePolylinesRef.current = [];

        // ========================================
        // CREATE NEW ROUTE POLYLINE
        // ========================================
        const polylines =
          route.createPolylines({
            polylineOptions: {
              strokeColor: "#2563eb",
              strokeOpacity: 0.9,
              strokeWeight: 5,
            },
          });

        // ========================================
        // ADD ROUTE TO MAP
        // ========================================
        polylines.forEach((polyline) => {
          polyline.setMap(
            mapInstanceRef.current
          );
        });

        routePolylinesRef.current = polylines;

        // ========================================
        // ROUTE INFORMATION
        // ========================================
        const distanceKm =
          route.distanceMeters
            ? (
                route.distanceMeters / 1000
              ).toFixed(1)
            : null;

        const durationMinutes =
          route.durationMillis
            ? Math.ceil(
                route.durationMillis / 60000
              )
            : null;
      } catch (error) {
        console.error(
          "Google Routes API error:",
          error
        );
      }
    };

    calculateRoute();
  }, [
    googleLoaded,
    mapReady,
    routesReady,
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
