import { useEffect } from 'react'
import { useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated'

const useAnimatedFloating = (config = {
    duration: 1500,
    springConfig: {
        damping: 10,
        stiffness: 100
    }
}) => {
    const translateY = useSharedValue(0)

    useEffect(() => {
        translateY.value = withRepeat(
            withSpring(-10, config.springConfig),
            -1,
            true
        )
    }, [])

    return { translateY }
}

export default useAnimatedFloating
