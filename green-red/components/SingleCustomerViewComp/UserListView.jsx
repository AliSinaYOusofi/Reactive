import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import ShowTransactionDetailsModal from "./ShowTransactionDetailsModal";
import DeleteRecordModal from "../global/DeleteRecordModal";
import EditCustomerRecordModal from "../global/EditCustomerRecordModal";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import useListAnimation from "../animations/useListAnimation";
import useDeleteAnimation from "../animations/useDeleteAnimation";
import { Trash2, Edit3 } from "lucide-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { padi_color, received_color } from "../global/colors";

const { width } = Dimensions.get("window");

export default function UserListView({
    username,
    amount,
    currency,
    transaction_type,
    transaction_date,
    record_id,
    index = 1,
    onDelete,
}) {
    const [detailsModal, setDetailsModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    // reuse your list + delete animations
    const { opacity: listOpacity, translateY } = useListAnimation(index);
    const {
        opacity: deleteOpacity,
        translateX,
        height,
        animateDelete,
    } = useDeleteAnimation();

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: deleteOpacity.value * listOpacity.value,
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
        ],
        height: height.value,
    }));

    const handleDelete = () => {
        animateDelete();
        setTimeout(() => {
            setDeleteModal(false);
            onDelete?.(record_id);
        }, 300);
    };

    return (
        <>
            <Animated.View style={[styles.container, animatedStyle]}>
                {/* MAIN CONTENT */}
                <TouchableOpacity
                    onPress={() => setDetailsModal(true)}
                    style={styles.pressable}
                    activeOpacity={0.8}
                >
                    <View style={styles.mainRow}>
                        {/* Avatar */}
                        <View
                            style={[
                                styles.avatar,
                                {
                                    backgroundColor: transaction_type === "received" ? received_color : padi_color,
                                },
                            ]}
                        >
                            <Text style={styles.avatarText}>
                                {currency.substring(0, 2).toUpperCase()}
                            </Text>
                        </View>

                        {/* Username & Amount */}
                        <View style={styles.textBlock}>
                            <Text style={styles.amount}>
                                {amount} {currency}
                            </Text>
                        </View>

                        {/* Chevron */}
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color="#999"
                        />
                    </View>
                </TouchableOpacity>

                {/* ACTIONS */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() => setEditModal(true)}
                        style={styles.iconBtn}
                        activeOpacity={0.7}
                    >
                        <Edit3 size={18} color="#333333" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDeleteModal(true)}
                        style={styles.iconBtn}
                        activeOpacity={0.7}
                    >
                        <Trash2 size={18} color="#333" />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* DETAILS MODAL */}
            <Modal
                visible={detailsModal}
                animationType="slide"
                transparent
                onRequestClose={() => setDetailsModal(false)}
            >
                <ShowTransactionDetailsModal
                    username={username}
                    amount={amount}
                    currency={currency}
                    transaction_type={transaction_type}
                    transaction_date={transaction_date}
                    closeModal={setDetailsModal}
                />
            </Modal>

            {/* DELETE MODAL */}
            <Modal
                visible={deleteModal}
                animationType="slide"
                transparent
                onRequestClose={() => setDeleteModal(false)}
            >
                <DeleteRecordModal
                    username={username}
                    customer_id={record_id}
                    setCloseModal={setDeleteModal}
                    message={`All data related to ${username} will be deleted!`}
                    onConfirmDelete={handleDelete}
                />
            </Modal>

            {/* EDIT MODAL */}
            <Modal
                visible={editModal}
                animationType="slide"
                transparent
                onRequestClose={() => setEditModal(false)}
            >
                <EditCustomerRecordModal
                    username={username}
                    setUpdateRecordModal={setEditModal}
                    record_id={record_id}
                    amount={amount}
                    currency={currency}
                    transaction_type={transaction_type}
                />
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        marginVertical: 6,
        borderRadius: 12,
        width: width - 30,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E8E8E8",
    },
    pressable: {
        flex: 1,
    },
    mainRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontWeight: "700",
    },
    textBlock: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#212121",
        marginBottom: 2,
    },
    amount: {
        fontSize: 14,
        color: "#666",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingLeft: 12,
        borderLeftWidth: 1,
        borderLeftColor: "#F0F0F0",
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E8E8E8",
    },
});
