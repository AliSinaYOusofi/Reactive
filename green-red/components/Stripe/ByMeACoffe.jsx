import React from 'react'
import { Linking, Pressable, View } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function ByMeACoffe() {
    const navigator = useNavigation()

    const handleCoffeClick = () => {
        navigator.navigate("about")
    }
    return (
        <Pressable style={{ padding: 6, borderRadius: 10}} onPress={() => handleCoffeClick()}>
            <EvilIcons name="exclamation" size={34} color="black" />
        </Pressable>
    )
}
