import React from 'react'
import { View, StyleSheet } from 'react-native'
import TotalExpenses from '../components/Home/TotalExpenses'
import SearchCustomers from '../components/Home/SearchCustomers'
import CustomerListTemplate from '../components/Home/CustmerListTemplate'
import AddNewCustomer from '../components/global/AddNewCustomerButton'

export default function HomeScreen() {
    return (
        <View style={style.container}>
            
            <TotalExpenses style={style.item}/>
            
            <SearchCustomers style={style.item}/>
            
            <CustomerListTemplate 
                username={"Ali Sina Yousofi"} 
                usernameShortCut={"AS"} 
                totalAmount={444}
                style={style.item}
            />
            <AddNewCustomer />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'column',
        rowGap: 10,
        backgroundColor: 'white'
    },
    item: {
        flex: 1, // This will make the components equally spaced
        marginHorizontal: 10, // Adjust spacing between components
    },
})