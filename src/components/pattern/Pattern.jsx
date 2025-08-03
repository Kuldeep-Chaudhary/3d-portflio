import React, { useRef } from 'react'
import vertexShader from "./shaders/vertexShader.glsl?raw"
import fragmentShader from "./shaders/fragmentShader.glsl?raw"
import { DoubleSide } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const Pattern = () => {
  const materialRef = useRef()

  // 1️⃣ Load your image texture
  const texture = useLoader(THREE.TextureLoader, '/img.jpg') // ✅ put img.jpg in /public

useFrame(({ clock }) => {
  if (materialRef.current) {
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  }
});

  return (
    <mesh>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
        uniforms={{
  uTime: { value: 0 },
  uTexture: { value: texture }
}}
      />
    </mesh>
  )
}

export default Pattern
