import React from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { cancel_button_color, delete_button_color } from './colors'
import { Ionicons } from '@expo/vector-icons'
import * as SQLite from 'expo-sqlite'
import Toast from 'react-native-toast-message';
import { useAppContext } from '../../context/useAppContext'

export default function DeleteRecordModal({message, setCloseModal, username, record_id}) {

    const db = SQLite.openDatabaseSync('green-red.db')
    const { setRefreshHomeScreenOnChangeDatabase, setRefreshSingleViewChangeDatabase } = useAppContext()

    const handleDelete = () => {
        
        if (record_id) {
            console.log("deleting by record_id", record_id)
            deleteByRecoredId()
            setRefreshSingleViewChangeDatabase(prev => ! prev)
        }
        
        else {
            console.log("deleting by username", username)
            deleteByUsername()
            setRefreshHomeScreenOnChangeDatabase(prev => ! prev)
        }
    }

    const handleCancel = () => {
        setCloseModal(false)
    }

    const showToast = (message, type = 'error') => {
        
        Toast.show({
            type: type,
            text1: message,
            position: 'top',
            onPress: () => Toast.hide(),
            swipeable: true,
            topOffset: 100,
        });
    };

    const deleteByRecoredId = async () => {
        try {
            const query = 'DELETE FROM customer__records WHERE id = ?;';
            const result = await db.runAsync(query, [record_id]);
            
            if (result.changes) {
                
                showToast('Record deleted.', 'success');
            } else {
                showToast('No record found to delete', 'success');
            }
        } catch (error) {
            console.error("Failed to delete record", error.message);
            showToast("Failed to delete record");
        } finally {
            setCloseModal(false);
        }
    };

    const deleteByUsername = async () => {
        try {
            // Delete from customers table
            const deleteCustomerQuery = 'DELETE FROM customers WHERE username = ?;';
            await db.runAsync(deleteCustomerQuery, [username]);

            // Delete from customer__records table
            const deleteRecordsQuery = 'DELETE FROM customer__records WHERE username = ?;';
            const result = await db.runAsync(deleteRecordsQuery, [username]);

            setCloseModal(false);
            showToast('User and all associated records deleted.', 'success');
            setRefreshHomeScreenOnChangeDatabase(prev => !prev);
        } catch (error) {
            console.error("Failed to delete user", error.message);
            showToast("Failed to delete user");
        }
    };
    
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