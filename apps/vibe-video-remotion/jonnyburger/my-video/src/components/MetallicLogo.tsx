import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';
import { useTexture } from '@react-three/drei';

export const MetallicLogo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Load texture from public folder
  const texture = useTexture(staticFile('image.png'));

  // Entrance animation (frames 0-20): Scale from 0 to 1
  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 200 }, // Smooth entrance, no bounce
  });

  // Rotation animation (frames 0-60): Rotate 90° on Y-axis
  const rotationY = interpolate(
    frame,
    [0, 60],
    [0, Math.PI * 0.5],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <mesh
      rotation={[0, rotationY, 0]}
      scale={scaleProgress}
    >
      {/* Plane geometry with aspect ratio matching image (1280:720) */}
      <planeGeometry args={[6, 3.375]} />

      {/* Metallic material - balanced to show texture colors with metallic sheen */}
      <meshStandardMaterial
        map={texture}
        metalness={0.6}
        roughness={0.3}
        envMapIntensity={1.2}
      />
    </mesh>
  );
};
