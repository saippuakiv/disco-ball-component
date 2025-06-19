import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

const TILE_COUNT_X = 12;
const TILE_COUNT_Y = 8;
const TILE_SIZE = 32;
const SIZE_X = TILE_COUNT_X * TILE_SIZE;
const SIZE_Y = TILE_COUNT_Y * TILE_SIZE;

function useDynamicBrickTexture() {
  const [highlight, setHighlight] = useState({ x: 0, y: 0 });
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastUpdateRef = useRef(0);
  const UPDATE_INTERVAL = 100; // ms

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE_X;
    canvas.height = SIZE_Y;
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    textureRef.current = texture;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE_X, SIZE_Y);
      const margin = 2;

      for (let y = 0; y < TILE_COUNT_Y; y++) {
        for (let x = 0; x < TILE_COUNT_X; x++) {
          const isBlue = x === highlight.x && y === highlight.y;

          // Dark grout background
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

          // Brighter tiles: 70% white, 30% light gray
          const r = Math.random();
          const v = r < 0.7 ? 255 : Math.floor(200 + Math.random() * 40);
          if (isBlue) {
            ctx.fillStyle = '#60A5FA'; // Blue tile color
          } else {
            // 🎨 Gray tile with slight HSL hue shift
            const hue = Math.floor(Math.random() * 30) - 15; // [-15°, +15°]
            const sat = Math.floor(0 + Math.random() * 10); // 5% ~ 15% saturation
            const light = Math.floor(85 + Math.random() * 10); // Lightness 85~95%
            ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
          }

          ctx.fillRect(
            x * TILE_SIZE + margin,
            y * TILE_SIZE + margin,
            TILE_SIZE - 2 * margin,
            TILE_SIZE - 2 * margin
          );

          // Glow effect for the blue tile
          if (isBlue) {
            const cx = x * TILE_SIZE + TILE_SIZE / 2;
            const cy = y * TILE_SIZE + TILE_SIZE / 2;
            const radius = TILE_SIZE / 2;
            const glow = ctx.createRadialGradient(
              cx,
              cy,
              radius / 4,
              cx,
              cy,
              radius
            );
            glow.addColorStop(0, 'rgba(96,165,250,0.8)');
            glow.addColorStop(1, 'rgba(96,165,250,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      texture.needsUpdate = true;
    };

    draw();

    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < UPDATE_INTERVAL) return;
      lastUpdateRef.current = now;

      const x = Math.floor((e.clientX / window.innerWidth) * TILE_COUNT_X);
      const y = Math.floor((e.clientY / window.innerHeight) * TILE_COUNT_Y);
      setHighlight({ x, y });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [highlight]);

  return textureRef.current;
}

function Ball() {
  const texture = useDynamicBrickTexture();

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.9}
        roughness={0.45} // Increase highlight area
        clearcoat={0.7}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function Discoball() {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={2.0} />
      <directionalLight position={[3, 3, 3]} intensity={5.5} />
      <pointLight position={[-2, 2, 1]} intensity={1.5} />
      <Ball />
    </Canvas>
  );
}
