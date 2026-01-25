import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Text } from '@react-three/drei';

export const GoSavannahText = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Delay the text entrance until after the logo has scaled in (after frame 20)
  const textEntrance = spring({
    frame: frame - 20, // Start after logo entrance
    fps,
    config: { damping: 200 },
  });

  // Slide in from the right
  const slideX = interpolate(
    frame,
    [20, 40],
    [8, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <Text
      position={[slideX, -2.5, 0]}
      fontSize={0.8}
      color="#4a9eff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter-Bold.ttf"
      scale={textEntrance}
    >
      go Savannah
    </Text>
  );
};
