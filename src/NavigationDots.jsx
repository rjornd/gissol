import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';
export default function NavigationDots({ sections, visibleSections }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleScrollToSection = (index) => {
    const sectionElement = document.getElementById(sections[index].type);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000, // Ensures dots are above background
      }}
    >
      {sections.map((section, index) => {
        const isActive = visibleSections[index];
        const spring = useSpring({
          scale: hoveredIndex === index || isActive ? 1.5 : 1,
          opacity: hoveredIndex === index || isActive ? 1 : 0.8,
          backgroundColor: isActive ? '#28f2b5ff' : '#4FA3C3',
          config: { tension: 220, friction: 15 },
        });

        const tooltipSpring = useSpring({
          opacity: hoveredIndex === index ? 1 : 0,
          config: { tension: 220, friction: 15 },
        });

        return (
          <div key={index} style={{ position: 'relative' }}>
            <animated.div
              style={{
                ...spring,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 1001, // Ensures individual dots are above other elements
              }}
              onClick={() => handleScrollToSection(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {hoveredIndex === index && (
              <animated.div
                style={{
                  ...tooltipSpring,
                  position: 'absolute',
                  right: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#1B3A5F',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  whiteSpace: 'nowrap',
                  zIndex: 1002, // Ensures tooltip is above everything
                }}
              >
                {section.nav}
              </animated.div>
            )}
          </div>
        )
      })}
    </div>
  );
}