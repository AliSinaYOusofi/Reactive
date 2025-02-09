import { useCallback } from "react";
import {
    withTiming,
    useSharedValue,
    WithTimingConfig,
    Easing,
} from "react-native-reanimated";

const useDeleteAnimation = () => {
    const opacity = useSharedValue(1);
    const translateX = useSharedValue(0);
    const height = useSharedValue("auto");

    const animateDelete = useCallback(() => {
        const config = {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
        };

        opacity.value = withTiming(0, config);
        translateX.value = withTiming(-100, config);
        height.value = withTiming(0, config);
    }, []);

    return {
        opacity,
        translateX,
        height,
        animateDelete,
    };
};

export default useDeleteAnimation;
