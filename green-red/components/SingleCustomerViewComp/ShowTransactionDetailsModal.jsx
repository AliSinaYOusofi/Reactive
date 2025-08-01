import { useState } from "react";
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import { formatDistanceToNowStrict } from "date-fns";
import DateDiffDetails from "./DateDiffDetails";
import * as Clipboard from "expo-clipboard";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ShowTransactionDetailsModal({
    username,
    amount,
    currency,
    transaction_type,
    transaction_date,
    closeModal,
}) {
    const [copied, setCopied] = useState(false);

    const copy_to_clipboard = async () => {
        setCopied(true);
        const content = `${transaction_type.toUpperCase()}
${amount} ${currency}
${transaction_type !== "received" ? "To" : "From"}: ${username}
On: ${transaction_date} ${
            transaction_date
                ? formatDistanceToNowStrict(new Date(transaction_date), {
                      addSuffix: true,
                  })
                : "N/A"
        }`;

        await Clipboard.setStringAsync(content);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        closeModal(false);
    };

    const isReceived = transaction_type === "received";

    return (
        <View style={styles.modalOverlay}>
            {/* Backdrop */}
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={handleClose}
            />

            <Animated.View
                entering={FadeIn.duration(300).delay(100)}
                exiting={FadeOut.duration(300).delay(100)}
                style={styles.modalContainer}
            >
                <Animated.View
                    style={styles.contentContainer}
                    entering={FadeIn.duration(300).delay(100)}
                >
                    {/* Header with Transaction Type */}
                    <Animated.View
                        entering={FadeIn.duration(300).delay(200)}
                        style={styles.headerContainer}
                    >
                        <View
                            style={[
                                styles.typeIconContainer,
                                isReceived
                                    ? styles.receivedIcon
                                    : styles.paidIcon,
                            ]}
                        >
                            <MaterialIcons
                                name={
                                    isReceived
                                        ? "arrow-downward"
                                        : "arrow-upward"
                                }
                                size={28}
                                color="#FFFFFF"
                            />
                        </View>
                        <Text
                            style={[
                                styles.transactionType,
                                { color: isReceived ? "#10B981" : "#EF4444" },
                            ]}
                        >
                            {transaction_type.toUpperCase()}
                        </Text>
                    </Animated.View>

                    {/* Amount Section */}
                    <Animated.View
                        entering={FadeIn.duration(300).delay(300)}
                        style={styles.amountContainer}
                    >
                        <View style={styles.amountRow}>
                            <Text style={styles.amount}>{amount}</Text>
                            <Text style={styles.currency}>{currency}</Text>
                        </View>
                    </Animated.View>

                    {/* Details Section */}
                    <Animated.View
                        entering={FadeIn.duration(300).delay(400)}
                        style={styles.detailsSection}
                    >
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>
                                {transaction_type !== "received"
                                    ? "To"
                                    : "From"}
                                :
                            </Text>
                            <Text style={styles.value}>{username}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Date:</Text>
                            <View style={styles.dateContainer}>
                                {transaction_date ? (
                                    <DateDiffDetails date={transaction_date} />
                                ) : (
                                    <Text style={styles.value}>N/A</Text>
                                )}
                            </View>
                        </View>
                    </Animated.View>

                    {/* Action Buttons */}
                    <Animated.View
                        entering={FadeIn.duration(300).delay(500)}
                        style={styles.actionButtonsContainer}
                    >
                        <TouchableOpacity
                            onPress={copy_to_clipboard}
                            style={styles.actionButton}
                        >
                            {copied ? (
                                <Feather
                                    name="check-circle"
                                    size={20}
                                    color="#10B981"
                                />
                            ) : (
                                <Feather
                                    name="copy"
                                    size={20}
                                    color="#64748B"
                                />
                            )}
                            <Text
                                style={[
                                    styles.actionButtonText,
                                    copied && styles.actionButtonTextSuccess,
                                ]}
                            >
                                {copied ? "Copied!" : "Copy Details"}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Close Button */}
                    <Animated.View
                        style={styles.closeButtonContainer}
                        entering={FadeIn.duration(300).delay(600)}
                    >
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <Feather name="x" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 1000,
    },
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    modalContainer: {
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    
    contentContainer: {
        backgroundColor: "white",
        padding: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: "100%",
        alignItems: "stretch",
        position: "relative",
        shadowColor: "black",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 15,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    typeIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    receivedIcon: {
        backgroundColor: "#10B981",
    },
    paidIcon: {
        backgroundColor: "#EF4444",
    },
    transactionType: {
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: 1,
    },
    amountContainer: {
        alignItems: "center",
        marginBottom: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "center",
    },
    amount: {
        fontSize: 32,
        fontWeight: "800",
        color: "#0F172A",
        marginRight: 8,
    },
    currency: {
        fontSize: 22,
        fontWeight: "600",
        color: "#64748B",
    },
    detailsSection: {
        marginBottom: 30,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#64748B",
        flex: 1,
    },
    value: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0F172A",
        flex: 2,
        textAlign: "right",
    },
    dateContainer: {
        flex: 2,
        alignItems: "flex-end",
    },
    actionButtonsContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        minWidth: 140,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#64748B",
        marginLeft: 8,
    },
    actionButtonTextSuccess: {
        color: "#10B981",
    },
    closeButtonContainer: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
    },
    closeButton: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EDF2F7",
        justifyContent: "center",
        alignItems: "center",
    },
});
