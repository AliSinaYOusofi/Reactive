import React, {useEffect, useState} from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import CurrencyDropdownListSearch from './CurrencyDropdownList';
import Toast from 'react-native-toast-message';
import { openDatabaseSync } from 'expo-sqlite'
import { amountOfMoneyValidator } from '../../utils/validators/amountOfMoneyValidator';
import { format } from 'date-fns';
import { useAppContext } from '../../context/useAppContext';
import { background_color } from './colors';
// import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : process.env.EXPO_PUBLIC_ADMOB_INTERSTIAL;
export default function AddNewCustomeRecordModal({username, setAddNewRecordModal}) {

    const [amount, setAmount] = useState("")
    const [transactionType, setTransactionType] = useState("")
    const [currency, setCurrency] = useState("")

    const db = openDatabaseSync('green-red.db')
    const { setRefreshSingleViewChangeDatabase, setRefreshHomeScreenOnChangeDatabase } = useAppContext()

    // const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitId);

    // useEffect(() => {
    //     load();
    // }, [load]);
    
    // useEffect(() => {
    //     if (isClosed) {
    //       navigator.navigate('homescreen');
    //     }
    // }, [isClosed, navigator]);

    // create customer__records table if not exists
    

    // handle add new record
    const handleAddNewRecord = async () => {
        
        if (!amountOfMoneyValidator(amount)) {
            return showToast('Amount of money is not valid');
        }
    
        if (!transactionType) {
            return showToast('Please select a payment status');
        }
    
        if (!currency) {
            return showToast('Please select a currency');
        }

        try {
            await insertToCustomerChild();
        } catch (error) {
            console.error("Error while adding new record:", error.message);
            showToast("Error while adding new record");
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

    const insertToCustomerChild = async () => {
        try {
            const query = `
                INSERT INTO customer__records (
                    username, amount, transaction_type, currency, transaction_at, transaction_updated_at
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;
            const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const args = [username, amount, transactionType, currency, currentDateTime, currentDateTime];

            await db.runAsync(query, args);

            showToast("User record added!", "success");
            setAddNewRecordModal(false);
            setRefreshSingleViewChangeDatabase(prev => !prev);
            setRefreshHomeScreenOnChangeDatabase(prev => !prev);
        } catch (error) {
            console.error("Error while inserting new record:", error.message);
            showToast("Error while inserting new record");
        } finally {
            setAmount("");
            setTransactionType("");
            setCurrency("");
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
                        <Text style={{color: "white"}}>Save new record</Text>
                    </Pressable>
                </View>

                <Pressable 
                    onPress={() => setAddNewRecordModal(false)} 
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
        backgroundColor: "white"
    },
    input: {
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: "#FDFCFA",
        width: "100%"
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
        borderRadius: 5,
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
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: "90%",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        right: 10,
        
    },
})
