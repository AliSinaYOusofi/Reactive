import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function CurrencyDropdownListSearch({setSelected, selected}) {
    const options = [
        { label: 'Afghan afghani', value: 'AFN' },
        { label: 'Albanian lek', value: 'ALL' },
        { label: 'Algerian dinar', value: 'DZD' },
        { label: 'Angolan kwanza', value: 'AOA' },
        { label: 'Argentine peso', value: 'ARS' },
        { label: 'Armenian dram', value: 'AMD' },
        { label: 'Aruban florin', value: 'AWG' },
        { label: 'Australian dollar', value: 'AUD' },
        { label: 'Azerbaijani manat', value: 'AZN' },
        { label: 'Bahraini dinar', value: 'BHD' },
        { label: 'Bangladeshi taka', value: 'BDT' },
        { label: 'Barbadian dollar', value: 'BBD' },
        { label: 'Belarusian ruble', value: 'BYN' },
        { label: 'Belize dollar', value: 'BZD' },
        { label: 'Bermudian dollar', value: 'BMD' },
        { label: 'Bhutanese ngultrum', value: 'BTN' },
        { label: 'Bolivian boliviano', value: 'BOB' },
        { label: 'Bosnia and Herzegovina convertible mark', value: 'BAM' },
        { label: 'Botswana pula', value: 'BWP' },
        { label: 'Brazilian real', value: 'BRL' },
        { label: 'British pound', value: 'GBP' },
        { label: 'Brunei dollar', value: 'BND' },
        { label: 'Burundian franc', value: 'BIF' },
        { label: 'Cambodian riel', value: 'KHR' },
        { label: 'Canadian dollar', value: 'CAD' },
        { label: 'Cape Verdean escudo', value: 'CVE' },
        { label: 'Cayman Islands dollar', value: 'KYD' },
        { label: 'Central African CFA franc', value: 'XAF' },
        { label: 'CFP franc', value: 'XPF' },
        { label: 'Chilean peso', value: 'CLP' },
        { label: 'Chinese yuan', value: 'CNY' },
        { label: 'Colombian peso', value: 'COP' },
        { label: 'Comorian franc', value: 'KMF' },
        { label: 'Congolese franc', value: 'CDF' },
        { label: 'Costa Rican colón', value: 'CRC' },
        { label: 'Croatian kuna', value: 'HRK' },
        { label: 'Cuban convertible peso', value: 'CUC' },
        { label: 'Cuban peso', value: 'CUP' },
        { label: 'Czech koruna', value: 'CZK' },
        { label: 'Danish krone', value: 'DKK' },
        { label: 'Dominican peso', value: 'DOP' },
        { label: 'Djiboutian franc', value: 'DJF' },
        { label: 'Eastern Caribbean dollar', value: 'XCD' },
        { label: 'Egyptian pound', value: 'EGP' },
        { label: 'Eritrean nakfa', value: 'ERN' },
        { label: 'Ethiopian birr', value: 'ETB' },
        { label: 'Euro', value: 'EUR' },
        { label: 'Falkland Islands pound', value: 'FKP' },
        { label: 'Fijian dollar', value: 'FJD' },
        { label: 'Gambian dalasi', value: 'GMD' },
        { label: 'Georgian lari', value: 'GEL' },
        { label: 'Ghanaian cedi', value: 'GHS' },
        { label: 'Gibraltar pound', value: 'GIP' },
        { label: 'Guatemalan quetzal', value: 'GTQ' },
        { label: 'Guernsey pound', value: 'GGP' },
        { label: 'Guinean franc', value: 'GNF' },
        { label: 'Guyanese dollar', value: 'GYD' },
        { label: 'Haitian gourde', value: 'HTG' },
        { label: 'Honduran lempira', value: 'HNL' },
        { label: 'Hong Kong dollar', value: 'HKD' },
        { label: 'Hungarian forint', value: 'HUF' },
        { label: 'Icelandic króna', value: 'ISK' },
        { label: 'Indian rupee', value: 'INR' },
        { label: 'Indonesian rupiah', value: 'IDR' },
        { label: 'Iranian rial', value: 'IRR' },
        { label: 'Iraqi dinar', value: 'IQD' },
        { label: 'Israeli new shekel', value: 'ILS' },
        { label: 'Jamaican dollar', value: 'JMD' },
        { label: 'Japanese yen', value: 'JPY' },
        { label: 'Jersey pound', value: 'JEP' },
        { label: 'Jordanian dinar', value: 'JOD' },
        { label: 'Kazakhstani tenge', value: 'KZT' },
        { label: 'Kenyan shilling', value: 'KES' },
        { label: 'Kiribati dollar', value: 'KID' },
        { label: 'Kyrgyzstani som', value: 'KGS' },
        { label: 'Kuwaiti dinar', value: 'KWD' },
        { label: 'Lao kip', value: 'LAK' },
        { label: 'Lebanese pound', value: 'LBP' },
        { label: 'Lesotho loti', value: 'LSL' },
        { label: 'Liberian dollar', value: 'LRD' },
        { label: 'Libyan dinar', value: 'LYD' },
        { label: 'Macanese pataca', value: 'MOP' },
        { label: 'Macedonian denar', value: 'MKD' },
        { label: 'Malagasy ariary', value: 'MGA' },
        { label: 'Malawian kwacha', value: 'MWK' },
        { label: 'Malaysian ringgit', value: 'MYR' },
        { label: 'Maldivian rufiyaa', value: 'MVR' },
        { label: 'Manx pound', value: 'IMP' },
        { label: 'Mauritanian ouguiya', value: 'MRU' },
        { label: 'Mauritian rupee', value: 'MUR' },
        { label: 'Mexican peso', value: 'MXN' },
        { label: 'Moldovan leu', value: 'MDL' },
        { label: 'Mongolian tögrög', value: 'MNT' },
        { label: 'Moroccan dirham', value: 'MAD' },
        { label: 'Mozambican metical', value: 'MZN' },
        { label: 'Namibian dollar', value: 'NAD' },
        { label: 'Nepalese rupee', value: 'NPR' },
        { label: 'Netherlands Antillean guilder', value: 'ANG' },
        { label: 'New Taiwan dollar', value: 'TWD' },
        { label: 'New Zealand dollar', value: 'NZD' },
        { label: 'Nicaraguan córdoba', value: 'NIO' },
        { label: 'Nigerian naira', value: 'NGN' },
        { label: 'North Korean won', value: 'KPW' },
        { label: 'Norwegian krone', value: 'NOK' },
        { label: 'Omani rial', value: 'OMR' },
        { label: 'Pakistani rupee', value: 'PKR' },
        { label: 'Panamanian balboa', value: 'PAB' },
        { label: 'Papua New Guinean kina', value: 'PGK' },
        { label: 'Paraguayan guaraní', value: 'PYG' },
        { label: 'Peruvian sol', value: 'PEN' },
        { label: 'Philippine peso', value: 'PHP' },
        { label: 'Polish złoty', value: 'PLN' },
        { label: 'Qatari riyal', value: 'QAR' },
        { label: 'Romanian leu', value: 'RON' },
        { label: 'Russian ruble', value: 'RUB' },
        { label: 'Rwandan franc', value: 'RWF' },
        { label: 'Saint Helena pound', value: 'SHP' },
        { label: 'Samoan tālā', value: 'WST' },
        { label: 'São Tomé and Príncipe dobra', value: 'STN' },
        { label: 'Saudi riyal', value: 'SAR' },
        { label: 'Serbian dinar', value: 'RSD' },
        { label: 'Sierra Leonean leone', value: 'SLL' },
        { label: 'Singapore dollar', value: 'SGD' },
        { label: 'Somali shilling', value: 'SOS' },
        { label: 'Somaliland shilling', value: 'SLS' },
        { label: 'South African rand', value: 'ZAR' },
        { label: 'South Korean won', value: 'KRW' },
        { label: 'South Sudanese pound', value: 'SSP' },
        { label: 'Surinamese dollar', value: 'SRD' },
        { label: 'Swedish krona', value: 'SEK' },
        { label: 'Swiss franc', value: 'CHF' },
        { label: 'Sri Lankan rupee', value: 'LKR' },
        { label: 'Swazi lilangeni', value: 'SZL' },
        { label: 'Syrian pound', value: 'SYP' },
        { label: 'Tajikistani somoni', value: 'TJS' },
        { label: 'Tanzanian shilling', value: 'TZS' },
        { label: 'Thai baht', value: 'THB' },
        { label: 'Tongan paʻanga', value: 'TOP' },
        { label: 'Transnistrian ruble', value: 'PRB' },
        { label: 'Trinidad and Tobago dollar', value: 'TTD' },
        { label: 'Tunisian dinar', value: 'TND' },
        { label: 'Turkish lira', value: 'TRY' },
        { label: 'Turkmenistan manat', value: 'TMT' },
        { label: 'Tuvaluan dollar', value: 'TVD' },
        { label: 'Ugandan shilling', value: 'UGX' },
        { label: 'Ukrainian hryvnia', value: 'UAH' },
        { label: 'United Arab Emirates dirham', value: 'AED' },
        { label: 'United States dollar', value: 'USD' },
        { label: 'Uruguayan peso', value: 'UYU' },
        { label: 'Uzbekistani soʻm', value: 'UZS' },
        { label: 'Vanuatu vatu', value: 'VUV' },
        { label: 'Venezuelan bolívar soberano', value: 'VES' },
        { label: 'Vietnamese đồng', value: 'VND' },
        { label: 'West African CFA franc', value: 'XOF' },
        { label: 'Zambian kwacha', value: 'ZMW' },
        { label: 'Zimbabwean bonds', value: 'ZWB' }
    ];

    const placeholder = {
        label: 'Select a currency ...',
        value: null,
    };

    return (
        <View style={styles.drop_down_container}>

            <View style={styles.dropdown_}>
                <RNPickerSelect
                    placeholder={placeholder}
                    onValueChange={(value) => setSelected(value)}
                    items={options}
                    value={selected}
                    style={styles.picker_style}
                />
            </View>
            
            <View style={styles.currency_abber}>
                <Text>
                    {
                        selected ? options.filter(item => item.value === selected)[0].value : ""
                    }
                </Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    
    drop_down_container: {
       backgroundColor: "white",
       borderRadius: 10,
       width: "100%",
       flexDirection: "row",
       justifyContent: "center",
       alignItems: "center",
       columnGap: 2
    },

    currency_abber: {
        padding: 10,
        marginLeft: 5,
        width: "20%",
        borderLeftColor: "black",
        borderLeftWidth: 1,
    },

    dropdown_ : {
        width: "80%"
    }
})