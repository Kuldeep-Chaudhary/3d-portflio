import React from 'react'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import RoadSystem from '../roads/RoadSystem'

const CarEnvironment = () => {
  
  // const blueMaterial = new THREE.MeshStandardMaterial({ color: '#bcd' })
  // const boxMaterial = new THREE.MeshStandardMaterial({ color: '#262526ff' })
  // const coneMaterial = new THREE.MeshStandardMaterial({ color: '#262526ff' })
  // const ballMaterial = new THREE.MeshStandardMaterial({ color: '#262526ff' })
  // const wallMaterial = new THREE.MeshStandardMaterial({ color: '#999' })
  
  const blueMaterial = new THREE.MeshStandardMaterial({ color: '#2a2a2a' })
  const boxMaterial = new THREE.MeshStandardMaterial({ color: '#000' })
  const coneMaterial = new THREE.MeshStandardMaterial({ color: '#000' })
  const ballMaterial = new THREE.MeshStandardMaterial({ color: '#000' })
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#2a2a2a' })

  const wallThickness = 1
  const wallHeight = 1
  const groundSize = 150

  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid" friction={1} restitution={0.5}>
        <mesh
          position={[0, -0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={blueMaterial}
          receiveShadow
        >
          <planeGeometry args={[groundSize, groundSize]} />
          
        </mesh>
      </RigidBody>

      {/* Boundary Walls */}
      {/* Left Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[-groundSize / 2, wallHeight / 2, 0]}
          material={wallMaterial}
        >
          <boxGeometry args={[wallThickness, wallHeight, groundSize]} />
        </mesh>
      </RigidBody>

      {/* Right Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[groundSize / 2, wallHeight / 2, 0]}
          material={wallMaterial}
        >
          <boxGeometry args={[wallThickness, wallHeight, groundSize]} />
        </mesh>
      </RigidBody>

      {/* Front Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[0, wallHeight / 2, -groundSize / 2]}
          material={wallMaterial}
        >
          <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
        </mesh>
      </RigidBody>

      {/* Back Wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[0, wallHeight / 2, groundSize / 2]}
          material={wallMaterial}
        >
          <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
        </mesh>
      </RigidBody>

      {/* Box obstacle */}
      <RigidBody type="dynamic" colliders="cuboid" position={[3, 1, 2]}>
        <mesh castShadow material={boxMaterial}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </RigidBody>

      {/* Sphere (ball) */}
      <RigidBody type="dynamic" colliders="ball" position={[-3, 1, 0]}>
        <mesh castShadow material={ballMaterial}>
          <sphereGeometry args={[0.5, 32, 32]} />
        </mesh>
      </RigidBody>

      {/* Cone */}
      <RigidBody type="dynamic" colliders="hull" position={[0, 1, -3]}>
        <mesh castShadow material={coneMaterial}>
          <coneGeometry args={[0.5, 1.2, 32]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
  <mesh
    position={[5, 0.25, -10]}
    rotation={[-Math.PI / 12, 0, 0]} // 22.5 degrees
    castShadow
    receiveShadow
    material={wallMaterial}
  >
    <boxGeometry args={[4, 0.2, 3]} />
  </mesh>
</RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
  <mesh
    position={[5, 0.25, -7.2 ]}
    rotation={[Math.PI / 12, 0, 0]} // 22.5 degrees
    castShadow
    receiveShadow
    material={wallMaterial}
  >
    <boxGeometry args={[4, 0.2, 3]} />
  </mesh>
</RigidBody>
<RoadSystem/>

      {Array.from({ length: 100 }).map((_, i) => {
  const x = (Math.random() - 0.5) * 40
  const z = (Math.random() - 0.5) * 40
  const y = Math.random() * 2 + 1 // drop height between 1 and 3

  return (
    <RigidBody
      key={`small-ball-${i}`}
      type="dynamic"
      colliders="ball"
      position={[x, y, z]}
      mass={0.1}
      friction={0.1}
      restitution={1}
    >
      <mesh castShadow material={ballMaterial}>
        <sphereGeometry args={[0.09, 16, 16]} />
      </mesh>
    </RigidBody>
  )
})}

    </>
  )
}

export default CarEnvironment
