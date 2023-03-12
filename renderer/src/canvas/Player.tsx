import { SphereProps, useSphere } from '@react-three/cannon'
import { OrthographicCamera, PerspectiveCamera, useCamera, useGLTF, useKeyboardControls } from '@react-three/drei'
import { GroupProps, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MeshNormalMaterial } from 'three'

const SPEED = 3

const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const speed = new THREE.Vector3()

export const Player: React.FC<SphereProps> = (props) => {
  const [, get] = useKeyboardControls()

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 10, 0],
    ...props,
  }))

  const { camera } = useThree()
  const velocity = useRef([0, 0, 0])

  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [])

  useFrame(() => {
    if (!ref.current) return
    const { forward, backward, left, right, jump } = get()
      frontVector.set(0, 0, Number(backward) - Number(forward))
      sideVector.set(Number(left) - Number(right), 0, 0)
      direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation)
      speed.fromArray(velocity.current)
      api.velocity.set(direction.x, velocity.current[1], direction.z)
      if (jump && Math.abs(Number(velocity.current[1].toFixed(2))) < 0.05)
        api.velocity.set(velocity.current[0], 10, velocity.current[2])
  })

  return (
    <>
      <mesh ref={ref as any}>
        <sphereGeometry attach='geometry' args={[1, 16, 16]} />
        <meshStandardMaterial attach='material' color='white' transparent roughness={0.1} metalness={0.1} />
        <PerspectiveCamera makeDefault />
      </mesh>
    </>
  )
}
