import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { FaMapMarkerAlt } from "react-icons/fa";

import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";

const ROUTE_REFRESH_INTERVAL = 5000;

const LiveTrackingMap = ({
  booking,
  professionalLocation,
}) => {
  const googleLoaded = useLoadGoogleMaps();

  // ============================================
  // STATE
  // ============================================
  const [mapReady, setMapReady] = useState(false);
  const [librariesReady, setLibrariesReady] = useState(false);

  const [routeInfo, setRouteInfo] = useState({
    distanceKm: null,
    durationMinutes: null,
  });

  // ============================================
  // MAP REFS
  // ============================================
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // ============================================
  // GOOGLE LIBRARIES
  // ============================================
  const RouteRef = useRef(null);
  const AdvancedMarkerElementRef = useRef(null);

  // ============================================
  // MARKERS
  // ============================================
  const customerMarkerRef = useRef(null);
  const professionalMarkerRef = useRef(null);

  const professionalMarkerElementRef =
    useRef(null);

  const professionalImageRef =
    useRef(null);

  // ============================================
  // ROUTE
  // ============================================
  const routePolylinesRef = useRef([]);

  const lastRouteRequestRef = useRef(0);

  // ============================================
  // LOCATION / HEADING
  // ============================================
  const previousProfessionalPositionRef =
    useRef(null);

  const lastRotationRef = useRef(0);

  const hasInitialFitRef = useRef(false);

  // ============================================
  // CREATE SVG DATA URL
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
  // CALCULATE BEARING
  // ============================================
  const calculateBearing = (
    previous,
    current
  ) => {
    if (!previous || !current) {
      return null;
    }

    const lat1 =
      (previous.lat * Math.PI) / 180;

    const lat2 =
      (current.lat * Math.PI) / 180;

    const deltaLng =
      ((current.lng - previous.lng) *
        Math.PI) /
      180;

    const y =
      Math.sin(deltaLng) *
      Math.cos(lat2);

    const x =
      Math.cos(lat1) *
        Math.sin(lat2) -
      Math.sin(lat1) *
        Math.cos(lat2) *
        Math.cos(deltaLng);

    const bearing =
      (Math.atan2(y, x) * 180) /
      Math.PI;

    return (bearing + 360) % 360;
  };

  // ============================================
  // SMOOTH ROTATION
  // ============================================
  const getSmoothRotation = (heading) => {
    if (heading == null) {
      return lastRotationRef.current;
    }

    /*
      Generated bike image faces RIGHT/EAST
      at 0deg CSS rotation.

      Google heading:
      0   = North
      90  = East
      180 = South
      270 = West

      Therefore:

      CSS rotation = heading - 90
    */

    let targetRotation =
      Number(heading) - 90;

    let previousRotation =
      lastRotationRef.current;

    while (
      targetRotation - previousRotation >
      180
    ) {
      targetRotation -= 360;
    }

    while (
      targetRotation - previousRotation <
      -180
    ) {
      targetRotation += 360;
    }

    lastRotationRef.current =
      targetRotation;

    return targetRotation;
  };

  // ============================================
  // CREATE PROFESSIONAL MARKER ELEMENT
  // ============================================
  const createProfessionalMarkerElement = (
    heading
  ) => {
    const container =
      document.createElement("div");

    container.style.width = "70px";
    container.style.height = "70px";

    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";

    container.style.pointerEvents = "none";

    const image =
      document.createElement("img");

    image.src =
      "/Images/professional-icon.png";

    image.alt = "Professional";

    image.style.width = "64px";
    image.style.height = "64px";

    image.style.objectFit = "contain";

    image.style.display = "block";

    image.style.transformOrigin =
      "center center";

    image.style.transition =
      "transform 0.35s ease";

    const rotation =
      getSmoothRotation(heading);

    image.style.transform =
      `rotate(${rotation}deg)`;

    container.appendChild(image);

    return {
      container,
      image,
    };
  };

  // ============================================
  // CREATE MAP
  // ============================================
  useEffect(() => {
    if (!googleLoaded) return;

    if (!window.google?.maps) {

      return;
    }

    if (
      booking?.customerLat == null ||
      booking?.customerLng == null
    ) {
      return;
    }

    if (!mapRef.current) return;

    let cancelled = false;

    const customerLocation = {
      lat: Number(booking.customerLat),
      lng: Number(booking.customerLng),
    };

    // ==========================================
    // CREATE MAP
    // ==========================================
    const map =
      new window.google.maps.Map(
        mapRef.current,
        {
          center: customerLocation,

          zoom: 15,

          mapId: "67ad6227849cfee5e2a0b906",

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
        new window.google.maps.Size(
          48,
          48
        ),

      anchor:
        new window.google.maps.Point(
          24,
          42
        ),
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

    mapInstanceRef.current = map;

    setMapReady(true);

    // ==========================================
    // LOAD ROUTES + MARKER LIBRARIES
    // ==========================================
    const loadLibraries = async () => {
      try {
        const [
          routesLibrary,
          markerLibrary,
        ] = await Promise.all([
          window.google.maps.importLibrary(
            "routes"
          ),

          window.google.maps.importLibrary(
            "marker"
          ),
        ]);

        if (cancelled) return;

        RouteRef.current =
          routesLibrary.Route;

        AdvancedMarkerElementRef.current =
          markerLibrary.AdvancedMarkerElement;

        setLibrariesReady(true);
      } catch (error) {
        console.error(
          "Google Maps libraries error:",
          error
        );
      }
    };

    loadLibraries();

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      cancelled = true;

      if (customerMarkerRef.current) {
        customerMarkerRef.current.setMap(null);
      }

      if (
        professionalMarkerRef.current
      ) {
        professionalMarkerRef.current.map =
          null;
      }

      routePolylinesRef.current.forEach(
        (polyline) => {
          polyline.setMap(null);
        }
      );

      routePolylinesRef.current = [];

      mapInstanceRef.current = null;

      RouteRef.current = null;

      AdvancedMarkerElementRef.current =
        null;

      customerMarkerRef.current = null;

      professionalMarkerRef.current =
        null;

      professionalMarkerElementRef.current =
        null;

      professionalImageRef.current =
        null;

      previousProfessionalPositionRef.current =
        null;

      hasInitialFitRef.current = false;

      setMapReady(false);
      setLibrariesReady(false);

      setRouteInfo({
        distanceKm: null,
        durationMinutes: null,
      });
    };
  }, [
    googleLoaded,
    booking?.customerLat,
    booking?.customerLng,
  ]);

  // ============================================
  // PROFESSIONAL LOCATION + ROUTE
  // ============================================
  useEffect(() => {
    if (!googleLoaded) return;

    if (!mapReady) return;

    if (!librariesReady) return;

    if (!mapInstanceRef.current) return;

    if (!RouteRef.current) return;

    if (!AdvancedMarkerElementRef.current) {
      return;
    }

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
      lat: Number(
        professionalLocation.lat
      ),

      lng: Number(
        professionalLocation.lng
      ),
    };

    const customerPosition = {
      lat: Number(
        booking.customerLat
      ),

      lng: Number(
        booking.customerLng
      ),
    };

    // ==========================================
    // DETERMINE HEADING
    // ==========================================
    let heading =
      professionalLocation?.heading;

    if (
      heading == null ||
      Number.isNaN(Number(heading))
    ) {
      heading = calculateBearing(
        previousProfessionalPositionRef.current,
        professionalPosition
      );
    }

    if (heading == null) {
      heading = 0;
    }

    heading = Number(heading);

    // ==========================================
    // SAVE CURRENT POSITION
    // ==========================================
    previousProfessionalPositionRef.current =
      professionalPosition;

    // ==========================================
    // CREATE PROFESSIONAL MARKER
    // ==========================================
    if (
      !professionalMarkerRef.current
    ) {
      const markerElement =
        createProfessionalMarkerElement(
          heading
        );

      professionalMarkerElementRef.current =
        markerElement.container;

      professionalImageRef.current =
        markerElement.image;

      professionalMarkerRef.current =
        new AdvancedMarkerElementRef.current({
          map: mapInstanceRef.current,

          position:
            professionalPosition,

          title: "Professional",

          content:
            markerElement.container,

          zIndex: 100,
        });

      // ========================================
      // FIT CUSTOMER + PROFESSIONAL
      // ONLY FIRST TIME
      // ========================================
      if (!hasInitialFitRef.current) {
        const bounds =
          new window.google.maps.LatLngBounds();

        bounds.extend(customerPosition);

        bounds.extend(
          professionalPosition
        );

        mapInstanceRef.current.fitBounds(
          bounds
        );

        hasInitialFitRef.current = true;
      }
    } else {
      // ========================================
      // MOVE PROFESSIONAL
      // ========================================
      professionalMarkerRef.current.position =
        professionalPosition;

      // ========================================
      // ROTATE PROFESSIONAL
      // ========================================
      if (professionalImageRef.current) {
        const rotation =
          getSmoothRotation(heading);

        professionalImageRef.current.style.transform =
          `rotate(${rotation}deg)`;
      }
    }

    // ==========================================
    // ROUTE REQUEST THROTTLE
    // ==========================================
    const now = Date.now();

    const timeSinceLastRequest =
      now - lastRouteRequestRef.current;

    if (
      lastRouteRequestRef.current !== 0 &&
      timeSinceLastRequest <
        ROUTE_REFRESH_INTERVAL
    ) {
      return;
    }

    lastRouteRequestRef.current = now;

    // ==========================================
    // CALCULATE ROUTE
    // ==========================================
    const calculateRoute = async () => {
      try {
        const Route =
          RouteRef.current;

        if (!Route) return;

        const request = {
          origin:
            professionalPosition,

          destination:
            customerPosition,

          travelMode: "DRIVING",

          routingPreference:
            "TRAFFIC_AWARE",

          fields: [
            "path",
            "distanceMeters",
            "durationMillis",
            "staticDurationMillis",
          ],
        };

        const { routes } =
          await Route.computeRoutes(
            request
          );

        if (
          !routes ||
          routes.length === 0
        ) {
          console.warn(
            "No route found"
          );

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
        // CREATE ROUTE
        // ========================================
        const polylines =
          route.createPolylines({
            polylineOptions: {
              strokeColor:
                "#2563eb",

              strokeOpacity: 0.9,

              strokeWeight: 5,
            },
          });

        // ========================================
        // ADD ROUTE
        // ========================================
        polylines.forEach(
          (polyline) => {
            polyline.setMap(
              mapInstanceRef.current
            );
          }
        );

        routePolylinesRef.current =
          polylines;

        // ========================================
        // DISTANCE
        // ========================================
        const distanceKm =
          route.distanceMeters != null
            ? route.distanceMeters >=
              1000
              ? `${(
                  route.distanceMeters /
                  1000
                ).toFixed(1)} km`
              : `${Math.round(
                  route.distanceMeters
                )} m`
            : null;

        // ========================================
        // ETA
        // ========================================
        const durationMinutes =
          route.durationMillis != null
            ? Math.max(
                1,
                Math.ceil(
                  route.durationMillis /
                    60000
                )
              )
            : null;

        setRouteInfo({
          distanceKm,
          durationMinutes,
        });

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
    librariesReady,
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
  // MAP + LIVE INFO
  // ============================================
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* ======================================
          LIVE ROUTE INFO
      ====================================== */}
      {routeInfo.distanceKm &&
        routeInfo.durationMinutes && (
          <div
            style={{
              position: "absolute",
              left: "16px",
              right: "16px",
              bottom: "16px",
              zIndex: 20,

              display: "flex",
              alignItems: "center",

              padding: "12px 16px",

              background:
                "rgba(255,255,255,0.96)",

              backdropFilter:
                "blur(12px)",

              border:
                "1px solid rgba(255,255,255,0.7)",

              borderRadius: "14px",

              boxShadow:
                "0 8px 30px rgba(0,0,0,0.16)",
            }}
          >
            {/* DISTANCE */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                }}
              >
                Distance
              </span>

              <strong
                style={{
                  fontSize: "15px",
                  color: "#111827",
                }}
              >
                {routeInfo.distanceKm}
              </strong>
            </div>

            {/* DIVIDER */}
            <div
              style={{
                width: "1px",
                height: "32px",
                background: "#e5e7eb",
                margin: "0 16px",
              }}
            />

            {/* ETA */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                }}
              >
                Estimated arrival
              </span>

              <strong
                style={{
                  fontSize: "15px",
                  color: "#111827",
                }}
              >
                {routeInfo.durationMinutes} min
              </strong>
            </div>
          </div>
        )}
    </div>
  );
};

export default LiveTrackingMap;