
import { useEffect } from 'react';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const useHomeScreenAnimation = () => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);
    const translateY = useSharedValue(20);

    const start = () => {
        opacity.value = withTiming(1, { duration: 500 });
        scale.value = withSpring(1, { damping: 12 });
        translateY.value = withSpring(0, { damping: 10 });
    };

    const reset = () => {
        opacity.value = 0;
        scale.value = 0.9;
        translateY.value = 20;
    };

    useEffect(() => {
        start();
    }, []);

    return {
        opacity,
        scale,
        translateY,
        start,
        reset
    };
};

export default useHomeScreenAnimation;
