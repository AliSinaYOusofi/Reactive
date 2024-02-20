import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import * as SQLite from 'expo-sqlite'
import UserListView from '../components/SingleCustomerViewComp/UserListView'
import Toast from 'react-native-toast-message'
import AddNewCustomeRecordModal from '../components/global/AddNewCustomeRecordModal'


export default function SingleCustomerView({navigation, route}) {
    
    const [customers, setCustomers] = useState([])
    const isFocused = useIsFocused()
    const username = route.params.username;
    const [addNewRecordModal, setAddNewRecordModal] = useState(false)

    const db = SQLite.openDatabase('green-red.db')
    
    useEffect( () => {
        
        const loadCustomerDataList = async () => {
            
            try {
                await db.transactionAsync(async tx => {
                    const result = await tx.executeSqlAsync("SELECT * FROM customer_records WHERE username = ?", [username]);
                    setCustomers(result.rows);
                });
            } 
            
            catch (e) {
                console.error("error while fetching users", e.message);
            }
        };

        loadCustomerDataList();
    },  [isFocused])
    
    const handleAddNewCustomer = () => {
        // a table should be created since username is unique
        //  that should be the relation between this user and his customer list
        
        setAddNewRecordModal(true)
    }

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
            <View>
                <Pressable
                    style={styles.add_new_customer_btn}
                    onPress={handleAddNewCustomer}
                    title='add new customer'
                >
                    <Text style={{color: "white"}}>Add new record</Text>
                </Pressable>
            </View>

            <Modal
                visible={addNewRecordModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setAddNewRecordModal(false)}
            >
                <AddNewCustomeRecordModal
                    username={username}
                    setAddNewRecordModal={setAddNewRecordModal}
                />
            </Modal>
        </>
    )
}


const styles = StyleSheet.create( {
    container: {
        backgroundColor: '#fff',
        height: "100%",
    },
    
    add_new_customer_btn: {
        backgroundColor: 'black',
        color: "white",
        borderRadius: 20,
        height: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        width: "70%",
        alignSelf: "center",
        position: "absolute",
        bottom: 10,
    },

})