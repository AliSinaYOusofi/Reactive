import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import SortOptionsDropDownModal from '../global/SortOptionsDropDownModal';
import { parseISO } from 'date-fns';

export default function SearchCustomers({handleSearch, setCustomers}) {
    
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState('NEWEST')

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


    const handlePdf = () => {

    }


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

                    <Pressable>
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
