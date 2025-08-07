import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import BlackCar from "./BlackCar";
import * as THREE from "three";

const CarController = () => {
  const [followMode, setFollowMode] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false); // ✅ Track CapsLock

  const rigidRef = useRef();
  const { camera, scene } = useThree();
  const baseForce = 0.15;
  const boostForce = 0.3;
  const backwardForce = 0.15;
  const baseTurnTorque = 0.03;

  const [keys, setKeys] = useState({});
  const smoothedCamPos = useRef(new THREE.Vector3());
  const smoothedLookAt = useRef(new THREE.Vector3());

  const carPos = useRef(new THREE.Vector3());
  const followTarget = useRef(new THREE.Object3D());
  const lastFlipTime = useRef(0);

  const defaultCameraPos = new THREE.Vector3(0, 10, 20);
  const defaultLookAt = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    if (scene && followTarget.current) {
      scene.add(followTarget.current);
    }
  }, [scene]);

  useEffect(() => {
    const down = (e) => {
      const key = e.key.toLowerCase();
      setKeys((k) => ({ ...k, [key]: true }));

      // ✅ Check and set CapsLock state
      if (e.getModifierState && e.getModifierState("CapsLock")) {
        setIsCapsLock(true);
      } else {
        setIsCapsLock(false);
      }

      if (e.ctrlKey && key === "c") {
        setFollowMode((prev) => !prev);
      }
    };

    const up = (e) => {
      const key = e.key.toLowerCase();
      setKeys((k) => ({ ...k, [key]: false }));

      // ✅ Update CapsLock state again on key release
      if (e.getModifierState && e.getModifierState("CapsLock")) {
        setIsCapsLock(true);
      } else {
        setIsCapsLock(false);
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (!followMode) {
      smoothedCamPos.current.copy(defaultCameraPos);
      smoothedLookAt.current.copy(defaultLookAt);
      camera.position.copy(defaultCameraPos);
      camera.lookAt(defaultLookAt);
    }
  }, [followMode]);

  useFrame((state, delta) => {
    const body = rigidRef.current;
    if (!body) return;

    const transform = body.translation();
    const rotation = body.rotation();
    const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize();
    const upVector = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);
    const isUpsideDown = upVector.y < 0.3;
    const now = performance.now();

    handleFlip(body, transform, rotation, isUpsideDown, now);
    if (!isUpsideDown) {
      handleMovement(body, forward);
    }

    carPos.current.set(transform.x, transform.y, transform.z);
    followTarget.current.position.lerp(carPos.current, 0.15);

    const lerpAlpha = THREE.MathUtils.clamp(1 - Math.pow(0.01, delta), 0.01, 1);
    if (followMode) {
      updateCamera(forward, lerpAlpha);
    }
  });

  const handleMovement = (body, forward) => {
    const forwardForce = isCapsLock ? boostForce : baseForce; // ✅ Use CapsLock state

    if (keys["w"] || keys["arrowup"]) {
      body.applyImpulse(forward.clone().multiplyScalar(forwardForce), true);
    }
    if (keys["s"] || keys["arrowdown"]) {
      body.applyImpulse(forward.clone().multiplyScalar(-backwardForce), true);
    }

    const velocity = body.linvel();
    const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);

    let turnTorque = baseTurnTorque;
    if (speed > 2) turnTorque *= 0.4;
    else if (speed > 1) turnTorque *= 0.7;
    else if (speed < 0.2) turnTorque *= 1.2;

    if (keys["a"] || keys["arrowleft"]) {
      body.applyTorqueImpulse(new THREE.Vector3(0, turnTorque, 0), true);
    }
    if (keys["d"] || keys["arrowright"]) {
      body.applyTorqueImpulse(new THREE.Vector3(0, -turnTorque, 0), true);
    }
  };

  const handleFlip = (body, transform, rotation, isUpsideDown, now) => {
    if (keys["r"] && isUpsideDown && now - lastFlipTime.current > 1000) {
      resetCar(body, transform, rotation);
      lastFlipTime.current = now;
    }

    if (isUpsideDown) {
      if (lastFlipTime.current === 0) {
        lastFlipTime.current = now;
      } else if (now - lastFlipTime.current > 3000) {
        resetCar(body, transform, rotation);
        lastFlipTime.current = 0;
      }
    } else {
      lastFlipTime.current = 0;
    }
  };

  const resetCar = (body, transform, rotation) => {
    body.setTranslation({ x: transform.x, y: transform.y + 2, z: transform.z }, true);
    body.setRotation({ x: 0, y: rotation.y, z: 0, w: 1 }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };

  const updateCamera = (forward, lerpAlpha) => {
    const camOffset = forward.clone().multiplyScalar(-6).add(new THREE.Vector3(0, 2.5, 0));
    const targetCamPos = followTarget.current.position.clone().add(camOffset);
    const targetLook = followTarget.current.position.clone().add(new THREE.Vector3(0, 1, 0));

    smoothedCamPos.current.lerp(targetCamPos, lerpAlpha);
    smoothedLookAt.current.lerp(targetLook, lerpAlpha);

    camera.position.copy(smoothedCamPos.current);
    camera.lookAt(smoothedLookAt.current);
  };

  return (
    <RigidBody
      ref={rigidRef}
      type="dynamic"
      colliders="hull"
      mass={5}
      friction={1}
      restitution={0.5}
      linearDamping={0.9}
      angularDamping={1.5}
      position={[0, 1, 0]}
      canSleep={false}
    >
      <BlackCar />
    </RigidBody>
  );
};

export default CarController;




// import React, { useRef, useEffect, useState } from 'react'
// import { useFrame, useThree } from '@react-three/fiber'
// import BlackCar from './BlackCar'
// import { RigidBody, useRapier, vec3 } from '@react-three/rapier'
// import * as THREE from 'three'

// const CarControl = () => {
//   const rigidBodyRef = useRef()
//   const { camera } = useThree()
//   const { rapier, world } = useRapier()
//   const [keysPressed, setKeysPressed] = useState({})

//   const rotationTorque = 10
//   const drivePower = 30
//   const brakePower = 10
//   const boostPower = 60
//   const maxSpeed = 30

//   // Keyboard events
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: true }))
//     }

//     const handleKeyUp = (e) => {
//       setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }))
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     window.addEventListener('keyup', handleKeyUp)
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown)
//       window.removeEventListener('keyup', handleKeyUp)
//     }
//   }, [])

//   useFrame(() => {
//     const car = rigidBodyRef.current
//     if (!car) return

//     const transform = car.translation()
//     const velocity = car.linvel()
//     const rot = car.rotation()

//     // Raycast down to check if grounded
//     const rayOrigin = vec3(transform.x, transform.y, transform.z)
//     const rayDir = vec3(0, -1, 0)
//     const ray = new rapier.Ray(rayOrigin, rayDir)
//     const hit = world.castRay(ray, 0.3, true)
//     const isGrounded = !!hit

//     // Driving force
//     if (isGrounded) {
//       const rotY = rot.toEuler().y
//       const forward = new THREE.Vector3(
//         Math.sin(rotY),
//         0,
//         Math.cos(rotY)
//       )

//       const currentSpeed = Math.sqrt(
//         velocity.x * velocity.x + velocity.z * velocity.z
//       )

//       // Forward
//       if (keysPressed['arrowup']) {
//         const force = forward.multiplyScalar(keysPressed['shift'] ? boostPower : drivePower)
//         car.applyImpulse({ x: force.x, y: 0, z: force.z }, true)
//       }

//       // Backward / Braking
//       if (keysPressed['arrowdown'] || keysPressed[' ']) {
//         const reverse = forward.multiplyScalar(-brakePower)
//         car.applyImpulse({ x: reverse.x, y: 0, z: reverse.z }, true)
//       }

//       // Turn left/right
//       if (keysPressed['arrowleft']) {
//         car.applyTorqueImpulse({ x: 0, y: rotationTorque, z: 0 }, true)
//       }
//       if (keysPressed['arrowright']) {
//         car.applyTorqueImpulse({ x: 0, y: -rotationTorque, z: 0 }, true)
//       }

//       // Clamp speed
//       if (currentSpeed > maxSpeed) {
//         const factor = maxSpeed / currentSpeed
//         car.setLinvel({
//           x: velocity.x * factor,
//           y: velocity.y,
//           z: velocity.z * factor
//         }, true)
//       }
//     }

//     // Smooth follow camera
//     // const cameraOffset = new THREE.Vector3(0, 6, -15).applyQuaternion(rot)
//     const cameraOffset = new THREE.Vector3(0, 3, -5).applyQuaternion(rot)
//     const targetPos = new THREE.Vector3(
//       transform.x + cameraOffset.x,
//       transform.y + cameraOffset.y,
//       transform.z + cameraOffset.z
//     )
//     camera.position.lerp(targetPos, 0.1)
//     camera.lookAt(transform.x, transform.y + 1.5, transform.z)
//   })

//   return (
//     <RigidBody
//       ref={rigidBodyRef}
//       type="dynamic"
//       colliders="cuboid"
//       mass={150}
//       friction={1}
//       linearDamping={0.4}
//       angularDamping={0.5}
//       position={[0, 2, 0]}
//     >
//       <BlackCar />
//     </RigidBody>
//   )
// }

// export default CarControl
