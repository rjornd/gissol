import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
function DarkMap() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [56.233252, 58.015566],
      zoom: 15,
      attributionControl: false // <- убирает дефолтный блок
    });
    
    // Добавление метки
    new maplibregl.Marker({ color: "#7ba9e6ff" }) // цвет метки, например Tomato
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
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px", borderRadius: "12px" }}
    />
  );
}

export default function MapSection({ mapSection }) {
  if (!mapSection) return null;

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
        maxWidth: "900px",
      }}
    >
      <div className="section-content" style={{ textAlign: "center" }}>
        Российская Федерация, г. Пермь, ул. Монастырская, д. 12, офис 104
      </div>

      {/* Оверлей для "разблокировки карты по клику" */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "400px",
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