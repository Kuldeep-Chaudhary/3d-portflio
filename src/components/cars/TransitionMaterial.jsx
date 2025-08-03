import React, { forwardRef } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import * as THREE from 'three'

const TransitionMat = shaderMaterial(
  { uTime: 0 },
  vertexShader,
  fragmentShader
)

extend({ TransitionMat })

const TransitionMaterial = forwardRef((props, ref) => {
  return <transitionMat ref={ref} attach="material" transparent />
})

export default TransitionMaterial
