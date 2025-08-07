import React, { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import CarEnvironment from '../components/cars/CarEnvirment'
import CarController from '../components/cars/Car'

export default function Home() {
  return (
    <>
      <Canvas camera={{ position: [-16, 7, 20], fov: 60 }} style={{ width: '100vw', height: '100vh', backgroundColor: "#000" }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={3} />
         <Suspense fallback={null}>
         <Physics>
        <CarEnvironment/>
        <CarController />
        </Physics>
        </Suspense>
        <OrbitControls  enabled enableDamping />
      </Canvas>
    </>
  )
}
