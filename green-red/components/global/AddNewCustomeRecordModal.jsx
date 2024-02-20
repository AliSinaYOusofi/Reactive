import React, {useState} from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import CurrencyDropdownListSearch from './CurrencyDropdownList';
import Toast from 'react-native-toast-message';
import * as SQLite from 'expo-sqlite'
import { amountOfMoneyValidator } from '../../utils/validators/amountOfMoneyValidator';
export default function AddNewCustomeRecordModal({username, setAddNewRecordModal}) {

    const [amount, setAmount] = useState("")
    const [transactionType, setTransactionType] = useState("")
    const [currency, setCurrency] = useState("")

    const db = SQLite.openDatabase('green-red.db')

    const handleAddNewRecord = () => {
        
        if (!amountOfMoneyValidator(amount)) {
            return showToast('Amount of money is not valid');
        }
    
        if (!transactionType) {
            return showToast('Please select a payment status');
        }
    
        if (!currency) {
            return showToast('Please select a currency');
        }

        // creating the table
        try {

            const query = 'CREATE TABLE IF NOT EXISTS customer_records(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL , amount REAL NOT NULL, transaction_type TEXT NOT NULL, currency TEXT NOT NULL, transaction_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, transaction_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);'

            db.transaction(tx => {
                tx.executeSql(query, [], 
                    (tx, result) => {
                        if (result) insertToCustomerChild()
                    },
                    (_, error) => {
                        console.error("Error While creating table", error)
                        showToast("Error While creating table")
                    }
                )
            })
        } catch( e ) {
            console.error("error while adding new customer", e.message)
            Toast.show({
                type: 'error',
                text1: 'error while adding new customer',
            })
        }
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

    const insertToCustomerChild = () => {
        
        try {
            const query = 'INSERT INTO customer_records (username, amount, transaction_type, currency) VALUES (?, ?, ?, ?);'

            db.transaction(tx => {
                
                tx.executeSql(query, [username, amount, transactionType, currency], 
                    (tx, result) => {
                        showToast("User record added!", "success")
                        setAddNewRecordModal(false)
                    },
                    (_, e) => {
                        console.error("Error While inserting new record", e.message)
                        showToast("Error While inserting new record")
                    }
                )
            })
        } 
        
        catch( e ) {
            console.error("error while adding new customer", e.message)
            Toast.show({
                type: 'error',
                text1: 'error while adding new customer',
            })
        } finally {
            setAmount("")
            setTransactionType("")
            setCurrency("")
        }
    }

    return (
        <View style={styles.modalView}>

            <View style={styles.options_container}>

                <View style={styles.input_container}>

                    <TextInput
                        style={styles.input}
                        placeholder="amount"
                        onChangeText={(text) => setAmount(text)}
                        keyboardType='phone-pad'
                    />

                    <MaterialIcons 
                        name="usb" 
                        size={24} 
                        color="black"
                        style={styles.icon}
                    />
                </View>

                <View style={styles.payment_status}>
                        
                    <View >
                        <Text style={styles.payment_text}> Money : </Text>
                    </View>
                    
                    <RadioButton.Group  onValueChange={newValue => setTransactionType(newValue)} value={transactionType}>

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
                    <CurrencyDropdownListSearch setSelected={setCurrency} selected={currency}/>
                </View>

                <View>
                    <Pressable
                        style={styles.add_new_customer_btn}
                        onPress={handleAddNewRecord}
                        title='add new customer'
                    >
                        <Text style={{color: "white"}}>Add</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: "relative",
        
    },
    input: {
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        width: '80%',
        borderRadius: 5,
        backgroundColor: "#FDFCFA",
        width: "100%"
    },
    input_container: {
        flexDirection: 'row',
        alignContent: "center",
        alignItems: "center",
        position: 'relative',
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

    payment_status: {
        flexDirection: "row",
        backgroundColor: "#FDFCFA",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },

    payment_text: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4
    }
    ,
    
    options_container: {
        backgroundColor: "#282C35",
        padding: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        alignItems: 'flex-start',
        position: "relative",
    },
    add_new_customer_btn: {
        backgroundColor: 'black',
        color: "white",
        borderRadius: 20,
        height: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: "center",
        marginTop: 20,
        marginHorizontal: "auto",
    },
    drop_down_container: {
        marginTop: 20
     },
})