import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import SortOptionsDropDownModal from '../global/SortOptionsDropDownModal';
import { parseISO } from 'date-fns';
import * as Print from 'expo-print'
import * as SQLite from 'expo-sqlite'
import * as Sharing from 'expo-sharing';
import { formatDistanceToNowStrict } from 'date-fns';

export default function SearchCustomers({handleSearch, setCustomers}) {
    
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState('NEWEST')
    const [allCustomersDataToConvert, setAllCustomersDataToConvert] = useState([])

    const handleSearchCustomers = (search_this) => {
        setCurrentSearchTerm(search_this)
        handleSearch(search_this)
    }

    const handleSortByDateOldest = () => {
        setCustomers((prevCustomers) => {
            let sortedCustomers = prevCustomers.slice().sort((a, b) => {
                return new Date(a.at) - new Date(b.at);
            })
            return sortedCustomers;
        });
    };
    
    const handleSortByDateNewst = () => {
        setCustomers((prevCustomers) => {
            let sortedCustomers = prevCustomers.slice().sort((a, b) => {
                return new Date(b.at) - new Date(a.at);
            })
            return sortedCustomers;
        });
    };

    const handleSortByAscendingAlphabeticalOrder = () => {
        setCustomers( (previouseCustomers) => {
            return previouseCustomers.slice().sort((a, b) => {
                return a.username.localeCompare(b.username)
            }) 
        })
    }

    const handleSortByDescendingAlphabeticalOrder = () => {
        setCustomers( (previouseCustomers) => {
            return previouseCustomers.slice().sort((a, b) => {
                return b.username.localeCompare(a.username)
            })
        })
    }


    const AllCustomersData = () => {
        const db = SQLite.openDatabase("green-red.db");
    
        db.transaction(tx => {
            
            tx.executeSql("SELECT * FROM customers", [], (_, success) => {
            
                let allCustomersWithFullInfo = success.rows._array

                allCustomersWithFullInfo.forEach(customer => {
            
                    tx.executeSql("SELECT * FROM customer__records WHERE username = ?", [customer.username], (_, succ) => {
            
                        let customerRecords = succ.rows._array
            
                        let customerWithFullInfo = {
            
                            ...customer,
                            records: customerRecords
                        };
                        
                        setAllCustomersDataToConvert(prevAllCustomersDataToConvert => [...prevAllCustomersDataToConvert, customerWithFullInfo]);
                    });
                });
            });
        }, (error) => {
            console.error("error while generating pdf", error);
        });
    };
    


    useEffect( () => {
        
        const handleSortOptionsChange = () => {
            switch(selectedSortOption) {
                case 'OLDEST':
                    handleSortByDateOldest()
                    break;
                case 'NEWEST':
                    handleSortByDateNewst()
                    break;
                case 'ASC ALPHA':
                    handleSortByAscendingAlphabeticalOrder()
                    break;
                case 'DESC ALPHA':
                    handleSortByDescendingAlphabeticalOrder()
                    break;
            }
        }
        handleSortOptionsChange()
    }, [selectedSortOption])

    const convertQueryResultToPdf = async () => {
        try {
            
            AllCustomersData()
            
            const customerDataDiv = allCustomersDataToConvert.map(customer => {
                const recordRows = customer.records.map(record => {
                    return `
                        <tr>
                            <td>${record.transaction_type}</td>
                            <td>${record.amount} ${record.currency}</td>
                            <td>${record.transaction_at} (${formatDistanceToNowStrict(parseISO(record.transaction_at))} ago)</td>
                        </tr>
                    `;
                }).join('');
            
                return `
                    <tr>
                        <td rowspan="${customer.records.length + 1}">${customer.username}</td>
                        <td rowspan="${customer.records.length + 1}">${customer.email}</td>
                        <td rowspan="${customer.records.length + 1}">${customer.phone}</td>
                        <td rowspan="${customer.records.length + 1}">${customer.amount} ${customer.currency}</td>
                        <td rowspan="${customer.records.length + 1}">${customer.at} (${formatDistanceToNowStrict(parseISO(customer.at))} ago)</td>
                    </tr>
                    ${recordRows}
                `;
            }).join('');
            
            const customerHtml = `
                <html>
                    <head>
                        <style>
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            th, td {
                                border: 1px solid #dddddd;
                                text-align: left;
                                padding: 8px;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Customers Data</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customerDataDiv}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;
            
            const { uri } = await Print.printToFileAsync({ html: customerHtml });
            
            Sharing.shareAsync(uri, { dialogTitle: 'Customers Data' });            
            
        } catch( e ) {
            console.error("error while gening pdf => ", e.message)
        }
    }
    return (
        <>
            <View style={styles.container}>
                
                <View style={styles.searchContainer}>
                    
                    <EvilIcons name="search" size={24} color="black" style={styles.icon}/>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        value={currentSearchTerm}
                        onChangeText={text => handleSearchCustomers(text)}
                    />
                </View>

                <View style={styles.sort_and_pdf_container}>
                    <Pressable onPress={() => setSortModalVisible(true)}>
                        <MaterialIcons name="sort" size={24} color="black" style={styles.icon}/>
                    </Pressable>

                    <Pressable onPress={ () => convertQueryResultToPdf()}>
                        <AntDesign name="pdffile1" size={24} color="black" style={styles.icon}/>
                    </Pressable>
                </View>
            </View>

            <Modal
                visible={sortModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSortModalVisible(false)}
            >
                <SortOptionsDropDownModal 
                    selected={selectedSortOption} 
                    setSelected={setSelectedSortOption}
                    setCloseSortMOdal={setSortModalVisible}
                />
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
        backgroundColor: "#f5f5f5"
    },

    icon: {
        marginRight: 10,
        color: "black"
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },

    sort_and_pdf_container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        padding: 5,
    },
});
