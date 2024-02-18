import React from 'react'
import { View, StyleSheet, Text, Button, Pressable } from 'react-native'
import { cancel_button_color, delete_button_color } from './colors'
import { Ionicons } from '@expo/vector-icons'

export default function DeleteRecordModal({message, setCloseModal, username}) {

    const handleDelete = () => {

    }

    const handleCancel = () => {
        setCloseModal(false)
    }
    
    return (
        <View style={styles.modalContainer}>
           <View style={styles.options_container}>

                <Text style={styles.texts}>{message}</Text>
                
                <View style={styles.button_container}>
                    
                    <Pressable 
                        onPress={handleDelete}
                        style={styles.delete_button}
                    >
                        <Text style={styles.texts}> Delete </Text>
                    </Pressable>
                    
                    <Pressable 
                        onPress={handleCancel}
                        style={styles.cancel_button}
                    >
                        <Text style={styles.texts}> Cancel </Text>
                    </Pressable>
                </View>
                
                <Pressable 
                    onPress={() => setCloseModal(false)} 
                    style={[styles.pressable, styles.pressable_close]}
                >
                    <Ionicons 
                        name="close-outline" 
                        size={20} 
                        color="black" 
                    />
                </Pressable>
           </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: "relative",
    },

    options_container: {
        backgroundColor: "#0f0f0f",
        padding: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        alignItems: 'flex-start',
        color: "white",
        position: "relative",
    },

    button_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        columnGap: 10
    },

    texts: {
        color: 'white'
    },

    delete_button: {
        backgroundColor: delete_button_color,
        borderRadius: 50,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },

    cancel_button: {
        backgroundColor: cancel_button_color,
        borderRadius: 50,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    
    pressable: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
        color: "black",
        top: 10,
        right: 10
    },
})