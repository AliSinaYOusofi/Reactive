import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Easing, withRepeat, withTiming } from 'react-native-reanimated';
import { ArrowDown } from 'lucide-react-native';

export default function NoUserAddedInfo() {

    const offset = useSharedValue(10);

    const animatedStyle = useAnimatedStyle( () => (
        {
            transform: [{translateY: offset.value}]
        }
        )
    )
    
    React.useEffect( () => {
        offset.value = withRepeat(
            withTiming(-offset.value, { duration: 410}), -1, true
        )
    })

    return (
        <View style={styles.container}>
            <Text style={styles.text_big}>No customers added.</Text>
            <Text style={styles.text}>Add a new customer by clicking the button below</Text>
            
            <Animated.View style={[styles.iconContainer, styles.icon, animatedStyle]}>
                <ArrowDown size={24} color="black" />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f8f8ff",
        borderRadius: 10,
        padding: 10,
       
    },
    iconContainer: {
        marginBottom: 20,
    },
    text: {
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'blue',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    text_big: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    icon: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 50,
        marginTop: 20
    }
});
