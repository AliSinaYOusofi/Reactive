import React from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function SortOptionsDropDownModal({setSelected, selected, setCloseSortMOdal}) {

    const options = [
        { label: 'Alphabetical (ascending)', value: 'ASC ALPHA' },
        { label: 'Alphabetical (descending)', value: 'DESC ALPHA' },
        { label: 'Newest Customer Added', value: 'NEWEST' },
        { label: 'Oldest Customer Added', value: 'OLDEST' },
    ]
    
    const placeholder = {
        label: 'Select sort options',
        value: null,
    }

    const selectStyles = {
        
        inputIOS: {
            color: 'white',
            paddingRight: 30,
        },
        
        inputAndroid: {
            color: 'white',
            paddingRight: 30,
        },

        iconContainer: {
            top: 15,
            right: 12,
        },
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.drop_down_container}>

                <View style={styles.dropdown_}>
                    <RNPickerSelect
                        placeholder={placeholder}
                        onValueChange={(value) => setSelected(value)}
                        items={options}
                        value={selected}
                        style={selectStyles}

                        textInputProps={{ color: 'white' }}
                        Icon={() => {
                            return <Feather name="arrow-down" size={24} color="white" />
                        }}
                    />
                </View>
                <Pressable 
                        onPress={() => setCloseSortMOdal(false)} 
                        style={styles.pressable_close}
                    >
                        <Ionicons 
                            name="close-outline" 
                            size={24} 
                            color="black" 
                        />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: "relative",
        padding: 10,
    },

    drop_down_container: {
        backgroundColor: "#0f0f0f",
        borderRadius: 5,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 2,
       
    },

    currency_abber: {
        padding: 10,
        marginLeft: 5,
        width: "20%",
        borderLeftColor: "white",
        borderLeftWidth: 1,
        color: 'white'
    },

    dropdown_ : {
        width: "80%",
        color: "blue"
    },
    picker_style: {
        color: 'white'
    },

    pressable_close: {
        padding: 3,
        borderRadius: 50,
        backgroundColor: "white"
    }
})