import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function CardSectionWithParticles({ children }) {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div style={{ position: "relative", padding: "20px", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true
            }
          },
          particles: {
            color: { value: ["#01a7bd", "#23d7eb", "#008ba3"] },
            links: {
              color: "#01a7bd",
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 1,
              outModes: { default: "bounce" }
            },
            number: {
              value: 50,
              density: { enable: true, area: 800 }
            },
            opacity: { value: 0.7 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } }
          },
          detectRetina: true
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}