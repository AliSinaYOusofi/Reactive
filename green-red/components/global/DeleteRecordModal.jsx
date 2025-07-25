<<<<<<< HEAD
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    Pressable,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { cancel_button_color, delete_button_color } from "./colors";
import Toast from "react-native-toast-message";
import { useAppContext } from "../../context/useAppContext";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { TrainTrack, X } from "lucide-react-native";
import { supabase } from "../../utils/supabase";
export default function DeleteRecordModal({
    message,
    setCloseModal,
    record_id,
    customer_id,
}) {
    const {
        setRefreshHomeScreenOnChangeDatabase,
        setRefreshSingleViewChangeDatabase,
    } = useAppContext();

    const [saving, setSaving] = useState(false);

    const handleDelete = async () => {
        if (record_id) {
            setSaving(true);
            await deleteByRecoredId();
            setSaving(false);
        } else if (customer_id) {
            setSaving(true);
            await deleteParent();
            setSaving(false);
        }
        setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
        setRefreshSingleViewChangeDatabase((prev) => !prev);
    };

    const handleCancel = () => {
        setCloseModal(false);
    };

    const showToast = (message, type = "error") => {
        Toast.show({
            type: type,
            text1: message,
            position: "top",
            onPress: () => Toast.hide(),
            swipeable: true,
            topOffset: 100,
        });
    };

    const deleteByRecoredId = async () => {
        try {
            const { data, error } = await supabase
                .from("customer_transactions")
                .delete()
                .eq("id", record_id);

            if (error) {
                throw error;
            }

            if (error) {
                showToast("Failed to delete ", "error");
            } else {
                showToast("Record deleted", "success");
            }
        } catch (error) {
            console.error("Failed to delete record", error.message);
            showToast("Failed to delete record");
        } finally {
            setCloseModal(false);
        }
    };

    const deleteParent = async (customerId) => {
        try {
            const { data, error } = await supabase
                .from("customers")
                .delete()
                .eq("id", customer_id);

            if (error) {
                console.error("Error deleting customer:", error);
                showToast("Failed to delete customer", "error");
                return;
            }

            showToast("Customer deleted successfully", "success");

        } catch (error) {
            console.error("Unexpected error while deleting customer:", error);
            showToast("An error occurred while deleting customer", "error");
        }
    };

    return (
        <Animated.View
            entering={FadeIn.duration(300).delay(100)}
            exiting={FadeOut.duration(300).delay(100)}
            style={styles.modalContainer}
        >
            <Animated.View
                style={styles.options_container}
                entering={FadeIn.duration(300).delay(100)}
            >
                <Animated.Text
                    style={styles.texts}
                    entering={FadeIn.duration(300).delay(200)}
                >
                    {message}
                </Animated.Text>

                <Animated.View
                    style={styles.button_container}
                    entering={FadeIn.duration(300).delay(300)}
                >
                    <TouchableOpacity
                        onPress={handleDelete}
                        style={styles.delete_button}
                    >
                        {saving ? (
                            <ActivityIndicator
                                size="small"
                                color="white"
                                style={{
                                    marginLeft: 12,
                                    marginTop: 5,
                                    alighItems: "center",
                                    justifyContent: "center",
                                }}
                            />
                        ) : (
                            <Text style={styles.button_text}>Delete</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={styles.cancel_button}
                    >
                        <Text style={styles.button_text}> Cancel </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    style={[styles.pressable, styles.pressable_close]}
                    entering={FadeIn.duration(300).delay(400)}
                >
                    <TouchableOpacity onPress={() => setCloseModal(false)}>
                        <X size={20} color="black" />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Animated.View>
=======
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    View,
    Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { useAppContext } from "../../context/useAppContext";
import Animated, {
    FadeIn,
    SlideInDown,
    SlideOutDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import { X, AlertTriangle } from "lucide-react-native";
import { supabase } from "../../utils/supabase";

const { width, height } = Dimensions.get("window");

export default function DeleteRecordModal({
    message,
    setCloseModal,
    record_id,
    customer_id,
}) {
    const {
        setRefreshHomeScreenOnChangeDatabase,
        setRefreshSingleViewChangeDatabase,
    } = useAppContext();
    const [saving, setSaving] = useState(false);

    // Animation values for button press feedback
    const cancelScale = useSharedValue(1);
    const deleteScale = useSharedValue(1);

    const cancelAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cancelScale.value }],
    }));

    const deleteAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: deleteScale.value }],
    }));

    const handleDelete = async () => {
        console.log("Delete button pressed");

        // Button press animation
        deleteScale.value = withSpring(
            0.95,
            { damping: 15, stiffness: 300 },
            () => {
                deleteScale.value = withSpring(1, {
                    damping: 15,
                    stiffness: 200,
                });
            }
        );

        if (record_id) {
            setSaving(true);
            await deleteByRecoredId();
            setSaving(false);
        } else if (customer_id) {
            setSaving(true);
            await deleteParent();
            setSaving(false);
        }
        setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
        setRefreshSingleViewChangeDatabase((prev) => !prev);
    };

    const handleCancel = () => {
        console.log("Cancel button pressed");

        // Button press animation
        cancelScale.value = withSpring(
            0.95,
            { damping: 15, stiffness: 300 },
            () => {
                cancelScale.value = withSpring(1, {
                    damping: 15,
                    stiffness: 200,
                });
            }
        );

        setCloseModal(false);
    };

    const handleClose = () => {
        console.log("Close button pressed");
        setCloseModal(false);
    };

    const showToast = (message, type = "error") => {
        Toast.show({
            type: type,
            text1: message,
            position: "top",
            onPress: () => Toast.hide(),
            swipeable: true,
            topOffset: 100,
        });
    };

    const deleteByRecoredId = async () => {
        try {
            const { data, error } = await supabase
                .from("customer_transactions")
                .delete()
                .eq("id", record_id);
            if (error) {
                throw error;
            }
            showToast("Record deleted successfully", "success");
        } catch (error) {
            console.error("Failed to delete record", error.message);
            showToast("Failed to delete record", "error");
        } finally {
            setCloseModal(false);
        }
    };

    const deleteParent = async () => {
        try {
            const { data, error } = await supabase
                .from("customers")
                .delete()
                .eq("id", customer_id);
            if (error) {
                console.error("Error deleting customer:", error);
                showToast("Failed to delete customer", "error");
                return;
            }
            showToast("Customer deleted successfully", "success");
        } catch (error) {
            console.error("Unexpected error while deleting customer:", error);
            showToast("An error occurred while deleting customer", "error");
        } finally {
            setCloseModal(false);
        }
    };

    return (
        <View style={styles.modalOverlay}>

            <Animated.View
                entering={SlideInDown.duration(400).springify().damping(15)}
                exiting={SlideOutDown.duration(300)}
                style={styles.modalContainer}
            >
                {/* Close Button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    activeOpacity={0.7}
                >
                    <X size={20} color="#64748B" strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Warning Icon */}
                <Animated.View
                    entering={FadeIn.duration(600).delay(200)}
                    style={styles.iconContainer}
                >
                    <AlertTriangle
                        size={52}
                        color="#EF4444"
                        strokeWidth={2.5}
                    />
                </Animated.View>

                {/* Title */}
                <Animated.Text
                    entering={FadeIn.duration(600).delay(300)}
                    style={styles.title}
                >
                    Confirm Deletion
                </Animated.Text>

                {/* Message */}
                <Animated.Text
                    entering={FadeIn.duration(600).delay(400)}
                    style={styles.message}
                >
                    {message ||
                        "Are you sure you want to delete this item? This action cannot be undone."}
                </Animated.Text>

                {/* Action Buttons */}
                <Animated.View
                    entering={FadeIn.duration(600).delay(500)}
                    style={styles.buttonContainer}
                >
                    <Animated.View
                        style={[styles.buttonWrapper, cancelAnimatedStyle]}
                    >
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={[styles.button, styles.cancelButton]}
                            activeOpacity={0.8}
                            hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        style={[styles.buttonWrapper, deleteAnimatedStyle]}
                    >
                        <TouchableOpacity
                            onPress={handleDelete}
                            style={[
                                styles.button,
                                styles.deleteButton,
                                saving && styles.deleteButtonDisabled,
                            ]}
                            activeOpacity={0.8}
                            disabled={saving}
                            hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                            }}
                        >
                            <View style={styles.buttonContent}>
                                {saving ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />
                                ) : (
                                    <>
                                        <AlertTriangle
                                            size={18}
                                            color="#FFFFFF"
                                            strokeWidth={2.5}
                                            style={styles.buttonIcon}
                                        />
                                        <Text style={styles.deleteButtonText}>
                                            Delete
                                        </Text>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                {/* Bottom indicator */}
                <View style={styles.bottomIndicator} />
            </Animated.View>
        </View>
>>>>>>> 66e78290e03e9da2713968a103b23bf2202b6fc3
    );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        position: "relative",
    },
    options_container: {
        backgroundColor: "white",
        padding: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: "100%",
        alignItems: "flex-start",
        color: "white",
        position: "relative",
        hadowColor: "black",
        shadowOffset: { width: 3, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 15,
    },
    button_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        columnGap: 10,
    },
    texts: {
        color: "black",
    },
    delete_button: {
        backgroundColor: delete_button_color,
        borderRadius: 50,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    cancel_button: {
        backgroundColor: cancel_button_color,
        borderRadius: 50,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    pressable: {
        position: "absolute",
        zIndex: 1,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 50,
        color: "black",
        top: 10,
        right: 10,
    },
    pressable_close: {},
    button_text: {
        color: "white",
=======
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
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContainer: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        width: "100%",
        paddingHorizontal: 28,
        paddingTop: 40,
        paddingBottom: 44,
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 16,
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F8FAFC",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "#FEF2F2",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#FECACA",
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#0F172A",
        marginBottom: 12,
        textAlign: "center",
        letterSpacing: -0.8,
    },
    message: {
        fontSize: 16,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 36,
        paddingHorizontal: 8,
        fontWeight: "500",
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 16,
    },
    buttonWrapper: {
        flex: 1,
    },
    button: {
        width: "100%",
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 56,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonIcon: {
        marginRight: 8,
    },
    cancelButton: {
        backgroundColor: "#F8FAFC",
        borderWidth: 2,
        borderColor: "#E2E8F0",
    },
    deleteButton: {
        backgroundColor: "#EF4444",
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    deleteButtonDisabled: {
        backgroundColor: "#FCA5A5",
        shadowOpacity: 0.2,
    },
    cancelButtonText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#475569",
        letterSpacing: 0.3,
    },
    deleteButtonText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.3,
    },
    bottomIndicator: {
        width: 40,
        height: 4,
        backgroundColor: "#E2E8F0",
        borderRadius: 2,
        marginTop: 20,
>>>>>>> 66e78290e03e9da2713968a103b23bf2202b6fc3
    },
});
