import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    View,
    Dimensions,
    TouchableWithoutFeedback,
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
import { Feather } from '@expo/vector-icons';
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
            showToast("Record deleted", "success");
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
            showToast("Customer deleted", "success");
        } catch (error) {
            console.error("Unexpected error while deleting customer:", error);
            showToast("An error occurred while deleting customer", "error");
        } finally {
            setCloseModal(false);
        }
    };

    return (
        <View style={styles.modalOverlay} >

            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

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
                    <Feather name="x" size={20} color="#64748B" strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Warning Icon */}
                <Animated.View
                    entering={FadeIn.duration(600).delay(200)}
                    style={styles.iconContainer}
                >
                    <Feather name="alert-triangle" size={52} color="#EF4444" strokeWidth={2.5} />
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
                                        <Feather name="alert-triangle" size={18} color="#FFFFFF" strokeWidth={2.5} style={styles.buttonIcon} />
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
    },
});
