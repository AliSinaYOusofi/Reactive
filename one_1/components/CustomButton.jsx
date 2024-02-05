import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import SvgUri from 'react-native-svg';

const CustomButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <SvgUri
                source={{ uri: 'https://www.svgrepo.com/show/528979/full-screen.svg' }}
                style={styles.svg}
            />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 100,
        margin: 5,
    },
    svg: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    title: {
        color: 'white',
        fontSize: 16,
    },
});

export default CustomButton;
