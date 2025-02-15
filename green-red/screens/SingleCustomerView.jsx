import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, ActivityIndicator } from 'react-native'
import { openDatabaseSync } from 'expo-sqlite'
import Toast from 'react-native-toast-message'
import AddNewCustomeRecordModal from '../components/global/AddNewCustomeRecordModal'
import { useAppContext } from '../context/useAppContext'
import Animated, { 
    FadeIn,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    useSharedValue
} from 'react-native-reanimated'
import NoCustomerRecordFound from '../components/global/NoCustomerRecordFound'
import { AntDesign } from '@expo/vector-icons'
import AnimatedUserListView from '../components/global/AnimatedUserListView'
import CarouselOfTracker from '../components/carousel/Carouself'

export default function SingleCustomerView({navigation, route}) {
    const [customers, setCustomers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const username = route.params.username
    const [addNewRecordModal, setAddNewRecordModal] = useState(false)
    const { refreshSingelViewChangeDatabase, refreshHomeScreenOnChangeDatabase } = useAppContext()
    const [singleCustomerExpense, setSingleCustomerExpense] = useState([])
    const [ loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const db = openDatabaseSync('green-red.db')
    
    const modalScale = useSharedValue(0)
    
    const loadingRotation = useSharedValue(0)

    useEffect(() => {
        if (isLoading) {
            loadingRotation.value = withSequence(
                withTiming(360, { duration: 1000 }),
                withTiming(0, { duration: 0 })
            )
        }
    }, [isLoading])

    const modalAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: modalScale.value }]
        }
    })

    useEffect(() => {
        const fetchAllCustomerExpense = async () => {
            setIsLoading(true)
            let totalAmountsByCurrency = {}

            try {
                const initialTransactionQuery = "SELECT amount, currency, transaction_type FROM customers WHERE username = ?"
                const initialTransaction = await db.getFirstAsync(initialTransactionQuery, [username])

                if (initialTransaction) {
                    const { amount, currency, transaction_type } = initialTransaction
                    totalAmountsByCurrency[currency] = {
                        totalAmountBasedOnCurrencyToGive: transaction_type === 'received' ? parseFloat(amount) : 0,
                        totalAmountBasedOnCurrencyToTake: transaction_type === 'paid' ? parseFloat(amount) : 0
                    }
                }

                const distinctCurrenciesQuery = "SELECT DISTINCT currency FROM customer__records WHERE username = ?"
                const distinctCurrencies = await db.getAllAsync(distinctCurrenciesQuery, [username])

                await Promise.all(distinctCurrencies.map(async ({ currency }) => {
                    const toGiveQuery = "SELECT SUM(amount) as total FROM customer__records WHERE transaction_type = 'received' AND currency = ? AND username = ?"
                    const toTakeQuery = "SELECT SUM(amount) as total FROM customer__records WHERE transaction_type = 'paid' AND currency = ? AND username = ?"

                    const [toGiveResult, toTakeResult] = await Promise.all([
                        db.getFirstAsync(toGiveQuery, [currency, username]),
                        db.getFirstAsync(toTakeQuery, [currency, username])
                    ])

                    if (!totalAmountsByCurrency[currency]) {
                        totalAmountsByCurrency[currency] = {
                            totalAmountBasedOnCurrencyToGive: 0,
                            totalAmountBasedOnCurrencyToTake: 0
                        }
                    }

                    totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToGive += parseFloat(toGiveResult?.total || 0)
                    totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToTake += parseFloat(toTakeResult?.total || 0)
                }))

                const total_expense_data = Object.keys(totalAmountsByCurrency).map(currency => ({
                    currency,
                    totalAmountBasedOnCurrencyToGive: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToGive,
                    totalAmountBasedOnCurrencyToTake: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToTake
                }))

                setSingleCustomerExpense(total_expense_data)
            } catch (error) {
                console.error("Error fetching customer expenses:", error.message)
                setError(error.message || "Failed to fetch customers")
            } finally {
                setIsLoading(false)
            }
        }

        fetchAllCustomerExpense()
    }, [username, refreshSingelViewChangeDatabase])

    useEffect(() => {
        const loadCustomerDataList = async () => {
            try {
                const query = "SELECT * FROM customer__records WHERE username = ?"
                const result = await db.getAllAsync(query, [username])
                
                setCustomers(result.sort((a, b) => new Date(b.transaction_at) - new Date(a.transaction_at)))
            } catch (e) {
                console.error("Error while fetching customer records:", e.message)
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to fetch customer records'
                })
            }
        }

        loadCustomerDataList()
    }, [refreshSingelViewChangeDatabase, username, refreshHomeScreenOnChangeDatabase])
    
    const handleAddNewCustomer = () => {
        modalScale.value = withSpring(1)
        setAddNewRecordModal(true)
    }

    if (isLoading) {
        return <ActivityIndicator style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}} color="black" size={"large"}/>
    }

    else if (error) {
        return (
            <View style={style.errorContainer}>
                <Text style={style.errorText}>Fetching users failed</Text>
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
                <Pressable
                    style={styles.add_new_customer_btn}
                    onPress={handleAddNewCustomer}
                >
                    <AntDesign name="plus" size={24} color="white" />
                    <Text style={{color: "white", fontWeight: "bold"}}>Add Record</Text>
                </Pressable>
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
                <Animated.View style={[{flex: 1}, modalAnimatedStyle]}>
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
        paddingBottom: 40
    },
    
    add_new_customer_btn: {
        backgroundColor: '#181c20',
        color: "white",
        borderRadius: 8,
        height: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: "70%",
        alignSelf: "center",
        position: "absolute",
        bottom: 10,
        backgroundColor: "#14171A",
        borderRadius: 9999,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: "90%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
})
