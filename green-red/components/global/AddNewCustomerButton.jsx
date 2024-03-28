import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
export default function ActionButtons() {
    const navigation = useNavigation();

    const handleAddCustomer = () => {
        navigation.navigate('Add Customer');
    };

    const handleOpenPaypal = () => {
        Linking.openURL('https://www.paypal.com');
    };

    const handleNavigateToChart = () => {
        navigation.navigate('Chart');
    };

    return (
        <View style={styles.container}>
            
            <Pressable style={styles.button} onPress={handleAddCustomer}>
                <AntDesign name="adduser" size={24} color="white" />
            </Pressable>
            
            
            <Pressable style={styles.button} onPress={handleOpenPaypal}>
                <EvilIcons name="heart" size={34} color="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        columnGap: 8
    },
    button: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: "#181c20",
        paddingHorizontal: 10,
        borderRadius: 4,
        paddingVertical: 15,
        width: "50%"
    },
    separator: {
        height: '100%',
        width: 1,
        backgroundColor: 'gray',
    },
});
