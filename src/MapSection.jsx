import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import mapstyle from "./assets/mapstyle.json";
import { createMapSafely } from "./mapResilience.js";

const MAP_CENTER = [56.233252, 58.015566];
const YANDEX_MAP_URL = "https://yandex.ru/maps/?ll=56.233252%2C58.015566&mode=whatshere&whatshere%5Bpoint%5D=56.233252%2C58.015566&z=16";

const DEFAULT_FALLBACK = {
  title: "Interactive map unavailable",
  description: "Your browser could not initialize WebGL.",
  link: "Open in Yandex Maps",
};

function DarkMap({ onUnavailable }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    let map = null;
    const result = createMapSafely(() => {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapstyle,
        center: MAP_CENTER,
        zoom: 15,
        attributionControl: false,
      });

      new maplibregl.Marker({ color: "#7ba9e6ff" })
        .setLngLat(MAP_CENTER)
        .addTo(map);

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      map.on("webglcontextlost", (event) => {
        event.preventDefault();
        map.resize();
      });

      return map;
    });

    if (result.error) {
      map?.remove();
      console.warn("Interactive map is unavailable:", result.error);
      onUnavailable();
      return;
    }

    mapInstance.current = result.map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onUnavailable]);

  return <div ref={mapContainer} className="map-canvas" />;
}

function MapFallback({ address, content }) {
  return (
    <div className="map-fallback" role="status">
      <div className="map-fallback-marker" aria-hidden="true" />
      <div className="map-fallback-content">
        <strong>{content.title}</strong>
        <span>{content.description}</span>
        <span className="map-fallback-address">{address.join(", ")}</span>
        <a href={YANDEX_MAP_URL} target="_blank" rel="noreferrer">
          {content.link}
        </a>
      </div>
    </div>
  );
}

export default function MapSection({
  interactionLabel = "Click to interact with the map",
  fallback = DEFAULT_FALLBACK,
  address = [],
}) {
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const handleUnavailable = useCallback(() => setMapUnavailable(true), []);

  return (
    <div className="map-shell">
      {mapUnavailable ? (
        <MapFallback address={address} content={fallback} />
      ) : (
        <>
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
          <DarkMap onUnavailable={handleUnavailable} />
        </>
      )}
    </div>
  );
}
