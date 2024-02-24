import React, { useState } from 'react'
import { Pressable, View, Text, StyleSheet, Modal } from 'react-native'
import ShowTransactionDetailsModal from './ShowTransactionDetailsModal'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeleteRecordModal from '../global/DeleteRecordModal';
import EditCustomerRecordModal from '../global/EditCustomerRecordModal';
import { format_username } from '../../utils/username_shortcut';
import { padi_color, received_color } from '../global/colors';

export default function UserListView({username, amount, currency, transaction_type, transaction_date, email, phone, record_id}) {

    const [detailsModal, setDetailsModal] = useState(false)
    const [ deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    
    return (
        <>

            <View style={[styles.container, { backgroundColor: transaction_type === 'received' ? received_color : padi_color}]}>
                <Pressable onPress={() => setDetailsModal(true)} style={[styles.container]}>
                    
                    <View style={styles.username_and_shortcut_container}>
                        <View style={styles.usernameShortCutStyle}>
                            <Text >{format_username(username)}</Text>
                        </View>
                        <View>
                            <Text> {username} </Text>
                        </View>
                    </View>

                    <View>
                        <Text>  {amount} {currency} </Text>
                    </View>                
                </Pressable>
                
                <View style={styles.icon_container}>
                    
                    <Pressable onPress={() => setDeleteModal(true)}>
                        <MaterialCommunityIcons 
                            style={styles._icon} 
                            name="delete-alert-outline" 
                            size={24} 
                            color="black" 
                        />
                    </Pressable>

                    <Pressable onPress={() => setEditModal(true)}>
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
                visible={detailsModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setDetailsModal(!detailsModal)}
            >
                <ShowTransactionDetailsModal 
                    username={username}
                    amount={amount}
                    currency={currency}
                    transaction_type={transaction_type}
                    transaction_date={transaction_date}
                    closeModal={setDetailsModal}
                />
            </Modal>

            <Modal
                visible={deleteModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setDeleteModal(false)}
            >
                <DeleteRecordModal 
                    username={username}
                    setCloseModal={setDeleteModal}
                    message={"Are you sure you want to delete this record?"}
                    record_id={record_id}
                />
            </Modal>
            
            <Modal
                visible={editModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setEditModal(false)}
            >
                <EditCustomerRecordModal 
                    username={username}
                    setUpdateRecordModal={setEditModal}
                    record_id={record_id}
                    amount={amount}
                    currency={currency}
                    transaction_type={transaction_type}
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
        padding: 4,
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
    _icon: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
        backgroundColor: "white", // the bg-color
        borderRadius: 50,
        padding: 8
        
    },

    icon_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
    }
})