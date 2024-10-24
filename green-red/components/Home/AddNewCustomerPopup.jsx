import React, { useEffect, useState } from 'react'
import { View, TextInput, StyleSheet, Pressable, Text, Image, ToastAndroid, KeyboardAvoidingView, Platform } from 'react-native'
import { EvilIcons, FontAwesome, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import money from '../../assets/mony.png'
import CurrencyDropdownListSearch from '../global/CurrencyDropdownList';
import { validateUsername } from '../../utils/validators/usernameValidator';
import { isEmailValid } from '../../utils/validators/emailValidator';
import { phoneNumberValidator } from '../../utils/validators/phoneNumberValidator';
import { amountOfMoneyValidator } from '../../utils/validators/amountOfMoneyValidator';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as SQLite from 'expo-sqlite'
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context/useAppContext';
import { format } from 'date-fns';
// import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : process.env.EXPO_PUBLIC_ADMOB_INTERSTIAL;
function AddNewCustomerPopup({}) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [amountOfMoney, setAmountOfMoney] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const [isAddLoaded, setIsAddLoaded] = useState(false)
    const { setRefreshHomeScreenOnChangeDatabase } = useAppContext()
    const navigator = useNavigation()
    const db = SQLite.openDatabaseSync('green-red.db')
    // const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitId);

    // useEffect(() => {
    //     load();
    // }, [load]);
    
    // useEffect(() => {
    //     if (isClosed) {
    //       navigator.navigate('homescreen');
    //     }
    // }, [isClosed, navigator]);
    
    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS customers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        username TEXT NOT NULL, 
                        email TEXT, 
                        phone TEXT, 
                        amount REAL NOT NULL, 
                        transaction_type TEXT NOT NULL, 
                        currency TEXT NOT NULL, 
                        at DATETIME NOT NULL
                    );
                `);
                console.log('Table created successfully');
            } catch (error) {
                alert(error.message);
                showToast(error.message);
                console.error('Error creating table: ', error);
            }
        };
    
        initializeDatabase();
    }, []);

    const addNewCustomer = async () => {
        if (!validateUsername(username)) {
            return showToast('Username is invalid');
        }
    
        if (email && !isEmailValid(email)) {
            return showToast('Email is invalid');
        }
    
        if (phone && !phoneNumberValidator(phone)) {
            return showToast('Phone number is invalid');
        }
    
        if (amountOfMoney.length && !amountOfMoneyValidator(amountOfMoney)) {
            setAmountOfMoney(0)
            return showToast('Amount of money is  invalid');
        }
    
        if (!paymentStatus) {
            return showToast('Please select a payment status');
        }
    
        if (!selectedCurrency) {
            return showToast('Please select a currency');
        }

        

        // db.transaction(tx => {
            
        //     tx.executeSql(
        //         'DROP TABLE IF EXISTS customers;',
        //         [],
        //         () => console.log('Table created successfully'),
        //         (_, error) => console.error('Error creating table: ', error)
        //     );
        // });

        
    
        try {
            // check if username already exists
            console.log(username, " username")
            const result = await db.execAsync(
                "SELECT * FROM customers WHERE username = ?",
                [username]
            );
            console.log(result, " result")
            if (result) {
                showToast('Username already exists');
            } else {
                await insertCustomer();
            }
        } catch (error) {
            console.error("Error while checking if username exists", error.message);
            showToast('Failed to add new customer');
        }
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

    const insertCustomer = async () => {
        const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        // Validate required fields
        if (!username || !amountOfMoney || !paymentStatus || !selectedCurrency) {
            showToast('Please fill in all required fields');
            return;
        }

        const statement = await db.prepareAsync(`
            INSERT INTO customers (username, email, phone, amount, transaction_type, currency, at) 
            VALUES ($username, $email, $phone, $amount, $transactionType, $currency, $at)
        `);

        try {
            const result = await statement.executeAsync({
                $username: username,
                $email: email || null,
                $phone: phone || null,
                $amount: parseFloat(amountOfMoney),
                $transactionType: paymentStatus,
                $currency: selectedCurrency,
                $at: currentDateTime
            });

            console.log('Inserted customer:', result.lastInsertRowId, result.changes);

            showToast('Customer added successfully', 'success');
            setRefreshHomeScreenOnChangeDatabase(prev => !prev);

            // Reset form fields
            setUsername('');
            setEmail('');
            setPhone('');
            setAmountOfMoney('');
            setPaymentStatus('');
            setSelectedCurrency('');

        } catch (error) {
            showToast('Failed to add customer: ' + error.message);
            console.error("Error while adding new user", error);
        } finally {
            await statement.finalizeAsync();
        }
    };

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
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
                        name="money-symbol" 
                        size={24} 
                        color="black"
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
                    <Text style={{color: "white", textAlign: "center"}}>Add Customer</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
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
        
        marginTop: 10,
        width: "50%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#14171A",
        borderRadius: 9999,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: "70%",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
export default AddNewCustomerPopup
