import React, { useEffect, useState } from 'react'
import { View, TextInput, StyleSheet, Pressable, Text, Image, ToastAndroid } from 'react-native'
import { EvilIcons, FontAwesome, Fontisto } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import money from '../assets/mony.png'
import CurrencyDropdownListSearch from '../components/global/CurrencyDropdownList';
import { validateUsername } from '../utils/validators/usernameValidator';
import { isEmailValid } from '../utils/validators/emailValidator';
import { phoneNumberValidator } from '../utils/validators/phoneNumberValidator';
import { amountOfMoneyValidator } from '../utils/validators/amountOfMoneyValidator';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { openDatabase, openDatabaseSync } from 'expo-sqlite'
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/useAppContext';


export default function EditCustomerParent({navigation, route}) {

    let {username: prev_username, email: prev_email, phone: prev_phone,  totalAmount: prev_amount_of_money, transaction_type: prev_payment_status, currency: prev_selected_currency} = route.params;
    prev_amount_of_money = String(prev_amount_of_money)

    const [updatedUsername, setUpdatedUsername] = useState();
    const [updatedEmail, setUpdatedEmail] = useState();
    const [updatedPhone, setUpdatedPhone] = useState();
    const [updatedAmountOfMoney, setUpdatedAmountOfMoney] = useState()
    const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState()
    const [updatedSelectedCurrency, setUpdatedSelectedCurrency] = useState()
    
    const navigator = useNavigation();
    const {setRefreshHomeScreenOnChangeDatabase} = useAppContext()
    const db = openDatabaseSync('green-red.db')

    useEffect( () => {
        setUpdatedUsername(prev_username)
        setUpdatedEmail(prev_email)
        setUpdatedPhone(prev_phone)
        setUpdatedAmountOfMoney(prev_amount_of_money)
        setUpdatedPaymentStatus(prev_payment_status)
        setUpdatedSelectedCurrency(prev_selected_currency)
    }, [])
    const handleUpdateCustomerParent = () => {
        
        if (!validateUsername(updatedUsername)) {
            return showToast('Username is invalid');
        }
    
        if (updatedEmail && !isEmailValid(updatedEmail)) {
            return showToast('Email is invalid');
        }
    
        if (updatedPhone && !phoneNumberValidator(updatedPhone)) {
            return showToast('Phone number is invalid');
        }
    
        if (updatedAmountOfMoney.length && !amountOfMoneyValidator(updatedAmountOfMoney)) {
            return showToast('Amount of money is  invalid');
        }
    
        if (!updatedPaymentStatus) {
            return showToast('Please select a payment status');
        }
    
        if (!updatedSelectedCurrency) {
            return showToast('Please select a currency');
        }
        
        updateParentCustomer()
        updateParentChildren()

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
    
    const updateParentCustomer = async () => {
        try {
            await db.runAsync(
                "UPDATE customers SET username = ?, email = ?, phone = ?, amount = ?, transaction_type = ?, currency = ? WHERE username = ?",
                [updatedUsername, updatedEmail, updatedPhone, updatedAmountOfMoney, updatedPaymentStatus, updatedSelectedCurrency, prev_username]
            );
            setRefreshHomeScreenOnChangeDatabase(prev => !prev);
        } catch (error) {
            showToast('Failed to update customer');
            console.error(error);
        }
    };

    const updateParentChildren = async () => {
        try {
            await db.runAsync(
                "UPDATE customer__records SET username = ? WHERE username = ?",
                [updatedUsername, prev_username]
            );
            showToast('Updated customer successfully', 'success');
            setTimeout(() => navigator.navigate("homescreen"), 2000);
            setRefreshHomeScreenOnChangeDatabase(prev => !prev);
        } catch (error) {
            showToast('Failed to update customer records');
            console.error(error);
        }
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
                        value={updatedUsername}
                        onChangeText={(text) => setUpdatedUsername(text)}
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
                        value={updatedEmail}
                        onChangeText={(text) => setUpdatedEmail(text)}
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
                        value={updatedPhone}
                        onChangeText={(text) => setUpdatedPhone(text)}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.input_container}>
                    
                    <Fontisto 
                        name="money-symbol" 
                        size={24} 
                        color="black"
                        style={styles.icon} 
                    />
                    
                    <TextInput
                        style={styles.input}
                        value={updatedAmountOfMoney}
                        onChangeText={(text) => setUpdatedAmountOfMoney(text)}
                        keyboardType="phone-pad"
                    />
                </View>
                
                <View style={styles.payment_status}>
                    
                    <View >
                        <Text style={styles.payment_text}> Money : </Text>
                    </View>
                    
                    <RadioButton.Group  onValueChange={newValue => setUpdatedPaymentStatus(newValue)} value={updatedPaymentStatus}>

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
                    <CurrencyDropdownListSearch setSelected={setUpdatedSelectedCurrency} selected={updatedSelectedCurrency}/>
                </View>

                <Pressable
                    style={styles.add_new_customer_btn}
                    onPress={handleUpdateCustomerParent}
                >
                    <Text style={{color: "white", textAlign: "center", fontWeight: 'bold'}}>Update</Text>
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
        borderRadius: 10,
        backgroundColor: "#FDFCFA"
    },
    add_new_customer_btn: {
        backgroundColor: 'black',
        color: "white",
        borderRadius: 999,
        height: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 10,
        width: '60%',
        textAlign: "center"
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
        borderRadius: 10,
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 5
    },
    payment_text: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4
    }
});
