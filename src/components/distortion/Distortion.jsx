// Distortion.js
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const Distortion = () => {
  const groupRef = useRef();

  // shapes Material
  const redMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#808080') },
      uGlitchStrength: { value: 0.3 }
    },
  }), []);

  // ground Material
  const blueMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    depthWrite: true,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#525252') },
      uGlitchStrength: { value: 0.3 }

    },
  }), []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    // Update both materials with the same animation data
    [redMaterial, blueMaterial].forEach((material) => {
      material.uniforms.uTime.value = elapsed;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Ground Plane (not affected by  shader) */}
  <mesh
    position={[0, 0, 0]}
    rotation={[-Math.PI / 2, 0, 0]}
    receiveShadow
    material={blueMaterial}
  >
    <planeGeometry args={[30, 30]} />
    {/* <meshStandardMaterial color="#eeeeee" /> */}
  </mesh>


      {/* Shader Objects with Different Colors */}
      <mesh position={[4, 2, 7]} material={redMaterial} renderOrder={1}>
        <boxGeometry args={[3, 3, 3]} />
      </mesh>

      <mesh position={[5, 1.5, -2]} material={redMaterial} renderOrder={1}>
        <sphereGeometry args={[1.5, 32, 32]} />
      </mesh>

      <mesh position={[-5, 3.6, -6]} material={redMaterial} renderOrder={1}>
        <coneGeometry args={[3, 7, 32]} />
      </mesh>

      <mesh position={[0, 3.6, 0]} material={redMaterial} renderOrder={1}>
        <boxGeometry args={[1, 7, 1]} />
      </mesh>
    </group>
  );
};

export default Distortion;
