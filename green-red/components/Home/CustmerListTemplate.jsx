import React, { useState } from 'react'
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeleteRecordModal from '../global/DeleteRecordModal';

export default function CustomerListTemplate({usernameShortCut, username, totalAmount, transaction_type, currency, at, border_color}) {
    
    const navigator = useNavigation();
    const [ deleteModal, setDeleteModal] = useState(false)

    const handleCustomerViewClick = () => {
        // navigating to other screen and fetching based on username
        navigator.navigate("CustomerData", {username})    
    }
    return (
        <>
            <View style={styles.container}>

                <Pressable onPress={handleCustomerViewClick} style={[styles.container, { borderLeftColor: border_color, borderLeftWidth: 2}]}>
                    
                    <View style={styles.username_and_shortcut_container}>
                        <View style={styles.usernameShortCutStyle}>
                            <Text >{usernameShortCut}</Text>
                        </View>
                        <View>
                            <Text> {username} </Text>
                        </View>
                    </View>


                    <View>
                        <Text>  {totalAmount} {currency} </Text>
                    </View>                
                </Pressable>
                
                <View style={styles._icons_container}>
                    <Pressable 
                        onPress={() => setDeleteModal(true)} 
                        style={styles.delete_icon}
                    >
                        <MaterialCommunityIcons 
                            name="delete-alert-outline" 
                            size={24} 
                            color="black" 
                        />
                    </Pressable>

                    <Pressable>
                        <MaterialCommunityIcons 
                            style={styles._icon} 
                            name="circle-edit-outline" 
                            size={24} 
                            color="black"
                        />
                    </Pressable>
                </View>
                
            </View>

            <Modal
                visible={deleteModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setDeleteModal(false)}
            >
                <DeleteRecordModal 
                    username={username}
                    setCloseModal={setDeleteModal}
                    message={`All data related to ${username} will be deleted !`}
                />
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        marginVertical: 5,
    },
    
    usernameShortCutStyle: {
        backgroundColor: "#F8F8FF", // the bg-color
        borderRadius: 50,
        padding: 8
    },
    
    hr: {

        borderBottomColor: 'gray',
        borderBottomWidth: 0.4,
        marginVertical: 10, // Adjust as needed for spacing
    },

    username_and_shortcut_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10
    },
    
    username: {

    },

    delete_icon: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
        color: "white"
    },
    
    _icons_container: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
    }
})