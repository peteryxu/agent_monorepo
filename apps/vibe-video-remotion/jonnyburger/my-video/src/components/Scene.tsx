import { Environment } from '@react-three/drei';
import { MetallicLogo } from './MetallicLogo';

export const Scene = () => {
  return (
    <>
      {/* Environment map for metallic reflections */}
      <Environment preset="studio" />

      {/* Ambient light for soft overall illumination */}
      <ambientLight intensity={0.8} />

      {/* Main highlight on metal */}
      <pointLight position={[10, 10, 5]} intensity={2.0} />

      {/* Colored rim light for visual interest */}
      <pointLight position={[-10, -5, -5]} intensity={1.2} color="#4a9eff" />

      {/* Fill light */}
      <directionalLight position={[0, 5, 5]} intensity={1.0} />

      {/* 3D Logo */}
      <MetallicLogo />
    </>
  );
};
