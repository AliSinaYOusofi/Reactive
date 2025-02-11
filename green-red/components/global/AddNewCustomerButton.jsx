import React from 'react';
import { View, StyleSheet, Pressable, Linking, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserRoundPlus } from 'lucide-react-native';

export default function ActionButtons() {
    const navigation = useNavigation();

    const handleAddCustomer = () => {
        navigation.navigate('Add Customer');
    };

    const handleOpenPaypal = () => {
        Linking.openURL('https://www.paypal.com/paypalme/habibyousofi');
    };

    const handleNavigateToChart = () => {
        navigation.navigate('Chart');
    };

    return (
        <View style={styles.container}>
            
            <Pressable style={styles.button} onPress={handleAddCustomer}>
                <UserRoundPlus size={24} color="white" />
                <Text style={styles.text}>Add User</Text>
            </Pressable>
            
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        
        backgroundColor: 'white',
        width: '100%',
        
        columnGap: 8,
        alignItems: 'center'
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#14171A",
        borderRadius: 9999,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: "90%",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    separator: {
        height: '100%',
        width: 1,
        backgroundColor: 'gray',
    },

    text: {
        color: "white",
        fontSize: 16,
    }
});
