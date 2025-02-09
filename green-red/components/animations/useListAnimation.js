
import { useEffect } from 'react';
import { useSharedValue, withSpring, withSequence, withDelay } from 'react-native-reanimated';

const useListAnimation = (index = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(
      index * 100,
      withSpring(1, { damping: 15 })
    );
    translateY.value = withDelay(
      index * 100,
      withSpring(0, { damping: 12 })
    );
  }, []);

  return {
    opacity,
    translateY
  };
};

export default useListAnimation;
