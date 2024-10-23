import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native'
import TotalExpenses from '../components/Home/TotalExpenses'
import SearchCustomers from '../components/Home/SearchCustomers'
import CustomerListTemplate from '../components/Home/CustmerListTemplate'
import AddNewCustomer from '../components/global/AddNewCustomerButton'
import * as SQLite from 'expo-sqlite';

import { useAppContext } from '../context/useAppContext'
import NoUserAddedInfo from '../components/global/NoUserAddedInfo'
import ZeroSearchResult from '../components/global/ZeroSearchResult'
import Carousel from 'react-native-reanimated-carousel';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
// const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.EXPO_PUBLIC_ADMOB_BANNER;
export default function HomeScreen() {
    
    const [ customer, setCustomers ] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [parentSearchTerm, setParentSearchTerm] = useState("")
    const [totalExpenseOfCustomer, setTotalExpenseOfCustomers] = useState([])
    const db = SQLite.openDatabaseSync('green-red.db')
    
    const { refreshHomeScreenOnChangeDatabase } = useAppContext()
    
    useEffect(() => {
        const loadCustomerDataList = async () => {
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
                            db.getAllAsync(
                                "SELECT SUM(amount) as total FROM customers WHERE transaction_type = 'received' AND username = ?",
                                [customer.username]
                            ),
                            db.getAllAsync(
                                "SELECT SUM(amount) as total FROM customers WHERE transaction_type = 'paid' AND username = ?",
                                [customer.username]
                            )
                        ]);

                        const received_amount_total = receivedResult[0]?.total ?? 0;
                        const paid_amount_total = paidResult[0]?.total ?? 0;

                        const border_color_status = parseFloat(received_amount_total) > parseFloat(paid_amount_total) ? "green" : "red";
                        const current_total_amount_status_count = parseFloat(received_amount_total) - parseFloat(paid_amount_total);
                        
                        return {
                            ...customer,
                            amount: Math.abs(current_total_amount_status_count),
                            border_color: border_color_status
                        };
                    } catch (itemError) {
                        console.error(`Error processing customer ${customer.username}:`, itemError);
                        return customer; // Return the original customer data if processing fails
                    }
                }));
                
                setCustomers(updatedCustomers.sort((a, b) => new Date(b.at) - new Date(a.at)));
            } catch (error) {
                console.error("Error loading customer data:", error);
            }
        };

        loadCustomerDataList();
    }, [refreshHomeScreenOnChangeDatabase])
    
    const handleSearch = (searchTerm) => {
        
        setParentSearchTerm(searchTerm)
        
        const filtered = customer.filter((item) => {
            if (searchTerm) {
                return item.username.toLowerCase().includes(searchTerm.toLowerCase())
            }
        }
        );
        
        setFilteredCustomers(filtered);
    };
    
    useEffect( () => {
        const createCustomerRecordsTable = async () => {
            try {
            const query = `
                CREATE TABLE IF NOT EXISTS customer__records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    amount REAL NOT NULL,
                    transaction_type TEXT NOT NULL,
                    currency TEXT NOT NULL,
                    transaction_at DATETIME NOT NULL,
                    transaction_updated_at DATETIME NOT NULL
                )
            `;
            console.log("creating customer__records table")
            await db.execAsync(query);
            console.log("Table created successfully--- customer__records");
            } catch (error) {
                console.error("Error while creating customer__records table:", error.message);
                showToast("Error while creating customer__records table");
            }
        }

        createCustomerRecordsTable();
    }, [])

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

                    const totalAmountBasedOnCurrencyToGive = parseFloat(toGiveResult[0]?.total ?? 0);
                    const totalAmountBasedOnCurrencyToTake = parseFloat(toTakeResult[0]?.total ?? 0);

                    totalAmountsByCurrency[currency] = {
                        totalAmountBasedOnCurrencyToGive,
                        totalAmountBasedOnCurrencyToTake
                    };
                }));

                customer.forEach(customerr => {
                    if (!totalAmountsByCurrency[customerr.currency]) {
                        totalAmountsByCurrency[customerr.currency] = {
                            totalAmountBasedOnCurrencyToGive: 0,
                            totalAmountBasedOnCurrencyToTake: 0
                        };
                    }

                    if (customerr.transaction_type === 'received') {
                        totalAmountsByCurrency[customerr.currency].totalAmountBasedOnCurrencyToGive += parseFloat(customerr.amount);
                    } else {
                        totalAmountsByCurrency[customerr.currency].totalAmountBasedOnCurrencyToTake += parseFloat(customerr.amount);
                    }
                });

                // Format data for state update
                const total_expense_data_of_customers = Object.entries(totalAmountsByCurrency).map(([currency, amounts]) => ({
                    currency,
                    totalAmountBasedOnCurrencyToGive: amounts.totalAmountBasedOnCurrencyToGive,
                    totalAmountBasedOnCurrencyToTake: amounts.totalAmountBasedOnCurrencyToTake
                }));

                setTotalExpenseOfCustomers(total_expense_data_of_customers);
            } catch (error) {
                console.error("Error fetching total amounts:", error);
            }
        };

        fetchTotalOfAmountsBasedOnCurrency();
    }, [customer])

    const width = Dimensions.get('window').width;

    return (
        <View style={{width: "100%"}}>
            <View style={[style.container]}>
                <View style={{flex: 1, marginBottom: -100}}>

                    {
                        totalExpenseOfCustomer.length ?
                        <Carousel
                            loop
                            width={width}
                            height={width / 2}
                            data={totalExpenseOfCustomer}
                            scrollAnimationDuration={2000}
                            autoPlay={totalExpenseOfCustomer.length > 1}
                            renderItem={({ item }) => (
                                <View style={style.slide}>
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
                
                
                <SearchCustomers 
                    style={style.item} 
                    handleSearch={handleSearch} 
                    setCustomers={setCustomers}
                    customersToConvert={customer}
                />
                
                <View style={{flex: 1, paddingBottom: 60}}>

                    <ScrollView indicatorStyle='black' style={style.scroll_view}>

                        {
                            customer.length ?

                            parentSearchTerm ?
                            (
                                filteredCustomers.length ?
                                filteredCustomers.map( item => 

                                {

                                        return(
                                            <View key={item.id}>
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
                                            </View>
                                        )
                                }
                                ): <ZeroSearchResult />
                            )
                            :
                            customer.map( 
                                (item, index) => 
                                    <View key={item.id}>
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
                                            isSearchComponent={false}
                                        />
                                        
                                    </View>
                            )
                            : <NoUserAddedInfo />
                        }
                    </ScrollView>
                    {/* <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    /> */}
                </View>
                
            </View>
            
            <AddNewCustomer />
            
        </View>
    )
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

    expense_container: {
        
        flexDirection: "row",
        justifyContent: "space-between",
    },

    slide: {
        flex: 1,
        justifyContent: 'start',
        alignItems: 'start',
        backgroundColor: 'white',
        height: "auto",
        width: "85%"
    },

    wrapper: {
        height: "auto",
        backgroundColor: "white",
    },
    bottomBanner: {
        position: "absolute",
        bottom: 0
      },
})
