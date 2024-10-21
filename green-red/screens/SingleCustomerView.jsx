import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Dimensions } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { openDatabase, openDatabaseSync } from 'expo-sqlite'
import UserListView from '../components/SingleCustomerViewComp/UserListView'
import Toast from 'react-native-toast-message'
import AddNewCustomeRecordModal from '../components/global/AddNewCustomeRecordModal'
import { useAppContext } from '../context/useAppContext'
import { useSharedValue } from 'react-native-reanimated'
import TotalExpenses from '../components/Home/TotalExpenses'
import NoCustomerRecordFound from '../components/global/NoCustomerRecordFound'
import Carousel from 'react-native-reanimated-carousel'
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
// const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.EXPO_PUBLIC_ADMOB_BANNER;
export default function SingleCustomerView({navigation, route}) {
    
    const [customers, setCustomers] = useState([])
    const isFocused = useIsFocused()
    const username = route.params.username;
    const [addNewRecordModal, setAddNewRecordModal] = useState(false)
    const { refreshSingelViewChangeDatabase } = useAppContext()
    const [singleCustomerExpense, setSingleCustomerExpense ] = useState([])

    const db = openDatabaseSync('green-red.db')
    
    useEffect ( () => {
        const fetchAllCustomerExpense = async () => {
            let totalAmountsByCurrency = {};

            try {
                const distinctCurrenciesQuery = "SELECT DISTINCT currency FROM customer__records WHERE username = ?";
                const distinctCurrencies = await db.getAllAsync(distinctCurrenciesQuery, [username]);

                await Promise.all(distinctCurrencies.map(async ({ currency }) => {
                    const toGiveQuery = "SELECT SUM(amount) as total FROM customer__records WHERE transaction_type = 'received' AND currency = ? AND username = ?";
                    const toTakeQuery = "SELECT SUM(amount) as total FROM customer__records WHERE transaction_type = 'paid' AND currency = ? AND username = ?";

                    const [toGiveResult, toTakeResult] = await Promise.all([
                        db.getFirstAsync(toGiveQuery, [currency, username]),
                        db.getFirstAsync(toTakeQuery, [currency, username])
                    ]);

                    totalAmountsByCurrency[currency] = {
                        totalAmountBasedOnCurrencyToGive: parseFloat(toGiveResult?.total || 0),
                        totalAmountBasedOnCurrencyToTake: parseFloat(toTakeResult?.total || 0)
                    };
                }));

                const total_expense_data_of_customers = Object.keys(totalAmountsByCurrency).map(currency => ({
                    currency,
                    totalAmountBasedOnCurrencyToGive: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToGive,
                    totalAmountBasedOnCurrencyToTake: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToTake
                }));

                setSingleCustomerExpense(total_expense_data_of_customers);
            } catch (error) {
                console.error("Error fetching customer expenses:", error.message);
                // Consider implementing proper error handling here
            }
        };

        fetchAllCustomerExpense();
    }, [username]); // Added username to dependency array

    useEffect(() => {
        const loadCustomerDataList = async () => {
            try {
                const query = "SELECT * FROM customer__records WHERE username = ?";
                const result = await db.getAllAsync(query, [username]);
                
                setCustomers(result.sort((a, b) => new Date(b.transaction_at) - new Date(a.transaction_at)));
            } catch (e) {
                console.error("Error while fetching customer records:", e.message);
                // Consider implementing a proper error handling mechanism here
                // showToast("Error while fetching customer records");
            }
        };

        loadCustomerDataList();
    }, [refreshSingelViewChangeDatabase, username]);
    
    const handleAddNewCustomer = () => {
        // a table should be created since username is unique
        //  that should be the relation between this user and his customer list
        
        setAddNewRecordModal(true)
    }

    const width = Dimensions.get('window').width;

    return (
        <>

            <View style={{flex: 1, backgroundColor: "white", marginBottom: -150}}>

                {
                    singleCustomerExpense.length ?
                    <Carousel
                        loop
                        width={width}
                        height={width / 2}
                        data={singleCustomerExpense}
                        scrollAnimationDuration={2000}
                        autoPlay={singleCustomerExpense.length > 1}
                        renderItem={({ item }) => (
                            <View style={styles.slide}>
                                <TotalExpenses 
                                    totalAmountToGive={item.totalAmountBasedOnCurrencyToGive}
                                    totalAmountToTake={item.totalAmountBasedOnCurrencyToTake}
                                    currency={item.currency}
                                />
                            </View>
                        )}
                    />: null
                }
            </View>
            
            <View style={{flex: 1, paddingBottom: 40, backgroundColor: "white"}}>

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
                        <NoCustomerRecordFound />
                    }

                    <View style={{marginTop: 20}}>
                        {/* <BannerAd
                        
                            unitId={adUnitId}
                            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        /> */}
                    </View>
                </ScrollView>
            </View>

            
            <Pressable
                style={styles.add_new_customer_btn}
                onPress={handleAddNewCustomer}
                title='add new customer'
            >
                <Text style={{color: "white"}}>Add new record</Text>
            </Pressable>
            

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
    container: {
        backgroundColor: 'white',
        height: "100%",
        paddingBottom: 40
    },
    
    add_new_customer_btn: {
        backgroundColor: '#181c20',
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#14171A",
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

    wrapper: {
        height: "auto",
        backgroundColor: "white",
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'start',
        height: "auto",
        width: "85%"
    },

})