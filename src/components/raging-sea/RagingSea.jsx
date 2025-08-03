import React, { useRef, useMemo } from 'react'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'

const RagingSea = () => {
  const materialRef = useRef()

  // Separate controls for X and Y wave frequency
 const {
  uWavesElevation,
  uWavesFrequencyX,
  uWavesFrequencyY,
  uDepthColor,
  uSurfaceColor,
  uColorOffset,
  uColorMultiplier,
  uWaveSpeed
} = useControls('Raging Sea Shader', {
  uWavesElevation: { value: 0.2, min: 0, max: 1, step: 0.001 },
  uWavesFrequencyX: { value: 4, min: 0, max: 30, step: 0.01 },
  uWavesFrequencyY: { value: 1.5, min: 0, max: 30, step: 0.01 },
  uWaveSpeed:{value:0.75, min:0,max:3,step:0.01},
  uDepthColor: { value: '#186691' },
  uSurfaceColor: { value: '#9bd8ff' },
  uColorOffset: { value: 0.08, min: 0, max: 2, step: 0.01 },
  uColorMultiplier: { value: 5.0, min: 0, max: 10, step: 0.01 }
})


  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWavesElevation: { value: uWavesElevation },
    uWavesFrequency: { value: new THREE.Vector2(uWavesFrequencyX, uWavesFrequencyY) },
    uDepthColor: { value: new THREE.Color(uDepthColor) },
    uSurfaceColor: { value: new THREE.Color(uSurfaceColor) },
  uColorOffset: { value: uColorOffset },
  uColorMultiplier: { value: uColorMultiplier },
  uWaveSpeed:{value: uWaveSpeed}
  }), []) // initialize only once

  useFrame(({ clock }) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime()

    // Live updates from Leva
    materialRef.current.uniforms.uWavesElevation.value = uWavesElevation
    materialRef.current.uniforms.uWavesFrequency.value.set(uWavesFrequencyX, uWavesFrequencyY)
    materialRef.current.uniforms.uDepthColor.value.set(uDepthColor)
    materialRef.current.uniforms.uSurfaceColor.value.set(uSurfaceColor)
    materialRef.current.uniforms.uColorOffset.value = uColorOffset
    materialRef.current.uniforms.uColorMultiplier.value = uColorMultiplier
    materialRef.current.uniforms.uWaveSpeed.value = uWaveSpeed

  })

  return (
    <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
      <planeGeometry args={[2, 2, 512, 512]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        // wireframe={true}
      />
    </mesh>
  )
}

export default RagingSea
