import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import mapstyle from "./assets/mapstyle.json"; // путь к вашему стилю карты
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
      attributionControl: false // <- убирает дефолтный блок
    });
  //  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    // Добавление метки
    new maplibregl.Marker({ color: "#7ba9e6ff" }) 
      .setLngLat([56.233252, 58.015566])
      .addTo(mapInstance.current);

    mapInstance.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // 👇 слушаем потерю контекста и пересоздаём карту
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

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
  <div
    ref={mapContainer}
    style={{ width: "100%", height: "100%", borderRadius: "12px" }}
  />
</div>
  );
}

export default function MapSection() {
  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      {/* Оверлей для "разблокировки карты по клику" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          cursor: "grab",
          background: "transparent",
        }}
        tabIndex={0}
        aria-label="Для взаимодействия с картой кликните"
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