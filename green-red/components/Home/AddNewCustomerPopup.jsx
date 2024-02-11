import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'

function AddNewCustomerPopup() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const addNewCustomer = () => {

        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Phone:', phone);

    };

    return (
        <View style={styles.modalView}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                onChangeText={(text) => setPhone(text)}
                keyboardType="phone-pad"
            />
            <Button
                title="Submit"
                onPress={addNewCustomer}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        width: '80%',
        borderRadius: 5,
    },
});
export default AddNewCustomerPopup