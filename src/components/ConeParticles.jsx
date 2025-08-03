import * as THREE from 'three';
import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export default function ConeParticles({ count = 300 }) {
  const meshRef = useRef();
  const { viewport, mouse } = useThree();
  const [hoverDir, setHoverDir] = useState(0); // -1 for left, 1 for right

  // Pre-generate random positions inside cone
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const height = Math.random() * 6;
      const radius = (1 - height / 6) * 3;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius;
      temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    positions.forEach((pos, i) => {
      dummy.position.set(pos.x + hoverDir * 0.2 * Math.sin(t + i), pos.y, pos.z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Detect mouse direction
  useFrame(() => {
    if (mouse.x < -0.1) setHoverDir(-1);
    else if (mouse.x > 0.1) setHoverDir(1);
    else setHoverDir(0);
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="#ff8080" />
    </instancedMesh>
  );
}
