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
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.EXPO_PUBLIC_ADMOB_BANNER;
export default function HomeScreen() {
    
    const [ customer, setCustomers ] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [parentSearchTerm, setParentSearchTerm] = useState("")
    const [totalExpenseOfCustomer, setTotalExpenseOfCustomers] = useState([])
    const db = SQLite.openDatabase('green-red.db')
    
    const { refreshHomeScreenOnChangeDatabase } = useAppContext()
    
    useEffect( () => {
        const loadCustomerDataList = async () => {

            const updatedCustomers = [];
            
            await db.transactionAsync( async tx => {
                
                const result = await tx.executeSqlAsync("SELECT * FROM customers", [])
                
                if (result.rows.length === 0) {
                    setCustomers([])
                    return
                }
                
                
                await Promise.all(
                    result.rows.map( async (item, index) => {
                        
                        let received_amount = await tx.executeSqlAsync("SELECT SUM(amount) FROM customers WHERE transaction_type = 'received' AND username = ?", [item.username])

                        let paid_amount = await tx.executeSqlAsync("SELECT SUM(amount) FROM customers WHERE transaction_type = 'paid' AND username = ?", [item.username])
                        
                        let received_amount_total, paid_amount_total

                        received_amount_total = received_amount.rows[0]["SUM(amount)"] ? received_amount.rows[0]["SUM(amount)"] : 0
                        paid_amount_total = paid_amount.rows[0]["SUM(amount)"] ? paid_amount.rows[0]["SUM(amount)"] : 0

                        border_color_status = parseFloat(received_amount_total) > parseFloat(paid_amount_total) ? "green" : "red"
                        let current_total_amount_status_count = parseFloat(received_amount_total) - parseFloat(paid_amount_total)
                        
                        item.amount = current_total_amount_status_count < 0  ? current_total_amount_status_count * -1 : current_total_amount_status_count
                        item.border_color = border_color_status
                        
                        updatedCustomers.push(item)
                    })
                )
            }) 
            setCustomers( updatedCustomers.sort( (a, b) =>  new Date(b.at) - new Date(a.at)))
        }
        loadCustomerDataList()
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

    useEffect(() => {
        const fetchTotalOfAmountsBasedOnCurrency = async () => {
            
            let total_expense_data_of_customers = [];
            let totalAmountsByCurrency = {};
            let distinctCurrencies

            await db.transactionAsync( async tx => {
                
                distinctCurrencies = await tx.executeSqlAsync("SELECT DISTINCT currency FROM customer__records");
                distinctCurrencies = distinctCurrencies.rows.map(row => row.currency);
                
                await Promise.all( distinctCurrencies.map( async currency => {

                    const totalAmountBasedOnCurrencyToGive = await tx.executeSqlAsync("SELECT SUM(amount) FROM customer__records WHERE transaction_type = 'received' AND currency = ?", [currency]);
                    const totalAmountBasedOnCurrencyToTake = await tx.executeSqlAsync("SELECT SUM(amount) FROM customer__records WHERE transaction_type = 'paid' AND currency = ?", [currency]);

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

            customer.forEach( customerr => {
                if (totalAmountsByCurrency[customerr.currency]) {

                    if (String(customerr.transaction_type) === 'received') {
                        totalAmountsByCurrency[customerr.currency].totalAmountBasedOnCurrencyToGive += customerr.amount
                    }
                    else {
                        totalAmountsByCurrency[customerr.currency].totalAmountBasedOnCurrencyToTake += customerr.amount
                    }
                } 
                
                else {
                    
                    let totalAmountBasedOnCurrencyToGive, totalAmountBasedOnCurrencyToTake
                    
                    if (customerr.transaction_type === 'recieved') {
            
                        totalAmountBasedOnCurrencyToGive = customerr.amount
                        totalAmountBasedOnCurrencyToTake = 0
                    }
                    
                    else {
                        
                        totalAmountBasedOnCurrencyToGive = 0
                        totalAmountBasedOnCurrencyToTake = customerr.amount
                    }

                    totalAmountsByCurrency[customerr.currency] = {
                        totalAmountBasedOnCurrencyToGive,
                        totalAmountBasedOnCurrencyToTake,
                    }

                }
            })

            total_expense_data_of_customers = Object.keys(totalAmountsByCurrency).map(currency => ({
                currency,
                totalAmountBasedOnCurrencyToGive: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToGive,
                totalAmountBasedOnCurrencyToTake: totalAmountsByCurrency[currency].totalAmountBasedOnCurrencyToTake
            }));

            setTotalExpenseOfCustomers(total_expense_data_of_customers)
        }
        
        fetchTotalOfAmountsBasedOnCurrency();
    }, [customer])

    const width = Dimensions.get('window').width;

    return (
        <View style={{width: "100%"}}>
            <View style={[style.container]}>
                <View style={{flex: 0}}>

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
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    />
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
        width: "100%"
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