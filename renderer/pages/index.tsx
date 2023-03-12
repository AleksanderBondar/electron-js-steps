import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, KeyboardControls, KeyboardControlsEntry, Sky, PointerLockControls } from '@react-three/drei'
import { Physics, Quad, Triplet } from '@react-three/cannon'
import * as THREE from "three";
import { Ground } from "../src/canvas/Ground";
import { Player } from "../src/canvas/Player";
import Layout from "../src/layout/layout";
import { io, Socket } from "socket.io-client";
enum Controls {
  forward = 'forward',
  back = 'backward',
  left = 'left',
  right = 'right',
  jump = 'jump',
}


const IndexPage = () => {
  const mesh = useRef(null)

  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener("message", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("message", handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    global.ipcRenderer.send("message", "hi from next");
  };


  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'w', 'W'] },
      { name: Controls.back, keys: ['ArrowDown', 's', 'S'] },
      { name: Controls.left, keys: ['ArrowLeft', 'a', 'A'] },
      { name: Controls.right, keys: ['ArrowRight', 'd', 'D'] },
      { name: Controls.jump, keys: ['Space'] },
    ],
    [],
  )

  useEffect(() => {
    initSocket()
  }, [])

  const [socket, setSocket] = useState<Socket>()

  const initSocket = async () => {
    if (socket) return
    const correctLink = 'https://192.168.0.247:7777/'
    let _socket = io(correctLink, { transports: ['websocket'] })
    setSocket(_socket)
    _socket.on('connect', () => {
      _socket.emit('generatePlayer')
    })

    _socket.on('removePlayer', (msg) => {
    })

    _socket.on('newPlayer', (msg) => {
    })
    _socket.on('playerPositionUpdated', (msg) => {
    })
  }

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <div className="w-screen h-screen">
        <KeyboardControls map={map}> 
          <Canvas shadows camera={{ fov: 75 }}>
            <directionalLight intensity={0.75} />
            <ambientLight intensity={0.75} />
            <Sky sunPosition={[100, 20, 100]} />
            <group ref={mesh}>
              <Physics gravity={[0, -30, 0]}>
                <Ground />
                <Player />
              </Physics>
            </group>
            <Preload all />
            <PointerLockControls />
          </Canvas>
        </KeyboardControls>
      </div>
      {/* <h1 className="flex text-red-500">Hello Next.js 👋</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      <p>
        <Link href="/about">About</Link>
      </p> */}
    </Layout>
  );
};

export default IndexPage;

function Box(props) {
  const mesh = useRef<THREE.Mesh>()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (mesh.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}