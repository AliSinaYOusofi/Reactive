import React from 'react'
import { Linking, Pressable, View } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
export default function ByMeACoffe() {

    const handleCoffeClick = () => {
        try {
            //TODO open playstore when clicked to that i can get a rating
            Linking.openURL('https://www.buymeacoffee.com/alisinayousofi')
        }
        catch (error) {
            console.log("failed")
        }
    }
    return (
        <Pressable style={{backgroundColor: "#f5f5f5", padding: 6, borderRadius: 10}} onPress={() => handleCoffeClick()}>
            <EvilIcons name="star" size={24} color="black" />
        </Pressable>
    )
}
