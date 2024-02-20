import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Pressable, Text, Image, ToastAndroid } from 'react-native'
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
import Toast from 'react-native-toast-message';
import * as SQLite from 'expo-sqlite'
function AddNewCustomerPopup({}) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [amountOfMoney, setAmountOfMoney] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('')
    
    const db = SQLite.openDatabase('green-red.db')

    const addNewCustomer = () => {
        if (!validateUsername(username)) {
            return showToast('Username is not valid');
        }
    
        if (email && !isEmailValid(email)) {
            return showToast('Email is not valid');
        }
    
        if (phone && !phoneNumberValidator(phone)) {
            return showToast('Phone number is not valid');
        }
    
        if (amountOfMoney.length && !amountOfMoneyValidator(amountOfMoney)) {
            return showToast('Amount of money is not valid');
        }
    
        if (!paymentStatus) {
            return showToast('Please select payment status');
        }
    
        if (!selectedCurrency) {
            return showToast('Please select currency');
        }
    
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM customers WHERE username = ?",
                [username],
                (_, result) => {
                    if (result.rows._array.length) {
                        showToast('Username already exists');
                    } else {
                        insertCustomer();
                    }
                }
            );
        });
    
        // Function to insert customer into the database
        const insertCustomer = () => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        "INSERT INTO customers (username, email, phone, amount, transaction_type, currency) VALUES (?, ?, ?, ?, ?, ?)",
                        [username, email, phone, amountOfMoney, paymentStatus, selectedCurrency],
                        (_, success) => {
                            showToast('Customer added successfully', 'success');
                            console.log('what the fuck')
                        },
                        (_, error) => {
                            showToast('Failed to add customer');
                        }
                    );
                },
                null,
                null
            );
        };
    
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
                        placeholder="Email (optional)"
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
                        placeholder="Phone (optional)"
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
                
                <View style={styles.payment_status}>
                    
                    <View >
                        <Text style={styles.payment_text}> Money : </Text>
                    </View>
                    
                    <RadioButton.Group  onValueChange={newValue => setPaymentStatus(newValue)} value={paymentStatus}>

                        <View style={styles.payment_status}>

                            
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton color="green" value="received" />
                                <Text>Received</Text>
                            </View>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton value="paid" color="red"/>
                                <Text>Paid</Text>
                            </View>
                        </View>
                    </RadioButton.Group>
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
       marginTop: 20
    },

    payment_status: {
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#FDFCFA",
        borderRadius: 5,
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    payment_text: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4
    }
});
export default AddNewCustomerPopup