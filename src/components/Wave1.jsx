import { useFrame } from '@react-three/fiber'
import React, { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import vertexShader from "../shaders/test2/vertexShader.glsl"
import fragmentShader from "../shaders/test2/fragmentShader.glsl"
import { useControls } from 'leva'

const Wave1 = () => {
  const meshRef = useRef()

  const { frequencyX, frequencyY } = useControls({
    frequencyX: { value: 10, min: 0, max: 50, step: 0.1 },
    frequencyY: { value: 5, min: 0, max: 50, step: 0.1 },
  })

  // ✅ Keep uniforms stable across renders
  const uniforms = useRef({
    uTime: { value: 0 },
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uColor: { value: new THREE.Color('orange') },
  }).current


  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.getElapsedTime()
      uniforms.uFrequency.value.set(frequencyX, frequencyY)
    }
  })

  return (
    <mesh ref={meshRef} scale={[1, 2/3, 1]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        // wireframe={true}
      />
    </mesh>
  )
}

export default Wave1
