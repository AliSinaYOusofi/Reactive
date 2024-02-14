import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Pressable, Text, Image } from 'react-native'
import { EvilIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import money from '../../assets/mony.png'
import { Fontisto } from '@expo/vector-icons';
import CurrencyDropdownListSearch from '../global/CurrencyDropdownList';
import { validateUsername } from '../../utils/validators/usernameValidator';
import { isEmailValid } from '../../utils/validators/emailValidator';
import { phoneNumberValidator } from '../../utils/validators/phoneNumberValidator';
import { amountOfMoneyValidator } from '../../utils/validators/amountOfMoneyValidator';
import { RadioButton } from 'react-native-paper';

function AddNewCustomerPopup({closePopCallBack}) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [amountOfMoney, setAmountOfMoney] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('')
    
    const addNewCustomer = () => {

        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Phone:', phone);

        if ( ! validateUsername(username) ) {
            alert('Username is not valid')
            return
        }

        else if ( ! isEmailValid(email)) {
            alert('Email is not valid')
            return
        }

        else if (! phoneNumberValidator(phone)) {
            return alert('Phone number is not valid')
        }
        
        else if (amountOfMoneyValidator(amountOfMoney)) {
            return alert('Amount of money is not valid')
        }
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
                        onChangeText={(text) => setAmountOfMoney(text)}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.drop_down_container}>
                    <CurrencyDropdownListSearch setSelected={setSelectedCurrency} selected={selectedCurrency}/>
                </View>

                <View>
                    
                    <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                    
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <RadioButton value="received" />
                            <Text>Received</Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <RadioButton value="paid" />
                            <Text>Paid</Text>
                        </View>
                    </RadioButton.Group>
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
        paddingVertical: 10,
        marginTop: 10,
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