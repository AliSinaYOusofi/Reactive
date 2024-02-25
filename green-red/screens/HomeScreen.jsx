import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import TotalExpenses from '../components/Home/TotalExpenses'
import SearchCustomers from '../components/Home/SearchCustomers'
import CustomerListTemplate from '../components/Home/CustmerListTemplate'
import AddNewCustomer from '../components/global/AddNewCustomerButton'
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native'
import { useAppContext } from '../context/useAppContext'
import NoUserAddedInfo from '../components/global/NoUserAddedInfo'
import ZeroSearchResult from '../components/global/ZeroSearchResult'
import { set } from 'date-fns'

export default function HomeScreen() {
    
    const [ customer, setCustomers ] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [parentSearchTerm, setParentSearchTerm] = useState("")
    const [totalExpenseOfCustomer, setTotalExpenseOfCustomers] = useState([])
    const db = SQLite.openDatabase('green-red.db')
    const isFocused = useIsFocused()
    const { refreshHomeScreenOnChangeDatabase } = useAppContext()
    
    useEffect( () => {
        const loadCustomerDataList = async () => {

            try {
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
                            
                            setCustomers( prevState => [...prevState, item]) 
                        })
                    )
                }) 
            }
            
            catch( e ) {
                console.error("error while fetching users", e.message)
            }
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
            let unique_currencies = new Set()

            await Promise.all(
                
                customer.map(async (customerr) => {
                
                    await db.transactionAsync(async tx => {
                
                        const recordsOfUser = await tx.executeSqlAsync("SELECT * FROM customer__records WHERE username = ?", [customerr.username]);
                        
                        
                        if (! recordsOfUser.rows.length ) {
                            return console.log("not records for this user")
                        }
                        
                        for (const record of recordsOfUser.rows) {
                
                            const currency = record.currency;
                            current_currency = record.currency

                            if (unique_currencies.has(currency)) {
                                continue
                            }

                            unique_currencies.add(currency)

                            //TODO: make this query more efficient
                            // also i need the sum from the customers table
                            
                            const totalAmountBasedOnCurrencyToTakeDBResult = await tx.executeSqlAsync("SELECT SUM(amount) FROM customer__records WHERE transaction_type = 'received' AND currency = ?", [currency]);
                            const totalAmountBasedOnCurrencyToGiveDBResult = await tx.executeSqlAsync("SELECT SUM(amount) FROM customer__records WHERE transaction_type = 'paid' AND currency = ?", [currency]);
                            
                            let plainTotalAmountToGive
                            let plainTotalAmountToTake

                            if (totalAmountBasedOnCurrencyToGiveDBResult.rows.length < 0 || totalAmountBasedOnCurrencyToGiveDBResult.rows[0]['SUM(amount)'] === null) {
                                plainTotalAmountToGive = 0
                            } else {
                                plainTotalAmountToGive = totalAmountBasedOnCurrencyToGiveDBResult.rows[0]['SUM(amount)']
                            }

                            if (totalAmountBasedOnCurrencyToTakeDBResult.rows.length < 0 || totalAmountBasedOnCurrencyToTakeDBResult.rows[0]['SUM(amount)'] === null) {
                                plainTotalAmountToTake = 0
                            } else {
                                plainTotalAmountToTake = totalAmountBasedOnCurrencyToTakeDBResult.rows[0]['SUM(amount)']
                            }

                            const total_expense_data = {
                                currency,
                                totalAmountBasedOnCurrencyToGive: plainTotalAmountToGive,
                                totalAmountBasedOnCurrencyToTake: plainTotalAmountToTake
                            };
        
                            total_expense_data_of_customers.push(total_expense_data)
                        }
                    })
                })
            );
            
            console.log(total_expense_data_of_customers, 'customers')
            return total_expense_data_of_customers;
        };
        
        fetchTotalOfAmountsBasedOnCurrency();
    });
    

    console.log(totalExpenseOfCustomer)
    return (
        <>
            <View style={style.container}>
                
                <TotalExpenses />
                <SearchCustomers 
                    style={style.item} 
                    handleSearch={handleSearch} 
                    setCustomers={setCustomers}
                    customersToConvert={customer}
                />
                
                <ScrollView style={style.scroll_view}>

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
            </View>
            <AddNewCustomer />
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'column',
        rowGap: 10,
        backgroundColor: 'white',
        height: "100%",
        fontFamily: "Roboto",
    },
    item: {
        flex: 1,
        marginHorizontal: 10,
        fontFamily: "Roboto",
    },

    scroll_view: {
        paddingHorizontal: 4
    }
})