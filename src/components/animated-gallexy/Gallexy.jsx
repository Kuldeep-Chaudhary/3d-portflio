import React from 'react'
import vertexShader from "./shaders/VertexShader.glsl"
import fragmentShader from "./shaders/FragmentShader.glsl"

const Gallexy = () => {
  return (
    <mesh>
      <planeGeometry args={[1,1,32,32]}/>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe={true}
      />
    </mesh>
  )
}

export default Gallexy
