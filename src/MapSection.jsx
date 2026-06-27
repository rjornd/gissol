import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import mapstyle from "./assets/mapstyle.json";

function DarkMap() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapstyle,
      center: [56.233252, 58.015566],
      zoom: 15,
      attributionControl: false
    });
  //  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    new maplibregl.Marker({ color: "#7ba9e6ff" }) 
      .setLngLat([56.233252, 58.015566])
      .addTo(mapInstance.current);

    mapInstance.current.addControl(new maplibregl.NavigationControl(), "top-right");

    mapInstance.current.on("webglcontextlost", (e) => {
      e.preventDefault();
      mapInstance.current.resize();
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapContainer} className="map-canvas" />;
}

export default function MapSection({ interactionLabel = "Click to interact with the map" }) {
  return (
    <div className="map-shell">
      <div
        className="map-interaction-layer"
        tabIndex={0}
        aria-label={interactionLabel}
        onClick={(e) => {
          e.currentTarget.style.pointerEvents = "none";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.currentTarget.style.pointerEvents = "none";
          }
        }}
      />
      <DarkMap />
    </div>
  );
}
