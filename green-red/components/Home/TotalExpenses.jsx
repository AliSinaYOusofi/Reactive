import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import Flag from "react-native-flags";
import { options } from "../../utils/currencies_arr";

export default function TotalExpenses({
    totalAmountToGive,
    totalAmountToTake,
    currency,
}) {
    const netAmount = totalAmountToTake - totalAmountToGive;
    const balanceSign = netAmount > 0 ? "+" : "-";
    const balanceColor = netAmount > 0 ? "#38A169" : "#E53E3E";
    const paid_or_receive = netAmount > 0 ? "Must Receive" : "Must Pay";

    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <View style={[styles.iconContainer, styles.paidIcon]}>
                    <ArrowUpRight size={20} color="#E46C62" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>You Paid</Text>
                    <Text style={[styles.amount, styles.paidAmount]}>
                        {totalAmountToTake} {currency}
                    </Text>
                </View>
            </View>

            <View style={[styles.item, styles.receivedItem]}>
                <View style={[styles.iconContainer, styles.receivedIcon]}>
                    <ArrowDownLeft size={20} color="#62B485" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>You Received</Text>
                    <Text style={[styles.amount, styles.receivedAmount]}>
                        {totalAmountToGive} {currency}
                    </Text>
                </View>
            </View>

            <View style={styles.separator} />
            <View style={styles.balanceContainer}>
                <View style={styles.flagWrapper}>
                    <Flag
                        code={options.find((option) => option.value === currency)?.countryCode || "EU"}
                        size={32}
                    />
                </View>
                <Text style={styles.balanceLabel}>{paid_or_receive}:</Text>
                <Text style={[styles.netAmount, { color: balanceColor }]}>
                    {balanceSign}
                    {Math.abs(netAmount)} {currency}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 20,
        width: "90%",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#EDF2F7",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        
    },
    
    iconContainer: {
        padding: 10,
        borderRadius: 12,
        marginRight: 16,
    },
    paidIcon: {
        backgroundColor: "rgba(228, 108, 98, 0.15)",
    },
    receivedIcon: {
        backgroundColor: "rgba(98, 180, 133, 0.15)",
    },
    textContainer: {
        flex: 1,
        marginTop: 5
    },
    label: {
        fontSize: 14,
        color: "#718096",
        fontWeight: "500",
        marginBottom: 2,
    },
    amount: {
        fontSize: 18,
        fontWeight: "600",
    },
    paidAmount: {
        color: "#E46C62",
    },
    receivedAmount: {
        color: "#62B485",
    },
    separator: {
        height: 1,
        backgroundColor: "#EDF2F7",
        marginVertical: 16,
    },
    balanceContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    flagWrapper: {
        backgroundColor: "#F7FAFC",
        borderRadius: 8,
        marginRight: 12,
    },
    balanceLabel: {
        fontSize: 16,
        color: "#718096",
        fontWeight: "500",
        marginRight: 8,
    },
    netAmount: {
        fontSize: 18,
        fontWeight: "700",
        
    },
});