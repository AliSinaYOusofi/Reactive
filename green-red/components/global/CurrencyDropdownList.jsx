import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import Flag from 'react-native-flags';
import { ChevronDown } from 'lucide-react-native';
import { options } from '../../utils/currencies_arr';



// Assuming `options` is available globally or imported from a constants file
// Example: const options = [{ label: 'US Dollar', value: 'USD', countryCode: 'US' }, ...];


export default function CurrencyDropdownListSearch({setSelected, selected}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef(null);

    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => {
        const isSelected = item.value === selected;
        
        return (
            <TouchableOpacity 
                style={[styles.optionItem, isSelected && styles.selectedOptionItem]} 
                onPress={() => {
                    setSelected(item.value);
                    setModalVisible(false);
                    setSearchQuery('');
                }}
            >
                <View style={styles.flagContainer}>
                    <Flag
                        code={item.countryCode}
                        size={24}
                    />
                </View>
                <View style={styles.currencyInfoContainer}>
                    <Text style={styles.currencyName}>{item.label}</Text>
                    <Text style={styles.currencyCode}>{item.value}</Text>
                </View>
                {isSelected && (
                    <View style={styles.checkmarkContainer}>
                        <View style={styles.checkmark} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => {
                    setModalVisible(true);
                    setTimeout(() => inputRef.current?.focus(), 100);
                }}
            >
                {selected ? (
                    <View style={styles.selectedItem}>
                        <Flag
                            code={options.find(option => option.value === selected).countryCode}
                            size={32}
                        />
                        <View style={styles.selectedTextContainer}>
                            <Text style={styles.selectedLabel}>
                                {options.find(option => option.value === selected).label}
                            </Text>
                            <Text style={styles.selectedValue}>{selected}</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.placeholderText}>Select a currency</Text>
                )}
                <ChevronDown size={20} color="#4A5568" />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Currency</Text>
                        </View>
                        
                        <View style={styles.searchContainer}>
                            <TextInput
                                ref={inputRef}
                                style={styles.searchInput}
                                placeholder="Search currency..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#A0AEC0"
                            />
                            <TouchableOpacity 
                                style={styles.closeButton} 
                                onPress={() => {
                                    setModalVisible(false);
                                    setSearchQuery('');
                                }}
                            >
                                <Text style={styles.closeButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {filteredOptions.length > 0 ? (
                            <FlatList
                                data={filteredOptions}
                                renderItem={renderItem}
                                keyExtractor={item => item.value}
                                style={styles.optionsList}
                                initialNumToRender={15}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>No currencies found</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: "#EDF2F7",
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: "#EDF2F7",
        padding: 20,
        width: "100%",
        borderRadius: 20,
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectedTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    selectedLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 2,
    },
    selectedValue: {
        fontSize: 14,
        color: '#718096',
    },
    placeholderText: {
        color: '#A0AEC0',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        overflow: 'hidden',
    },
    modalHeader: {
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3748',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    searchInput: {
        flex: 1,
        height: 48,
        backgroundColor: '#F7FAFC',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#2D3748',
        marginRight: 12,
    },
    closeButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#EDF2F7',
    },
    closeButtonText: {
        color: '#4A5568',
        fontWeight: '600',
        fontSize: 14,
    },
    optionsList: {
        flex: 1,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    selectedOptionItem: {
        backgroundColor: '#EBF8FF',
    },
    flagContainer: {
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    currencyInfoContainer: {
        flex: 1,
    },
    currencyName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2D3748',
    },
    currencyCode: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
    },
    checkmarkContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4299E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: 10,
        height: 5,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#EDF2F7",
        transform: [{ rotate: '-45deg' }],
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: '#A0AEC0',
    }
});
