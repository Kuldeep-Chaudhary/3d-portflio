// BlackCar.jsx
import React from 'react'
import { useGLTF } from '@react-three/drei'

const BlackCar = () => {
  const gltf = useGLTF('/cars/cyberpunk_car.compressed.glb')
  // const gltf = useGLTF('/cars/yellow-car.compressed.glb')
  return <primitive object={gltf.scene} scale={0.003} rotation={[0, Math.PI, 0]}/>
}

export default BlackCar
