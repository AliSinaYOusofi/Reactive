import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Modal } from 'react-native';
import SortOptionsDropDownModal from '../global/SortOptionsDropDownModal';
import { format, parseISO } from 'date-fns';
import * as Print from 'expo-print'
import * as SQLite from 'expo-sqlite'
import * as Sharing from 'expo-sharing';
import { formatDistanceToNowStrict } from 'date-fns';
import Toast from 'react-native-toast-message';
import { ArrowUpDown, FileDown, Search } from 'lucide-react-native';

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


    const db =  SQLite.openDatabaseSync("green-red.db");
    const AllCustomersData = async () => {
        
    
        try {
            let allCustomersDataToConvert = [];
            
            const all_customers = await db.getAllAsync("SELECT * FROM customers");

            await Promise.all(
                
                all_customers.map(async (customer) => {
                    
                    const other_customer_records = await new Promise(async (resolve, reject) => {
                        
                        let customers_records = await db.getAllAsync('SELECT * FROM customer__records WHERE username = ?;',[customer.username])
                        resolve(customers_records)
                    });
                    
                    const customers_with_relevant_records = {
                        ...customer,
                        records: (other_customer_records),
                    };

                    allCustomersDataToConvert.push(customers_with_relevant_records);
                })
            );
    
            return allCustomersDataToConvert
        } catch (error) {
            console.error("error while generating pdf", error);
        }
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


    const showToast = (message, type = 'error') => {
        
        Toast.show({
            type: type,
            text1: message,
            position: 'top',
            onPress: () => Toast.hide(),
            swipeable: true,
            topOffset: 100,
        });
    };

    const convertQueryResultToPdf = async () => {
        try {
            const allCustomersDataToConvert = await AllCustomersData();
            if (!allCustomersDataToConvert.length) {
                return showToast('No customers found');
            }
    
            const formatDateTime = (dateString) => {
                const date = parseISO(dateString);
                return `${format(date, 'MMM d, yyyy HH:mm')} (${formatDistanceToNowStrict(date)} ago)`;
            };
    
            const customerDataDiv = allCustomersDataToConvert.map(customer => {
                const records = customer.records || [];
                
                // Main customer row
                const mainRow = `
                    <tr class="customer-row">
                        <td>${customer.username}</td>
                        <td>${customer.email}</td>
                        <td>${customer.phone}</td>
                        <td>${customer.transaction_type}</td>
                        <td>${customer.amount} ${customer.currency}</td>
                        <td>${formatDateTime(customer.at)}</td>
                    </tr>
                `;
    
                // Transaction history rows
                const recordRows = records.map(record => `
                    <tr class="record-row">
                        <td colspan="3" class="empty-cell"></td>
                        <td>${record.transaction_type}</td>
                        <td>${record.amount} ${record.currency}</td>
                        <td>${formatDateTime(record.transaction_at)}</td>
                    </tr>
                `).join('');
    
                return mainRow + recordRows;
            }).join('');
    
            const customerHtml = `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                            }
                            h1 {
                                color: #333;
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-bottom: 20px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 12px 8px;
                                font-size: 14px;
                            }
                            th {
                                background-color: #f5f5f5;
                                font-weight: bold;
                                text-align: left;
                            }
                            .customer-row {
                                background-color: #fff;
                            }
                            .record-row {
                                background-color: #f9f9f9;
                            }
                            .record-row td {
                                border-top: none;
                            }
                            .empty-cell {
                                border: none;
                                background-color: #f9f9f9;
                            }
                            td:nth-child(4), td:nth-child(5) {  /* Transaction type and Amount columns */
                                white-space: nowrap;
                            }
                            @media print {
                                body { margin: 0; }
                                table { page-break-inside: auto; }
                                tr { page-break-inside: avoid; }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Customer Transaction History</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Transaction Type</th>
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
    
            const { uri } = await Print.printToFileAsync({
                html: customerHtml,
                base64: false
            });
    
            await Sharing.shareAsync(uri, {
                dialogTitle: 'Customer Transaction History',
                mimeType: 'application/pdf',
                UTI: 'com.adobe.pdf'
            });
    
        } catch (error) {
            console.error("Error generating PDF:", error);
            showToast('Failed to generate PDF');
        }
    };
    
    return (
        <>
            <View style={styles.container}>
                
                <View style={styles.searchContainer}>
                    
                    <Search  size={20} color="#64748B" style={styles.icon}/>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        value={currentSearchTerm}
                        onChangeText={text => handleSearchCustomers(text)}
                    />
                </View>

                <View style={styles.sort_and_pdf_container}>
                    <Pressable onPress={() => setSortModalVisible(true)}>
                        <ArrowUpDown size={24} color="black" style={styles.icon}/>
                    </Pressable>

                    <Pressable onPress={ () => convertQueryResultToPdf()}>
                        <FileDown size={24} color="black" style={styles.icon}/>
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
        backgroundColor: "#f8f9fa",
        padding: 3,
        borderRadius: 10,
    },

    icon: {
        marginRight: 10,
        color: "black",
        backgroundColor: "white", // the bg-color
        borderRadius: 50,
        padding: 8
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
        columnGap: 10
    },

    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 5,
    },
});
