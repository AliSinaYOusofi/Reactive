import React, { useState } from 'react'
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeleteRecordModal from '../global/DeleteRecordModal';
import { format_username } from '../../utils/username_shortcut';
import { padi_color, received_color } from '../global/colors';

export default function CustomerListTemplate({usernameShortCut, username, totalAmount, transaction_type, currency, at, border_color, phone, email, isSearchComponent, searchResultLength}) {
    
    const navigator = useNavigation();
    const [ deleteModal, setDeleteModal] = useState(false)

    const handleCustomerViewClick = () => {
        // navigating to other screen and fetching based on username
        navigator.navigate("CustomerData", {username})    
    }
    return (
        <>
            {
                isSearchComponent
                ?
                <Text style={styles.search_header}>
                    Search Results: {searchResultLength}
                </Text>
                : null
            }
            <View style={[styles.container, { backgroundColor: transaction_type === 'received' ? received_color : padi_color}]}>

                <Pressable onPress={handleCustomerViewClick} style={[styles.container]}>
                    
                    <View style={styles.username_and_shortcut_container}>
                        <View style={styles.usernameShortCutStyle}>
                            <Text >{format_username(username)}</Text>
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

                    <Pressable onPress={() => navigator.navigate("EditCustomer", {username, totalAmount, currency, transaction_type, email, phone})}>
                        <MaterialCommunityIcons 
                            style={styles.pdf_icon} 
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
        padding: 5,
        marginVertical: 5,
        borderRadius: 10
    },
    
    usernameShortCutStyle: {
        backgroundColor: "white", // the bg-color
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
        color: "white",
        borderRadius: 50,
        padding: 8
    },
    
    _icons_container: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
    },

    search_header: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 10,
    },

    pdf_icon: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "white", // the bg-color
        borderRadius: 50,
        padding: 8
    }
})