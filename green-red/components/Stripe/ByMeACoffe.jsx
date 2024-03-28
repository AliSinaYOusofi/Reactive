import React from 'react'
import { Linking, Pressable, View } from 'react-native'
import { Feather } from '@expo/vector-icons';
export default function ByMeACoffe() {

    const handleCoffeClick = () => {
        try {

            Linking.openURL('https://www.buymeacoffee.com/alisinayousofi')
        }
        catch (error) {
            console.log("failed")
        }
    }
    return (
        <Pressable style={{backgroundColor: "#f5f5f5", padding: 6, borderRadius: 10}} onPress={() => handleCoffeClick()}>
            <Feather name="coffee" size={24} color="black" />
        </Pressable>
    )
}
