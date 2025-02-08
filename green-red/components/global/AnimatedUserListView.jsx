import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'
import UserListView from '../SingleCustomerViewComp/UserListView'

const AnimatedUserListView = ({ customer, index }) => {
    return (
        <Animated.View
            entering={FadeInRight.delay(index * 100).springify()}
            style={styles.container}
        >
            <UserListView
                username={customer.username}
                amount={customer.amount}
                transaction_date={customer.transaction_at}
                currency={customer.currency}
                transaction_type={customer.transaction_type}
                record_id={customer.id}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    }
})

export default AnimatedUserListView
