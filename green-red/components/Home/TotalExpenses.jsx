import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import Flag from "react-native-flags";
import { options } from "../../utils/currencies_arr";

// Short format for large numbers (e.g., 2.5K, 1.2M, etc.)
const formatAmount = (amount) => {
    if (amount === 0) return "0";
    const absAmount = Math.abs(amount);
    if (absAmount >= 1_000_000_000) return (absAmount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + "B";
    if (absAmount >= 1_000_000) return (absAmount / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
    if (absAmount >= 1_000) return (absAmount / 1_000).toFixed(1).replace(/\.0$/, '') + "K";
    return absAmount % 1 === 0 ? absAmount.toString() : absAmount.toFixed(2);
};

// Full number with comma separators (e.g., 25,400.50)
const formatFullAmount = (amount) =>
    new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);

export default function TotalExpenses({
    totalAmountToGive,
    totalAmountToTake,
    currency,
}) {
    const netAmount = totalAmountToTake - totalAmountToGive;
    const balanceColor = netAmount > 0 ? "#38A169" : "#E53E3E";
    const paid_or_receive = netAmount > 0 ? "Must Receive" : "Must Pay";

    const currencyInfo = options.find((option) => option.value === currency);
    const currencySymbol = currencyInfo?.symbol || currency;
    const countryCode = currencyInfo?.countryCode || "EU";

    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <View style={[styles.iconContainer, styles.paidIcon]}>
                    <Feather name="arrow-up-right" size={20} color="#E46C62" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>You Paid</Text>
                    <Text style={[styles.amount, styles.paidAmount]}>
                        {formatAmount(totalAmountToTake)} 
                        &nbsp;
                        
                        {totalAmountToTake >= 1000 && (
                            <Text style={styles.fullAmount}>
                                ({formatFullAmount(totalAmountToTake)})
                            </Text>
                        )}
                        &nbsp;
                        {currencySymbol}
                    </Text>
                    
                </View>
            </View>

            <View style={[styles.item, styles.receivedItem]}>
                <View style={[styles.iconContainer, styles.receivedIcon]}>
                    <Feather name="arrow-down-left" size={20} color="#62B485" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>You Received</Text>
                    <Text style={[styles.amount, styles.receivedAmount]}>
                        {formatAmount(totalAmountToGive)} 
                         &nbsp;
                        {totalAmountToGive >= 1000 && (
                            <Text style={styles.fullAmount}>
                                ({formatFullAmount(totalAmountToGive)} {currency})
                            </Text>
                        )}
                        &nbsp;
                        {currencySymbol}
                    </Text>
                    
                </View>
            </View>

            <View style={styles.separator} />
            <View style={styles.balanceContainer}>
                <View style={styles.flagWrapper}>
                    <Flag code={countryCode} size={32} />
                </View>

                <Text style={styles.balanceLabel}>{paid_or_receive}:</Text>
                
                <View style={styles.netAmountColumn}>
                
                <Text style={[styles.netAmount, { color: balanceColor }]}>
                    {formatAmount(Math.abs(netAmount))} {currencySymbol}
                </Text>
                
                {Math.abs(netAmount) >= 1000 && (
                    <Text style={[styles.fullAmount, { color: balanceColor }]}>
                    {formatFullAmount(Math.abs(netAmount))} {currency}
                    </Text>
                )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
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
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        color: "#718096",
        fontWeight: "500",
        marginBottom: 2,
    },
    amount: {
        fontSize: 14,
        fontWeight: "600",
    },
    paidAmount: {
        color: "#E46C62",
    },
    receivedAmount: {
        color: "#62B485",
    },
    fullAmount: {
        fontSize: 11,
        color: "#A0AEC0",
        fontWeight: "400",
        marginTop: 2,
        fontStyle: "italic",
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
        fontSize: 14,
        fontWeight: "700",
        flexDirection: 'column',   // stack vertically
        alignItems: 'flex-start',  // align left, if you like
    },
});
