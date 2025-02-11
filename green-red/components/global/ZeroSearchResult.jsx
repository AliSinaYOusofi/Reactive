import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { SearchX } from 'lucide-react-native';

export default function ZeroSearchResult() {
    return (
        <Animated.View entering={SlideInUp.duration(500)} style={styles.container}>
            <SearchX size={36} color="black" style={styles.icon} />
            <Text style={styles.text_big}>No results found</Text>
            <Text style={styles.text_small}>Try using different keywords</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f8f9fa",
        borderRadius: 10,
        padding: 20,
        
    },
    icon: {
        marginBottom: 15,
    },
    text_big: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#333",
        marginBottom: 5,
    },
    text_small: {
        fontSize: 14,
        color: "#666",
        textAlign: 'center',
    }
});
