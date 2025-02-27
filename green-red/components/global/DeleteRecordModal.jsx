import React, { useState } from "react";
import { StyleSheet, Text, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import { cancel_button_color, delete_button_color } from "./colors";
import Toast from "react-native-toast-message";
import { useAppContext } from "../../context/useAppContext";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { supabase } from "../../utils/supabase";
export default function DeleteRecordModal({
    message,
    setCloseModal,
    username,
    record_id,
}) {
    const {
        setRefreshHomeScreenOnChangeDatabase,
        setRefreshSingleViewChangeDatabase,
    } = useAppContext();

    const [saving, setSaving] = useState(false)

    const handleDelete = async () => {
        if (record_id) {
            setSaving(true)
            await deleteByRecoredId();
            setSaving(false)
        } else {
            setSaving(true)
            await deleteByUsername();
            setSaving(false)
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
                .from("customer__records")
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

    const deleteByUsername = async () => {
        try {
            // Delete from customers table
            const { error: error1 } = await supabase
                .from("customers")
                .delete()
                .eq("username", username);

            if (error1) {
                throw error1;
            }

            // Delete from customer__records table
            const { error: error2 } = await supabase
                .from("customer__records")
                .delete()
                .eq("username", username);

            if (error2) {
                throw error2;
            }

            setRefreshHomeScreenOnChangeDatabase((prev) => !prev);
            setRefreshSingleViewChangeDatabase((prev) => !prev);

            setCloseModal(false);
            showToast("User and all associated records deleted.", "success");
        } catch (error) {
            console.error("Failed to delete user", error.message);
            showToast("Failed to delete user");
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
                                style={{ marginLeft: 12, marginTop: 5, alighItems: "center", justifyContent: "center" }}
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
    );
}

const styles = StyleSheet.create({
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
    },
});
