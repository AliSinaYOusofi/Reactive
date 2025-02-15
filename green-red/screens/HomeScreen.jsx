
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import TotalExpenses from '../components/Home/TotalExpenses';
import SearchCustomers from '../components/Home/SearchCustomers';
import CustomerListTemplate from '../components/Home/CustmerListTemplate';
import AddNewCustomer from '../components/global/AddNewCustomerButton';
import * as SQLite from 'expo-sqlite';
import { useAppContext } from '../context/useAppContext';
import NoUserAddedInfo from '../components/global/NoUserAddedInfo';
import ZeroSearchResult from '../components/global/ZeroSearchResult';
import Carousel from 'react-native-reanimated-carousel';
import { createCustomerRecordsTable } from '../database/createCustomerRecordsTable';
import CarouselOfTracker from '../components/carousel/Carouself';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { err } from 'react-native-svg';

export default function HomeScreen() {
    const [customer, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [parentSearchTerm, setParentSearchTerm] = useState("");
    const [totalExpenseOfCustomer, setTotalExpenseOfCustomers] = useState([]);
    const db = SQLite.openDatabaseSync('green-red.db');
    const { refreshHomeScreenOnChangeDatabase } = useAppContext();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const loadCustomerDataList = async () => {
            setLoading(true)
            try {
                const customers = await db.getAllAsync("SELECT * FROM customers");
                if (!customers || customers.length === 0) {
                    console.log("No customers found");
                    setCustomers([]);
                    return;
                }
                const updatedCustomers = await Promise.all(customers.map(async (customer) => {
                    try {
                        const [receivedResult, paidResult] = await Promise.all([
                            db.getAllAsync("SELECT SUM(amount) as total FROM customers WHERE transaction_type = 'received' AND username = ?", [customer.username]),
                            db.getAllAsync("SELECT SUM(amount) as total FROM customers WHERE transaction_type = 'paid' AND username = ?", [customer.username])
                        ]);
                        const received_amount_total = receivedResult[0]?.total ?? 0;
                        const paid_amount_total = paidResult[0]?.total ?? 0;
                        const border_color_status = parseFloat(received_amount_total) > parseFloat(paid_amount_total) ? "green" : "red";
                        const current_total_amount_status_count = parseFloat(received_amount_total) - parseFloat(paid_amount_total);
                        return { ...customer, amount: Math.abs(current_total_amount_status_count), border_color: border_color_status };
                    } catch (itemError) {
                        console.error(`Error processing customer ${customer.username}:`, itemError);
                        return customer;
                    }
                }));
                setCustomers(updatedCustomers.sort((a, b) => new Date(b.at) - new Date(a.at)));
            } catch (error) {
                console.error("Error loading customer data:", error);
                setError(error.message || " Error Fetching users table")
            } finally {
                setLoading(false)
            }
        };
        loadCustomerDataList();
        createCustomerRecordsTable();
    }, [refreshHomeScreenOnChangeDatabase]);

    const handleSearch = (searchTerm) => {
        setParentSearchTerm(searchTerm);
        setFilteredCustomers(customer.filter(item => searchTerm && item.username.toLowerCase().includes(searchTerm.toLowerCase())));
    };

    useEffect(() => {
        const fetchTotalOfAmountsBasedOnCurrency = async () => {
            try {
                let totalAmountsByCurrency = {};
                const distinctCurrenciesResult = await db.getAllAsync("SELECT DISTINCT currency FROM customer__records");
                const distinctCurrencies = distinctCurrenciesResult.map(row => row.currency);
                await Promise.all(distinctCurrencies.map(async currency => {
                    const [toGiveResult, toTakeResult] = await Promise.all([
                        db.getAllAsync("SELECT SUM(amount) as total FROM customer__records WHERE transaction_type = 'received' AND currency = ?", [currency]),
                        db.getAllAsync("SELECT SUM(amount) as total FROM customer__records WHERE transaction_type = 'paid' AND currency = ?", [currency])
                    ]);
                    totalAmountsByCurrency[currency] = {
                        totalAmountBasedOnCurrencyToGive: parseFloat(toGiveResult[0]?.total ?? 0),
                        totalAmountBasedOnCurrencyToTake: parseFloat(toTakeResult[0]?.total ?? 0)
                    };
                }));
                customer.forEach(customerr => {
                    if (!totalAmountsByCurrency[customerr.currency]) {
                        totalAmountsByCurrency[customerr.currency] = { totalAmountBasedOnCurrencyToGive: 0, totalAmountBasedOnCurrencyToTake: 0 };
                    }
                    if (customerr.transaction_type === 'received') {
                        totalAmountsByCurrency[customerr.currency].totalAmountBasedOnCurrencyToGive += parseFloat(customerr.amount);
                    } else {
                        totalAmountsByCurrency[customerr.currency].totalAmountBasedOnCurrencyToTake += parseFloat(customerr.amount);
                    }
                });
                setTotalExpenseOfCustomers(Object.entries(totalAmountsByCurrency).map(([currency, amounts]) => ({
                    currency,
                    totalAmountBasedOnCurrencyToGive: amounts.totalAmountBasedOnCurrencyToGive,
                    totalAmountBasedOnCurrencyToTake: amounts.totalAmountBasedOnCurrencyToTake
                })));
            } catch (error) {
                console.error("Error fetching total amounts:", error);
            }
        };
        fetchTotalOfAmountsBasedOnCurrency();
    }, [customer]);

    if (loading) {
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
        <Animated.View style={style.container} entering={FadeIn.duration(500)}>
            <Animated.View entering={FadeIn.duration(500).delay(900)}>
                <CarouselOfTracker totalExpenseOfCustomer={totalExpenseOfCustomer}/>
            </Animated.View>

            <Animated.View style={{marginTop: 50}} entering={FadeInDown.delay(200)}>
                {customer.length ? (
                    <SearchCustomers 
                        style={style.item} 
                        handleSearch={handleSearch} 
                        setCustomers={setCustomers}
                        customersToConvert={customer}
                    />
                ) : null}
            </Animated.View>
            
            <View style={{ flex: 1 }}>
                <ScrollView indicatorStyle='black' style={style.scroll_view}>
                    {customer.length ? (
                        parentSearchTerm ? (
                            filteredCustomers.length ? (
                                filteredCustomers.map((item, index) => (
                                    <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
                                        <CustomerListTemplate 
                                            username={item.username} 
                                            usernameShortCut={"AS"} 
                                            totalAmount={item.amount}
                                            style={style.item}
                                            transaction_type={item.transaction_type}
                                            currency={item.currency}
                                            at={item.at}
                                            border_color={item.border_color}
                                            email={item.email}
                                            phone={item.phone}
                                            isSearchComponent={true}
                                            searchResultLength={filteredCustomers.length}
                                        />
                                    </Animated.View>
                                ))
                            ) : <ZeroSearchResult />
                        ) : (
                            customer.map((item, index) => (
                                <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
                                    <CustomerListTemplate
                                        index={index} 
                                        username={item.username} 
                                        usernameShortCut={"AS"} 
                                        totalAmount={item.amount}
                                        style={style.item}
                                        transaction_type={item.transaction_type}
                                        currency={item.currency}
                                        at={item.at}
                                        border_color={item.border_color}
                                        email={item.email}
                                        phone={item.phone}
                                        isSearchComponent={false}
                                    />
                                </Animated.View>
                            ))
                        )
                    ) : <NoUserAddedInfo />}
                </ScrollView>
            </View>
            {
                !parentSearchTerm.length && (
                    <Animated.View entering={FadeInDown.delay(300)}>
                        <AddNewCustomer />
                    </Animated.View>
                )
            }
        </Animated.View>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'column',
        rowGap: 10,
        backgroundColor: 'white',
        height: "100%",
        fontFamily: "Roboto",
        width: "100%",
    },
    item: {
        flex: 1,
        marginHorizontal: 10,
        fontFamily: "Roboto",
    },
    scroll_view: {
        paddingHorizontal: 4
    },
    slide: {
        flex: 1,
        justifyContent: 'start',
        alignItems: 'start',
        backgroundColor: 'white',
        height: "auto",
        width: "85%"
    },
    spinner: {
        flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"
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
});
