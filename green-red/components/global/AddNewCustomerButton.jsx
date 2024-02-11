import React, { useState } from 'react'
import { Text, Button, View, StyleSheet, Modal, Pressable } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import AddNewCustomerPopup from '../Home/AddNewCustomerPopup'
export default function AddNewCustomer() {
    const [isModal, setIsModal] = useState(false)
    return (
        <View>
            <Pressable
                style={style.add_new_customer_btn}
                onPress={() => setIsModal(true)}
                title='add new customer'
            >
                <Text>Add New Customer</Text>
            </Pressable>
            
            <Modal
                visible={isModal}
                animationType={'slide'}
                onRequestClose={() => setIsModal(false)}
            >
                <AddNewCustomerPopup />
            </Modal>
        </View>
    )
}


const style = StyleSheet.create({
    add_new_customer_btn: {
        backgroundColor: 'black',
        color: "white",
        borderRadius: 20,
        height: 'auto'
    }
})