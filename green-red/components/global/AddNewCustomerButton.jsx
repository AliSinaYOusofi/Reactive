import React, { useState } from 'react'
import { Text, Button, View, StyleSheet, Modal, Pressable, } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import AddNewCustomerPopup from '../Home/AddNewCustomerPopup'
export default function AddNewCustomer() {
    const [isModal, setIsModal] = useState(false)
    return (
        <View>

            <View>
                <Pressable
                    style={style.add_new_customer_btn}
                    onPress={() => setIsModal(true)}
                    title='add new customer'
                >
                    <Text style={{color: "white"}}>Add New Customer</Text>
                </Pressable>
            </View>
            
            <Modal
                visible={isModal}
                animationType={'slide'}
                onRequestClose={() => setIsModal(false)}
                style={style.popup_container}
                transparent={false}
            >
                <AddNewCustomerPopup closePopCallBack={setIsModal}/>
            </Modal>
        </View>
    )
}


const style = StyleSheet.create({
    add_new_customer_btn: {
        backgroundColor: 'black',
        color: "white",
        borderRadius: 20,
        height: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        width: "70%",
        alignSelf: "center",
        position: "absolute",
        bottom: 10,
    },

    popup_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})