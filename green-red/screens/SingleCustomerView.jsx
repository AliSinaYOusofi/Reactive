import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import * as SQLite from 'expo-sqlite'
import UserListView from '../components/SingleCustomerViewComp/UserListView'
import Toast from 'react-native-toast-message'
import AddNewCustomeRecordModal from '../components/global/AddNewCustomeRecordModal'
import { useAppContext } from '../context/useAppContext'
import { useSharedValue } from 'react-native-reanimated'
import TotalExpenses from '../components/Home/TotalExpenses'
import NoCustomerRecordFound from '../components/global/NoCustomerRecordFound'

export default function SingleCustomerView({navigation, route}) {
    
    const [customers, setCustomers] = useState([])
    const isFocused = useIsFocused()
    const username = route.params.username;
    const [addNewRecordModal, setAddNewRecordModal] = useState(false)
    const { refreshSingelViewChangeDatabase } = useAppContext()
    const [singleCustomerExpense, setSingleCustomerExpense ] = useState([])

    const db = SQLite.openDatabase('green-red.db')
    
    useEffect ( () => {
        const fetchAllCustomerExpense = async () => {

            let total_expense_data_of_customers = [];
            let totalAmountsByCurrency = {};
            let distinctCurrencies

            await db.transactionAsync( async tx => {
                
                distinctCurrencies = await tx.executeSqlAsync("SELECT DISTINCT currency FROM customer__records WHERE username = ?", [username]);
                distinctCurrencies = distinctCurrencies.rows.map(row => row.currency);
                
                await Promise.all( distinctCurrencies.map( async currency => {

                    const totalAmountBasedOnCurrencyToGive = await tx.executeSqlAsync("SELECT SUM(amount) FROM customer__records WHERE transaction_type = 'received' AND currency = ? AND username = ?", [currency, username]);
                    const totalAmountBasedOnCurrencyToTake = await tx.executeSqlAsync("SELECT SUM(amount) FROM customer__records WHERE transaction_type = 'paid' AND currency = ? AND username = ?", [currency, username]);

                    let plainTotalAmountToGive, plainTotalAmountToTake;
    
                    if (totalAmountBasedOnCurrencyToGive.rows.length === 0 || totalAmountBasedOnCurrencyToGive.rows[0]['SUM(amount)'] === null) {
                        plainTotalAmountToGive = 0;
                    } else {
                        plainTotalAmountToGive = parseFloat(totalAmountBasedOnCurrencyToGive.rows[0]['SUM(amount)']);
                    }
    
                    if (totalAmountBasedOnCurrencyToTake.rows.length === 0 || totalAmountBasedOnCurrencyToTake.rows[0]['SUM(amount)'] === null) {
                        plainTotalAmountToTake = 0;
                    } else {
                        plainTotalAmountToTake = parseFloat(totalAmountBasedOnCurrencyToTake.rows[0]['SUM(amount)']);
                    }

                    totalAmountsByCurrency[currency] = {
                        totalAmountBasedOnCurrencyToGive: plainTotalAmountToGive,
                        totalAmountBasedOnCurrencyToTake: plainTotalAmountToTake
                    };
                }))

            })

            total_expense_data_of_customers = Object.keys(totalAmountsByCurrency).map(currency => ({
                currency,
                totalAmountBasedOnCurrencyToGive: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToGive,
                totalAmountBasedOnCurrencyToTake: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToTake
            }));

            setSingleCustomerExpense(total_expense_data_of_customers)
        }
        fetchAllCustomerExpense()
    }, [])

    useEffect( () => {
        
        const loadCustomerDataList = async () => {
            
            try {
                await db.transactionAsync(async tx => {
                    const result = await tx.executeSqlAsync("SELECT * FROM customer__records WHERE username = ?", [username]);
                    
                    setCustomers(result.rows.sort( (a, b) => new Date(b.transaction_at) - new Date(a.transaction_at)));
                });
            } 
            
            catch (e) {
                console.error("error while fetching users", e.message);
                // showToast("error while fetching users")
            }
        };

        loadCustomerDataList();
    },  [refreshSingelViewChangeDatabase])
    
    const handleAddNewCustomer = () => {
        // a table should be created since username is unique
        //  that should be the relation between this user and his customer list
        
        setAddNewRecordModal(true)
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

    const scrollX = useSharedValue(0)

    const handleScroll = (event) => {
        
        scrollX.value = event.nativeEvent.contentOffset.x
    }

    return (
        <>

            <View style={{flex: 0}}>

                <ScrollView 
                    pagingEnabled 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled
                    scrollEventThrottle={16}
                    style={styles.wrapper}
                    onScroll={handleScroll}
                >

                    {
                        singleCustomerExpense.length
                        ?
                        singleCustomerExpense.map( expenses => {
                            return (
                                <View key={expenses.currency} style={styles.slide}>
                                    <TotalExpenses 
                                        totalAmountToGive={expenses.totalAmountBasedOnCurrencyToGive}
                                        totalAmountToTake={expenses.totalAmountBasedOnCurrencyToTake}
                                        currency={expenses.currency}
                                    />
                                </View>
                            )
                        })
                        : <NoCustomerRecordFound />
                    }
                </ScrollView>
            </View>

            <ScrollView style={styles.container}>
                {
                    customers.length > 0 
                    ?
                        customers.map((customer, index) => 
                            <UserListView
                                username={customer.username}
                                amount={customer.amount}
                                key={index}
                                transaction_date={customer.transaction_at}
                                currency={customer.currency}
                                transaction_type={customer.transaction_type}
                                record_id={customer.id}
                            />
                        )
                    : 
                        null
                }
            </ScrollView>

            <View style={styles.add_new_customer_container}>
                <Pressable
                    style={styles.add_new_customer_btn}
                    onPress={handleAddNewCustomer}
                    title='add new customer'
                >
                    <Text style={{color: "white"}}>Add new record</Text>
                </Pressable>
            </View>

            <Modal
                visible={addNewRecordModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setAddNewRecordModal(false)}
            >
                <AddNewCustomeRecordModal
                    username={username}
                    setAddNewRecordModal={setAddNewRecordModal}
                />
            </Modal>
        </>
    )
}


const styles = StyleSheet.create( {
    // TODO background should be full
    container: {
        backgroundColor: '#fff',
        height: "100%",
    },
    
    add_new_customer_btn: {
        backgroundColor: 'black',
        color: "white",
        borderRadius: 8,
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

    wrapper: {
        height: "auto",
        backgroundColor: "white",
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: "auto",
        
    },

})