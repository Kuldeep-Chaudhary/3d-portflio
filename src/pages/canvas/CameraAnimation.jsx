import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function CameraAnimation() {
  const { camera } = useThree()

  const targetPosition = new THREE.Vector3(-16, 7, 20)
  const initialPosition = new THREE.Vector3(0, 27, 20)

  const startTime = useRef(null)
  // const delay = 2
  const delay = 0
  const duration = 1
  const animationDone = useRef(false)
 
  useEffect(() => {
    camera.position.copy(initialPosition)
  }, [])

  useFrame((state) => {
    if (animationDone.current) return

    const elapsed = state.clock.getElapsedTime()
    if (elapsed < delay) return

    if (startTime.current === null) {
      startTime.current = elapsed
    }

    const timeSinceStart = elapsed - startTime.current
    const t = Math.min(timeSinceStart / duration, 1)

    const smoothT = t * t * (3 - 2 * t)
    camera.position.lerpVectors(initialPosition, targetPosition, smoothT)
    camera.lookAt(0, 0, 0)

    if (t >= 1) {
      animationDone.current = true
    }
  })

  return null
}
