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

export default function HomeScreen() {
    
    const [ customer, setCustomers ] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [parentSearchTerm, setParentSearchTerm] = useState("")
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

    return (
        <>
            <View style={style.container}>
                
                <TotalExpenses style={style.item}/>
                
                <SearchCustomers style={style.item} handleSearch={handleSearch} setCustomers={setCustomers}/>
                
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