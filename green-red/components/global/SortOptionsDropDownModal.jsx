import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { Feather } from '@expo/vector-icons';

export default function SortOptionsDropDown({
    setSelected,
    selected,
    setCloseSortModal,
}) {
    const options = [
        {
            label: "Alphabetical (ascending)",
            value: "ASC ALPHA",
            icon: "sort-alpha-up",
        },
        {
            label: "Alphabetical (descending)",
            value: "DESC ALPHA",
            icon: "sort-alpha-down",
        },
        { label: "Newest Customer Added", value: "NEWEST", icon: "clock" },
        { label: "Oldest Customer Added", value: "OLDEST", icon: "history" },
    ];

    const handleSelect = (value) => {
        setSelected(value);
        setCloseSortModal(false);
    };

    const renderOption = ({ item }) => {
        const isSelected = selected === item.value;

        return (
            <TouchableOpacity
                style={[styles.optionItem, isSelected && styles.selectedOption]}
                onPress={() => handleSelect(item.value)}
            >
                <View style={styles.optionContent}>
                    <Text
                        style={[
                            styles.optionText,
                            isSelected && styles.selectedOptionText,
                        ]}
                    >
                        {item.label}
                    </Text>
                    {isSelected && (
                        <View style={styles.checkContainer}>
                            <Feather name="check" size={18} color="#4299E1" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    onPress={() => setCloseSortModal(false)}
                />

                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Sort by</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setCloseSortModal(false)}
                        >
                            <Feather name="x" size={20} color="#4A5568" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={options}
                        renderItem={renderOption}
                        keyExtractor={(item) => item.value}
                        style={styles.optionsList}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: "#EDF2F7",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2D3748",
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EDF2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    optionsList: {
        maxHeight: 300,
    },
    optionItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7",
    },
    selectedOption: {
        backgroundColor: "#F7FAFC",
    },
    optionContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionText: {
        fontSize: 16,
        color: "#4A5568",
    },
    selectedOptionText: {
        color: "#2D3748",
        fontWeight: "600",
    },
    checkContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});