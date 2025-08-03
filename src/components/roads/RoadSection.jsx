import React from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { DoubleSide } from 'three'

const RoadSection = ({ position = [0, 0, 0], rotation = [-Math.PI / 2, 0, 0], length = 20 }) => {
  return (
    <>
    {/* // <RigidBody type="fixed" friction={2} position={position} rotation={rotation}> */}
      {/* Visual plane */}
      <mesh receiveShadow rotation={rotation} position={position}>
        <planeGeometry args={[length, 3]} />
        <meshStandardMaterial color="#2a2a2a" side={DoubleSide}/>
      </mesh>

      {/* Thin collider underneath the plane */}
      {/* <CuboidCollider args={[length / 2, 0.01, 1.5]} position={[0, 0.01, 0]} /> */}
    {/* </RigidBody> */}
    </>
  )
}

export default RoadSection
