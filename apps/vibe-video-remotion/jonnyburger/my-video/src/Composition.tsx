import { useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { Scene } from './components/Scene';

export const MyComposition = () => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{
        position: [0, 0, 8],
        fov: 45,
      }}
    >
      <Scene />
    </ThreeCanvas>
  );
};
