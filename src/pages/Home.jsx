import React, { Suspense, use, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import CarEnvironment from '../components/cars/CarEnvirment'
import CarController from '../components/cars/Car'
import { MdWbSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";

export default function Home() {
  const [isNight, setIsNight] = useState(true)
    const toggleTheme = () => {
    setIsNight(prev => !prev)
  }

  // Colors based on theme
  const backgroundColor = isNight ? "#000" : "#fff" // sky blue
  const groundColor = isNight ? "#2a2a2a" : "#ffffff"     // dark vs light ground


  return (
    <>
     <button 
        onClick={toggleTheme} 
        style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
        className='daynight'
      >
        {isNight ? <MdWbSunny color='#fff'/>:<IoMoon/>}
      </button>
      <Canvas camera={{ position: [-16, 7, 20], fov: 60 }} style={{ width: '100vw', height: '100vh', backgroundColor:backgroundColor }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={3} />
         <Suspense fallback={null}>
         <Physics>
        {/* <CameraAnimation/> */}
        {/* <Wave1/> */}
        {/* <Pattern/> */}
        {/* <RagingSea/> */}
        {/* <Gallexy/> */}
        {/* <CoffeeMug/> */}
        {/* <Distortion/> */}
        <CarEnvironment data={groundColor}/>
        <CarController />
        </Physics>
        </Suspense>
        <OrbitControls  enabled enableDamping />
      </Canvas>
    </>
  )
}
