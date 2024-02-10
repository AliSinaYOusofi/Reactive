import React from 'react'
import { View, Text } from 'react-native'
import TotalExpenses from '../components/Home/TotalExpenses'
import SearchCustomers from '../components/Home/SearchCustomers'
import CustomerListTemplate from '../components/Home/CustmerListTemplate'

export default function HomeScreen() {
    return (
        <>
            
            <TotalExpenses />
            <View>
                <SearchCustomers />
            </View>
            <CustomerListTemplate username={"Ali Sina Yousofi"} usernameShortCut={"AS"} totalAmount={444}/>
        </>
    )
}
