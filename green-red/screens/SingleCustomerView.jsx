import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'
import AddNewCustomeRecordModal from '../components/global/AddNewCustomeRecordModal'
import { useAppContext } from '../context/useAppContext'
import Animated, { 
    FadeIn,
    withSpring,
    useSharedValue
} from 'react-native-reanimated'
import NoCustomerRecordFound from '../components/global/NoCustomerRecordFound'
import { AntDesign } from '@expo/vector-icons'
import AnimatedUserListView from '../components/global/AnimatedUserListView'
import CarouselOfTracker from '../components/carousel/Carouself'
import { supabase } from '../utils/supabase'
import RetryComponent from '../components/RetryComponent'

export default function SingleCustomerView({navigation, route}) {
    const [customers, setCustomers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const username = route.params.username
    const [addNewRecordModal, setAddNewRecordModal] = useState(false)
    const { refreshSingelViewChangeDatabase, refreshHomeScreenOnChangeDatabase } = useAppContext()
    const [singleCustomerExpense, setSingleCustomerExpense] = useState([])
    const [ refresh, setRefresh] = useState(false)
    const [error, setError] = useState("")
    
    const modalScale = useSharedValue(0)

    useEffect(() => {
        const fetchAllCustomerExpense = async () => {
            setIsLoading(true);
            let totalAmountsByCurrency = {};
    
            try {
                const { data: initialTransaction, error: error1 } = await supabase
                    .from('customers')
                    .select('amount, currency, transaction_type')
                    .eq('username', username)
                    .limit(1);
    
                if (error1) {
                    console.error('Error fetching initial transaction:', error1);
                    return;
                }
    
                if (initialTransaction && initialTransaction.length > 0) {
                    const { amount, currency, transaction_type } = initialTransaction[0];
                    totalAmountsByCurrency[currency] = {
                        totalAmountBasedOnCurrencyToGive: transaction_type === 'received' ? parseFloat(amount) : 0,
                        totalAmountBasedOnCurrencyToTake: transaction_type === 'paid' ? parseFloat(amount) : 0
                    }
                }
    
                const { data: customerRecords, error: error2 } = await supabase
                    .from('customer__records')
                    .select('currency')
                    .eq('username', username);
    
                if (error2) {
                    console.error('Error fetching customer records:', error2);
                    return;
                }
    
                const distinctCurrencies = [...new Set(customerRecords.map(record => record.currency))];
    
                await Promise.all(distinctCurrencies.map(async currency => {
                    const [toGiveResult, toTakeResult] = await Promise.all([
                        supabase
                            .from('customer__records')
                            .select('amount')
                            .eq('transaction_type', 'received')
                            .eq('currency', currency)
                            .eq('username', username),
                        supabase
                            .from('customer__records')
                            .select('amount')
                            .eq('transaction_type', 'paid')
                            .eq('currency', currency)
                            .eq('username', username)
                    ]);
    
                    if (toGiveResult.error || toTakeResult.error) {
                        console.error('Error fetching transaction data:', toGiveResult.error || toTakeResult.error);
                        return;
                    }
    
                    if (!totalAmountsByCurrency[currency]) {
                        totalAmountsByCurrency[currency] = {
                            totalAmountBasedOnCurrencyToGive: 0,
                            totalAmountBasedOnCurrencyToTake: 0
                        }
                    }
    
                    const toGiveTotal = toGiveResult.data.reduce((sum, record) => sum + record.amount, 0);
                    const toTakeTotal = toTakeResult.data.reduce((sum, record) => sum + record.amount, 0);
    
                    totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToGive += toGiveTotal;
                    totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToTake += toTakeTotal;
                }));
    
                const total_expense_data = Object.keys(totalAmountsByCurrency).map(currency => ({
                    currency,
                    totalAmountBasedOnCurrencyToGive: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToGive,
                    totalAmountBasedOnCurrencyToTake: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToTake
                }));
    
                setSingleCustomerExpense(total_expense_data);
            } catch (error) {
                console.error("Error fetching customer expenses:", error.message);
                setError(error.message || "Failed to fetch customers");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchAllCustomerExpense();
    }, [username, refreshSingelViewChangeDatabase, refresh]);
    

    useEffect(() => {
        const loadCustomerDataList = async () => {
            try {
                const { data, error } = await supabase
                    .from('customer__records')
                    .select('*')
                    .eq('username', username);
        
                if (error) {
                    setError(error.message || "Failed to fetch records")
                    console.error("Error while fetching customer records:", error);
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Failed to fetch customer records'
                    });
                }
                else {
                    setCustomers(data.sort((a, b) => new Date(b.transaction_at) - new Date(a.transaction_at)));
                }
            } catch (e) {
                console.error("Error while fetching customer records:", e);
                setError("Failed to fetch records")
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to fetch customer records'
                });
            }
        };
        
        loadCustomerDataList();
    }, [refreshSingelViewChangeDatabase, username, refreshHomeScreenOnChangeDatabase, refresh])
    
    const handleAddNewCustomer = () => {
        modalScale.value = withSpring(1)
        setAddNewRecordModal(true)
    }

    if (isLoading) {
        return <ActivityIndicator style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}} color="black" size={"large"}/>
    }

    else if (error) {
        return (
            <View style={styles.errorContainer}>
                <RetryComponent setRefresh={setRefresh} setError={setError} errorMessage={error}/>
            </View>
        );
    }

    return (
        <>
            <Animated.View 
                style={{backgroundColor: "white"}}
                entering={FadeIn.duration(500)}
            >
                <CarouselOfTracker totalExpenseOfCustomer={singleCustomerExpense} />
            </Animated.View>
            
            <View style={{flex: 1, paddingBottom: 40, backgroundColor: "white", marginTop: 50}}>
                <ScrollView style={styles.container}>
                    {customers.length > 0 ? (
                        customers.map((customer, index) => (
                            <AnimatedUserListView
                                key={customer.id}
                                customer={customer}
                                index={index}
                            />
                        ))
                    ) : (
                        <NoCustomerRecordFound />
                    )}
                </ScrollView>
            </View>

            <Animated.View>
                <TouchableOpacity
                    style={styles.add_new_customer_btn}
                    onPress={handleAddNewCustomer}
                >
                    <AntDesign name="plus" size={24} color="white" />
                    
                    <Text style={{color: "white", fontWeight: "bold"}}>
                        Add Record
                    </Text>
                </TouchableOpacity>
            </Animated.View>
            
            <Modal
                visible={addNewRecordModal}
                animationType='none'
                transparent={true}
                onRequestClose={() => {
                    modalScale.value = withSpring(0)
                    setAddNewRecordModal(false)
                }}
            >
                <Animated.View style={[{flex: 1}]}>
                    <AddNewCustomeRecordModal
                        username={username}
                        setAddNewRecordModal={setAddNewRecordModal}
                    />
                </Animated.View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: "100%",
    },
    
    add_new_customer_btn: {
        backgroundColor: '#181c20',
        color: "white",
        height: 'auto',
        backgroundColor: "#14171A",
        borderRadius: 99,
        paddingVertical: 18,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        position: "absolute",
        backgroundColor: "#14171A",
        borderRadius: 9999,
        width: "90%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        bottom: 1
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white"
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
})
