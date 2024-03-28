import React, {useEffect, useState} from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import CurrencyDropdownListSearch from './CurrencyDropdownList';
import Toast from 'react-native-toast-message';
import * as SQLite from 'expo-sqlite'
import { amountOfMoneyValidator } from '../../utils/validators/amountOfMoneyValidator';
import { format } from 'date-fns';
import { useAppContext } from '../../context/useAppContext';
import { background_color } from './colors';

export default function EditCustomerRecordModal({amount, currency, transaction_type, record_id, setUpdateRecordModal}) {

    const [newAmount, setNewAmount] = useState("")
    const [newTransactionType, setNewTransactionType] = useState("")
    const [newCurrency, setNewCurrency] = useState("")

    const db = SQLite.openDatabase('green-red.db')
    const { setRefreshSingleViewChangeDatabase, setRefreshHomeScreenOnChangeDatabase } = useAppContext()

    const handleAddNewRecord = () => {
        
        if (!amountOfMoneyValidator(newAmount)) {
            return showToast('Amount of money is not valid');
        }
    
        if (!newTransactionType) {
            return showToast('Please select a payment status');
        }
    
        if (!newCurrency) {
            return showToast('Please select a currency');
        }

        // updating the customer record
        insertToCustomerChild()

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
            
            const query = 'UPDATE customer__records SET amount = ?, transaction_type = ?, currency = ?, transaction_updated_at = ? WHERE id = ?'
            const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            
            db.transaction(tx => {
                
                tx.executeSql(query, [newAmount, newTransactionType, newCurrency, currentDateTime, record_id], 
                    (tx, result) => {
                        showToast("User record updated!", "success")
                        setUpdateRecordModal(false)
                        setRefreshSingleViewChangeDatabase(prev => ! prev)
                        setRefreshHomeScreenOnChangeDatabase(prev => ! prev)
                    },
                    (_, e) => {
                        console.error("Error While inserting new record", e.message)
                        showToast("Failed to update record")
                    }
                )
            })
        } 
        
        catch( e ) {
            console.error("error while adding new customer", e.message)
            showToast("Failed to update record")
        } 
        
        finally {
            setNewAmount("")
            setNewTransactionType("")
            setNewCurrency("")
        }
    }

    useEffect( () => {
        setNewCurrency(currency)
        setNewAmount(amount)
        setNewTransactionType(transaction_type)
    }, [])

    return (
        <View style={styles.modalView}>

            <View style={styles.options_container}>

                <View style={styles.input_container}>

                    <TextInput
                        style={styles.input}
                        placeholder={String(amount)}
                        onChangeText={(text) => setNewAmount(text)}
                        keyboardType='phone-pad'
                    />

                    <FontAwesome 
                        name="money" 
                        size={24} 
                        color="black" 
                        style={styles.icon}
                    />
                </View>

                <View style={styles.payment_status}>
                        
                    <View >
                        <Text style={styles.payment_text}> Money : </Text>
                    </View>
                    
                    <RadioButton.Group  onValueChange={newValue => setNewTransactionType(newValue)} value={newTransactionType}>

                        <View style={styles.payment_status}>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton color="green" value="received" />
                                <Text>Received</Text>
                            </View>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                <RadioButton value="paid" color="red"/>
                                <Text>Paid</Text>
                            </View>
                        </View>
                    </RadioButton.Group>
                </View>

                <View style={styles.drop_down_container}>
                    <CurrencyDropdownListSearch setSelected={setNewCurrency} selected={newCurrency}/>
                </View>

                <View>
                    <Pressable
                        style={styles.add_new_customer_btn}
                        onPress={handleAddNewRecord}
                        title='add new customer'
                    >
                        <Text style={{color: "white"}}>Update record</Text>
                    </Pressable>
                </View>
                <Pressable 
                    onPress={() => setUpdateRecordModal(false)} 
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
        borderRadius: 10,
        backgroundColor: "#FDFCFA",
        width: "100%",
    },
    input_container: {
        flexDirection: 'row',
        alignContent: "center",
        alignItems: "center",
        position: 'relative',
        marginTop: 10
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
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 5
    },

    payment_text: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4
    }
    ,
    
    options_container: {
        backgroundColor: background_color,
        padding: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        position: "relative",
    },
    add_new_customer_btn: {
        backgroundColor: 'green',
        color: "white",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        textAlign: 'center',
        alignSelf: 'center'
    },
    drop_down_container: {
        marginTop: 20,
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
