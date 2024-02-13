import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Pressable, Text, Image } from 'react-native'
import { EvilIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import money from '../../assets/mony.png'
import { Fontisto } from '@expo/vector-icons';
import CurrencyDropdownListSearch from '../global/CurrencyDropdownList';
function AddNewCustomerPopup({closePopCallBack}) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const addNewCustomer = () => {

        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Phone:', phone);
        closePopCallBack(false)
    };

    return (
        <>
            <View style={styles.modalView}>
                <Image 
                    source={money} 
                    style={styles.image_container}
                    resizeMode="contain"  
                />

                <View style={styles.input_container}>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={(text) => setUsername(text)}
                    />

                    <EvilIcons 
                        name="user" 
                        size={30} 
                        color="black"
                        style={styles.icon} 
                    />
                </View>

                <View style={styles.input_container}>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                    />
                    <EvilIcons 
                        name="envelope" 
                        size={30} 
                        color="black"
                        style={styles.icon} 
                    />
                </View>

                <View style={styles.input_container}>
                    
                    <SimpleLineIcons 
                        name="phone" 
                        size={24} 
                        color="black"
                        style={styles.icon}  
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        onChangeText={(text) => setPhone(text)}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.input_container}>
                    
                    <Fontisto 
                        name="dollar" 
                        size={24} 
                        color="blue"
                        style={styles.icon}  
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        onChangeText={(text) => setPhone(text)}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.drop_down_container}>
                    <CurrencyDropdownListSearch setSelected={setSelectedCurrency} selected={selectedCurrency}/>
                </View>
                
                <Pressable
                    style={styles.add_new_customer_btn}
                    onPress={addNewCustomer}
                    title='add new customer'
                >
                    <Text style={{color: "white"}}>Add Customer</Text>
                </Pressable>
            </View>
        </>
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

        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        width: '80%',
        borderRadius: 5,
        backgroundColor: "#FDFCFA"
    },
    add_new_customer_btn: {
        backgroundColor: 'black',
        color: "white",
        borderRadius: 20,
        height: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 10
    },

    input_container: {
        flexDirection: 'row',
        alignContent: "center",
        alignItems: "center",
    },

    icon: {
        position: 'absolute',
        right: 10,
        top: '10%',
        color: "black",
        zIndex: 1,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
    },

    image_container: {
        position: 'absolute',
    },

    drop_down_container: {
       width: "80%",
    }
});
export default AddNewCustomerPopup