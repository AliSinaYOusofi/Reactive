import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import * as SQLite from 'expo-sqlite'
import UserListView from '../components/SingleCustomerViewComp/UserListView'

export default function SingleCustomerView({navigation, route}) {
    
    const [customers, setCustomers] = useState([])
    const isFocused = useIsFocused()
    const username = route.params.username;

    const db = SQLite.openDatabase('green-red.db')
    
    useEffect( () => {
        
        const loadCustomerDataList = async () => {
            
            try {
                await db.transactionAsync(async tx => {
                    const result = await tx.executeSqlAsync("SELECT * FROM customers WHERE username = ?", [username]);
                    setCustomers(result.rows);
                });
            } 
            
            catch (e) {
                console.error("error while fetching users", e.message);
            }
        };

        loadCustomerDataList();
    },  [isFocused])
    
    return (
        <>

            <ScrollView style={styles.container}>
                {
                    customers.length > 0 
                    ?
                        customers.map((customer, index) => 
                            <UserListView
                                username={customer.username}
                                amount={customer.amount}
                                key={index}
                                transaction_date={customer.at}
                                currency={customer.currency}
                                email={customer.email}
                                phone={customer.phone}
                                transaction_type={customer.transaction_type}
                            />
                        )
                    : 
                        null
                }
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create( {
    container: {
        backgroundColor: '#fff',
        height: "100%",
    }
})