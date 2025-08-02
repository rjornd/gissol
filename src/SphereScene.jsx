// SphereScene.jsx
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { animated, useSpring } from '@react-spring/three'

function RotatingSphere() {
  const meshRef = useRef()

  // Анимация с использованием react-spring
  const { rotation } = useSpring({
    loop: true,
    from: { rotation: [0, 0, 0.3] },
    to: { rotation: [0, Math.PI * 2, 0.3] },
    config: { duration: 10000 },
  })

  return (
    <animated.mesh ref={meshRef} rotation={rotation}>
      <sphereGeometry args={[2, 16, 12]} />
      <meshBasicMaterial wireframe color="#f5f7fa" />
    </animated.mesh>
  )
}

export default function SphereScene() {
  return (
    <div style={{ maxWidth: '150px'}}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <RotatingSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}