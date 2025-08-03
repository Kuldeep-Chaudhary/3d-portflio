import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import BlackCar from './BlackCar'
import { RigidBody, useRapier, vec3 } from '@react-three/rapier'
import * as THREE from 'three'

const CarControl = () => {
  const rigidBodyRef = useRef()
  const { camera } = useThree()
  const { rapier, world } = useRapier()
  const [keysPressed, setKeysPressed] = useState({})

  const rotationTorque = 10
  const drivePower = 30
  const brakePower = 10
  const boostPower = 60
  const maxSpeed = 30

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: true }))
    const handleKeyUp = (e) => setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }))
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const car = rigidBodyRef.current
    if (!car) return

    const transform = car.translation()
    const velocity = car.linvel()
    const rot = car.rotation()

    // Raycast down to check if grounded
    const rayOrigin = vec3(transform.x, transform.y, transform.z)
    const rayDir = vec3(0, -1, 0)
    const ray = new rapier.Ray(rayOrigin, rayDir)
    const hit = world.castRay(ray, 0.3, true)
    const isGrounded = !!hit

    // Calculate forward direction
    const rotY = rot.toEuler().y
    const forward = new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY))

    const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2)

    if (isGrounded) {
      // Forward (ArrowUp or W)
      if (keysPressed['arrowup'] || keysPressed['w']) {
        const force = forward.clone().multiplyScalar(keysPressed['shift'] ? boostPower : drivePower)
        car.applyImpulse({ x: force.x, y: 0, z: force.z }, true)
      }

      // Brake / reverse (ArrowDown or S or Space)
      if (keysPressed['arrowdown'] || keysPressed['s'] || keysPressed[' ']) {
        const reverse = forward.clone().multiplyScalar(-brakePower)
        car.applyImpulse({ x: reverse.x, y: 0, z: reverse.z }, true)
      }

      // Turning
      if (keysPressed['arrowleft'] || keysPressed['a']) {
        car.applyTorqueImpulse({ x: 0, y: rotationTorque, z: 0 }, true)
      }
      if (keysPressed['arrowright'] || keysPressed['d']) {
        car.applyTorqueImpulse({ x: 0, y: -rotationTorque, z: 0 }, true)
      }

      // Clamp max speed
      if (currentSpeed > maxSpeed) {
        const factor = maxSpeed / currentSpeed
        car.setLinvel(
          { x: velocity.x * factor, y: velocity.y, z: velocity.z * factor },
          true
        )
      }
    }

    // ----- STABLE CAMERA FOLLOW -----
    // Keep camera upright, only rotate horizontally
    const yaw = rot.toEuler().y
    const cameraOffset = new THREE.Vector3(
      Math.sin(yaw) * -5,
      3,
      Math.cos(yaw) * -5
    )

    const targetPos = new THREE.Vector3(
      transform.x + cameraOffset.x,
      transform.y + cameraOffset.y,
      transform.z + cameraOffset.z
    )

    camera.position.lerp(targetPos, 0.1)
    camera.lookAt(transform.x, transform.y + 1.5, transform.z)
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders="cuboid"
      mass={150}
      friction={1}
      linearDamping={0.4}
      angularDamping={0.5}
      position={[0, 2, 0]}
    >
      <BlackCar />
    </RigidBody>
  )
}

export default CarControl
