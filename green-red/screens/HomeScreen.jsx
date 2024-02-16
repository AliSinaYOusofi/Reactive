import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import TotalExpenses from '../components/Home/TotalExpenses'
import SearchCustomers from '../components/Home/SearchCustomers'
import CustomerListTemplate from '../components/Home/CustmerListTemplate'
import AddNewCustomer from '../components/global/AddNewCustomerButton'
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native'
import { useFonts } from 'expo-font'

export default function HomeScreen() {
    
    const [ customer, setCustomers ] = useState([])
    const db = SQLite.openDatabase('green-red.db')
    
    useEffect( () => {
        const loadCustomerDataList = async () => {

            try {
                await db.transactionAsync( async tx => {
                    const result = await tx.executeSqlAsync("SELECT * FROM customers", [])
                    setCustomers(result.rows)
                }) 
            }
            
            catch( e ) {
                console.error("error while fetching users", e.message)
            }
        }
        loadCustomerDataList()
    }, [])
    
    return (
        <>
            <View style={style.container}>
                
                <TotalExpenses style={style.item}/>
                
                <SearchCustomers style={style.item}/>
                
                {
                    customer.length ?
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
                                />
                            </View>
                    )
                    : null
                }
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
        flex: 1, // This will make the components equally spaced
        marginHorizontal: 10, // Adjust spacing between components
        fontFamily: "Roboto",
    },
})