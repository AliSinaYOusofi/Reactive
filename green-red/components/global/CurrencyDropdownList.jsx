import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import Flag from 'react-native-flags';
import { ChevronDown } from 'lucide-react-native';

export const options = [
    { label: 'Afghan afghani', value: 'AFN', countryCode: 'AF' },
    { label: 'Albanian lek', value: 'ALL', countryCode: 'AL' },
    { label: 'Algerian dinar', value: 'DZD', countryCode: 'DZ' },
    { label: 'Angolan kwanza', value: 'AOA', countryCode: 'AO' },
    { label: 'Argentine peso', value: 'ARS', countryCode: 'AR' },
    { label: 'Armenian dram', value: 'AMD', countryCode: 'AM' },
    { label: 'Aruban florin', value: 'AWG', countryCode: 'AW' },
    { label: 'Australian dollar', value: 'AUD', countryCode: 'AU' },
    { label: 'Azerbaijani manat', value: 'AZN', countryCode: 'AZ' },
    { label: 'Bahraini dinar', value: 'BHD', countryCode: 'BH' },
    { label: 'Bangladeshi taka', value: 'BDT', countryCode: 'BD' },
    { label: 'Barbadian dollar', value: 'BBD', countryCode: 'BB' },
    { label: 'Belarusian ruble', value: 'BYN', countryCode: 'BY' },
    { label: 'Belize dollar', value: 'BZD', countryCode: 'BZ' },
    { label: 'Bermudian dollar', value: 'BMD', countryCode: 'BM' },
    { label: 'Bhutanese ngultrum', value: 'BTN', countryCode: 'BT' },
    { label: 'Bolivian boliviano', value: 'BOB', countryCode: 'BO' },
    { label: 'Bosnia and Herzegovina convertible mark', value: 'BAM', countryCode: 'BA' },
    { label: 'Botswana pula', value: 'BWP', countryCode: 'BW' },
    { label: 'Brazilian real', value: 'BRL', countryCode: 'BR' },
    { label: 'British pound', value: 'GBP', countryCode: 'GB' },
    { label: 'Brunei dollar', value: 'BND', countryCode: 'BN' },
    { label: 'Burundian franc', value: 'BIF', countryCode: 'BI' },
    { label: 'Cambodian riel', value: 'KHR', countryCode: 'KH' },
    { label: 'Canadian dollar', value: 'CAD', countryCode: 'CA' },
    { label: 'Cape Verdean escudo', value: 'CVE', countryCode: 'CV' },
    { label: 'Cayman Islands dollar', value: 'KYD', countryCode: 'KY' },
    { label: 'Central African CFA franc', value: 'XAF', countryCode: 'CF' },
    { label: 'CFP franc', value: 'XPF', countryCode: 'PF' },
    { label: 'Chilean peso', value: 'CLP', countryCode: 'CL' },
    { label: 'Chinese yuan', value: 'CNY', countryCode: 'CN' },
    { label: 'Colombian peso', value: 'COP', countryCode: 'CO' },
    { label: 'Comorian franc', value: 'KMF', countryCode: 'KM' },
    { label: 'Congolese franc', value: 'CDF', countryCode: 'CD' },
    { label: 'Costa Rican colón', value: 'CRC', countryCode: 'CR' },
    { label: 'Croatian kuna', value: 'HRK', countryCode: 'HR' },
    { label: 'Cuban convertible peso', value: 'CUC', countryCode: 'CU' },
    { label: 'Cuban peso', value: 'CUP', countryCode: 'CU' },
    { label: 'Czech koruna', value: 'CZK', countryCode: 'CZ' },
    { label: 'Danish krone', value: 'DKK', countryCode: 'DK' },
    { label: 'Dominican peso', value: 'DOP', countryCode: 'DO' },
    { label: 'Djiboutian franc', value: 'DJF', countryCode: 'DJ' },
    { label: 'Eastern Caribbean dollar', value: 'XCD', countryCode: 'AG' },
    { label: 'Egyptian pound', value: 'EGP', countryCode: 'EG' },
    { label: 'Eritrean nakfa', value: 'ERN', countryCode: 'ER' },
    { label: 'Ethiopian birr', value: 'ETB', countryCode: 'ET' },
    { label: 'Euro', value: 'EUR', countryCode: 'EU' },
    { label: 'Falkland Islands pound', value: 'FKP', countryCode: 'FK' },
    { label: 'Fijian dollar', value: 'FJD', countryCode: 'FJ' },
    { label: 'Gambian dalasi', value: 'GMD', countryCode: 'GM' },
    { label: 'Georgian lari', value: 'GEL', countryCode: 'GE' },
    { label: 'Ghanaian cedi', value: 'GHS', countryCode: 'GH' },
    { label: 'Gibraltar pound', value: 'GIP', countryCode: 'GI' },
    { label: 'Guatemalan quetzal', value: 'GTQ', countryCode: 'GT' },
    { label: 'Guernsey pound', value: 'GGP', countryCode: 'GG' },
    { label: 'Guinean franc', value: 'GNF', countryCode: 'GN' },
    { label: 'Guyanese dollar', value: 'GYD', countryCode: 'GY' },
    { label: 'Haitian gourde', value: 'HTG', countryCode: 'HT' },
    { label: 'Honduran lempira', value: 'HNL', countryCode: 'HN' },
    { label: 'Hong Kong dollar', value: 'HKD', countryCode: 'HK' },
    { label: 'Hungarian forint', value: 'HUF', countryCode: 'HU' },
    { label: 'Icelandic króna', value: 'ISK', countryCode: 'IS' },
    { label: 'Indian rupee', value: 'INR', countryCode: 'IN' },
    { label: 'Indonesian rupiah', value: 'IDR', countryCode: 'ID' },
    { label: 'Iranian rial', value: 'IRR', countryCode: 'IR' },
    { label: 'Iraqi dinar', value: 'IQD', countryCode: 'IQ' },
    { label: 'Israeli new shekel', value: 'ILS', countryCode: 'IL' },
    { label: 'Jamaican dollar', value: 'JMD', countryCode: 'JM' },
    { label: 'Japanese yen', value: 'JPY', countryCode: 'JP' },
    { label: 'Jersey pound', value: 'JEP', countryCode: 'JE' },
    { label: 'Jordanian dinar', value: 'JOD', countryCode: 'JO' },
    { label: 'Kazakhstani tenge', value: 'KZT', countryCode: 'KZ' },
    { label: 'Kenyan shilling', value: 'KES', countryCode: 'KE' },
    { label: 'Kiribati dollar', value: 'KID', countryCode: 'KI' },
    { label: 'Kyrgyzstani som', value: 'KGS', countryCode: 'KG' },
    { label: 'Kuwaiti dinar', value: 'KWD', countryCode: 'KW' },
    { label: 'Lao kip', value: 'LAK', countryCode: 'LA' },
    { label: 'Lebanese pound', value: 'LBP', countryCode: 'LB' },
    { label: 'Lesotho loti', value: 'LSL', countryCode: 'LS' },
    { label: 'Liberian dollar', value: 'LRD', countryCode: 'LR' },
    { label: 'Libyan dinar', value: 'LYD', countryCode: 'LY' },
    { label: 'Macanese pataca', value: 'MOP', countryCode: 'MO' },
    { label: 'Macedonian denar', value: 'MKD', countryCode: 'MK' },
    { label: 'Malagasy ariary', value: 'MGA', countryCode: 'MG' },
    { label: 'Malawian kwacha', value: 'MWK', countryCode: 'MW' },
    { label: 'Malaysian ringgit', value: 'MYR', countryCode: 'MY' },
    { label: 'Maldivian rufiyaa', value: 'MVR', countryCode: 'MV' },
    { label: 'Manx pound', value: 'IMP', countryCode: 'IM' },
    { label: 'Mauritanian ouguiya', value: 'MRU', countryCode: 'MR' },
    { label: 'Mauritian rupee', value: 'MUR', countryCode: 'MU' },
    { label: 'Mexican peso', value: 'MXN', countryCode: 'MX' },
    { label: 'Moldovan leu', value: 'MDL', countryCode: 'MD' },
    { label: 'Mongolian tögrög', value: 'MNT', countryCode: 'MN' },
    { label: 'Moroccan dirham', value: 'MAD', countryCode: 'MA' },
    { label: 'Mozambican metical', value: 'MZN', countryCode: 'MZ' },
    { label: 'Namibian dollar', value: 'NAD', countryCode: 'NA' },
    { label: 'Nepalese rupee', value: 'NPR', countryCode: 'NP' },
    { label: 'Netherlands Antillean guilder', value: 'ANG', countryCode: 'AN' },
    { label: 'New Taiwan dollar', value: 'TWD', countryCode: 'TW' },
    { label: 'New Zealand dollar', value: 'NZD', countryCode: 'NZ' },
    { label: 'Nicaraguan córdoba', value: 'NIO', countryCode: 'NI' },
    { label: 'Nigerian naira', value: 'NGN', countryCode: 'NG' },
    { label: 'North Korean won', value: 'KPW', countryCode: 'KP' },
    { label: 'Norwegian krone', value: 'NOK', countryCode: 'NO' },
    { label: 'Omani rial', value: 'OMR', countryCode: 'OM' },
    { label: 'Pakistani rupee', value: 'PKR', countryCode: 'PK' },
    { label: 'Panamanian balboa', value: 'PAB', countryCode: 'PA' },
    { label: 'Papua New Guinean kina', value: 'PGK', countryCode: 'PG' },
    { label: 'Paraguayan guaraní', value: 'PYG', countryCode: 'PY' },
    { label: 'Peruvian sol', value: 'PEN', countryCode: 'PE' },
    { label: 'Philippine peso', value: 'PHP', countryCode: 'PH' },
    { label: 'Polish złoty', value: 'PLN', countryCode: 'PL' },
    { label: 'Qatari riyal', value: 'QAR', countryCode: 'QA' },
    { label: 'Romanian leu', value: 'RON', countryCode: 'RO' },
    { label: 'Russian ruble', value: 'RUB', countryCode: 'RU' },
    { label: 'Rwandan franc', value: 'RWF', countryCode: 'RW' },
    { label: 'Saint Helena pound', value: 'SHP', countryCode: 'SH' },
    { label: 'Samoan tālā', value: 'WST', countryCode: 'WS' },
    { label: 'São Tomé and Príncipe dobra', value: 'STN', countryCode: 'ST' },
    { label: 'Saudi riyal', value: 'SAR', countryCode: 'SA' },
    { label: 'Serbian dinar', value: 'RSD', countryCode: 'RS' },
    { label: 'Sierra Leonean leone', value: 'SLL', countryCode: 'SL' },
    { label: 'Singapore dollar', value: 'SGD', countryCode: 'SG' },
    { label: 'Somali shilling', value: 'SOS', countryCode: 'SO' },
    { label: 'Somaliland shilling', value: 'SLS', countryCode: 'SO' },
    { label: 'South African rand', value: 'ZAR', countryCode: 'ZA' },
    { label: 'South Korean won', value: 'KRW', countryCode: 'KR' },
    { label: 'South Sudanese pound', value: 'SSP', countryCode: 'SS' },
    { label: 'Surinamese dollar', value: 'SRD', countryCode: 'SR' },
    { label: 'Swedish krona', value: 'SEK', countryCode: 'SE' },
    { label: 'Swiss franc', value: 'CHF', countryCode: 'CH' },
    { label: 'Sri Lankan rupee', value: 'LKR', countryCode: 'LK' },
    { label: 'Swazi lilangeni', value: 'SZL', countryCode: 'SZ' },
    { label: 'Syrian pound', value: 'SYP', countryCode: 'SY' },
    { label: 'Tajikistani somoni', value: 'TJS', countryCode: 'TJ' },
    { label: 'Tanzanian shilling', value: 'TZS', countryCode: 'TZ' },
    { label: 'Thai baht', value: 'THB', countryCode: 'TH' },
    { label: 'Tongan paʻanga', value: 'TOP', countryCode: 'TO' },
    { label: 'Transnistrian ruble', value: 'PRB', countryCode: 'MD' },
    { label: 'Trinidad and Tobago dollar', value: 'TTD', countryCode: 'TT' },
    { label: 'Tunisian dinar', value: 'TND', countryCode: 'TN' },
    { label: 'Turkish lira', value: 'TRY', countryCode: 'TR' },
    { label: 'Turkmenistan manat', value: 'TMT', countryCode: 'TM' },
    { label: 'Tuvaluan dollar', value: 'TVD', countryCode: 'TV' },
    { label: 'Ugandan shilling', value: 'UGX', countryCode: 'UG' },
    { label: 'Ukrainian hryvnia', value: 'UAH', countryCode: 'UA' },
    { label: 'United Arab Emirates dirham', value: 'AED', countryCode: 'AE' },
    { label: 'United States dollar', value: 'USD', countryCode: 'US' },
    { label: 'Uruguayan peso', value: 'UYU', countryCode: 'UY' },
    { label: 'Uzbekistani soʻm', value: 'UZS', countryCode: 'UZ' },
    { label: 'Vanuatu vatu', value: 'VUV', countryCode: 'VU' },
    { label: 'Venezuelan bolívar soberano', value: 'VES', countryCode: 'VE' },
    { label: 'Vietnamese đồng', value: 'VND', countryCode: 'VN' },
    { label: 'West African CFA franc', value: 'XOF', countryCode: 'SN' },
    { label: 'Zambian kwacha', value: 'ZMW', countryCode: 'ZM' },
    { label: 'Zimbabwean bonds', value: 'ZWB', countryCode: 'ZW' }
];

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
        backgroundColor:'white'
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
        elevation: 2,
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
