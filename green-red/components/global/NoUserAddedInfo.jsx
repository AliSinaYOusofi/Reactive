import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, interpolate, Easing } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

export default function NoUserAddedInfo() {

    const height = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: interpolate(height.value, [0, 100], [0, 50]) }
            ]
        };
    });

    const iconRotation = useSharedValue(0);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${iconRotation.value}deg` }],
        };
    });

    

    return (
        <View style={styles.container}>
            <Text style={styles.text_big}>No customers added.</Text>
            <Text style={styles.text}>Add a new customer by clicking the button below</Text>
            
            <Animated.View style={[styles.iconContainer, animatedStyle, animatedIconStyle, styles.icon]}>
                <AntDesign name="arrowdown" size={24} color="black" />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F8F8FF",
        borderRadius: 10,
        padding: 10,
        marginTop: 80,
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
        marginTop: 10
    }
});
