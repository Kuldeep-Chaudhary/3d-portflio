// components/RoadSystem.jsx
import React from 'react'
import RoadSection from './RoadSection'

const RoadSystem = () => {
  return (
    <>
      {/* Straight road segments */}
      <RoadSection position={[0, 0, 0]} />
      {/* <RoadSection position={[20, 0, 0]} />
      <RoadSection position={[40, 0, 0]} /> */}

      {/* 90 degree turn (rotated) */}
      <RoadSection position={[60, 0, 10]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} />

      {/* More straight after turn */}
      {/* <RoadSection position={[60, 0, 30]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} />
      <RoadSection position={[60, 0, 50]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} /> */}
    </>
  )
}

export default RoadSystem
