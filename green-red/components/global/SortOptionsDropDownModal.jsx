import React from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ArrowDown, X } from 'lucide-react-native';

export default function SortOptionsDropDownModal({ setSelected, selected, setCloseSortMOdal }) {

    const options = [
        { label: 'Alphabetical (ascending)', value: 'ASC ALPHA' },
        { label: 'Alphabetical (descending)', value: 'DESC ALPHA' },
        { label: 'Newest Customer Added', value: 'NEWEST' },
        { label: 'Oldest Customer Added', value: 'OLDEST' },
    ];

    const placeholder = {
        label: 'Select sort options',
        value: null,
    };

    const selectStyles = {
        inputIOS: { color: 'white', paddingRight: 30 },
        inputAndroid: { color: 'white', paddingRight: 30 },
        iconContainer: { top: 15, right: 12 },
    };

    return (
        <View style={styles.modalContainer}>
            <View style={[styles.drop_down_container]}>
                <View style={styles.dropdown_}>
                    <RNPickerSelect
                        placeholder={placeholder}
                        onValueChange={(value) => setSelected(value)}
                        items={options}
                        value={selected}
                        style={selectStyles}
                        textInputProps={{ color: 'white' }}
                        Icon={() => <ArrowDown size={24} color="white" />}
                    />
                </View>
                <TouchableOpacity onPress={() => setCloseSortMOdal(false)} style={styles.pressable_close}>
                    <X size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
        padding: 10,
    },
    drop_down_container: {
        backgroundColor: '#0f0f0f',
        borderRadius: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 2,
        padding: 15,
    },
    dropdown_: {
        width: '80%',
        color: 'blue',
    },
    pressable_close: {
        padding: 3,
        borderRadius: 50,
        backgroundColor: 'white',
    },
});
