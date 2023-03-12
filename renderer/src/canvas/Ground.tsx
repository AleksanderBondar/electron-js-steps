import { usePlane } from '@react-three/cannon'
import { useTexture } from '@react-three/drei'
import React from 'react'
import * as THREE from 'three'

export const Ground: React.FC<{}> = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  const texture = useTexture('./grass.jpg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[240, 240]} />
      <meshStandardMaterial map={texture} map-repeat={[240, 240]} color='green' />
    </mesh>
  )
}
