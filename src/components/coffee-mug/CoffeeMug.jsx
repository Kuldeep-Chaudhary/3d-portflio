import React, { Suspense, useRef } from 'react'
import vertexShader from "./shaders/vertexShader.glsl"
import fragmentShader from "./shaders/fragementShader.glsl"
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const CoffeeMug = () => {
  const { scene } = useGLTF('/coffee-mug/bakedModel.glb')
  const perlinTexture = useTexture('/coffee-mug/perlin.png');
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;
   const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <>
      <Suspense fallback={null}>
        <primitive object={scene} />
          <mesh position={[0, 4.9, 0]} scale={[1.5, 3, 1]}>
      <planeGeometry args={[1, 4, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uPerlinTexture: { value: perlinTexture }
        }}
        side={THREE.DoubleSide}
      />
    </mesh>
      </Suspense>
    </>
  );
}

export default CoffeeMug
