import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ArrowDown, X } from 'lucide-react-native';

export default function SortOptionsDropDownModal({ setSelected, selected, setCloseSortMOdal }) {
    const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen

    useEffect(() => {
        // Slide up animation
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const closeModal = () => {
        // Slide down animation before closing
        Animated.timing(slideAnim, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setCloseSortMOdal(false));
    };

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
            <Animated.View style={[styles.drop_down_container, { transform: [{ translateY: slideAnim }] }]}>
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
                <Pressable onPress={closeModal} style={styles.pressable_close}>
                    <X size={24} color="black" />
                </Pressable>
            </Animated.View>
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
