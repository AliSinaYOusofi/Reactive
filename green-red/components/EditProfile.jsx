import { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import { supabase } from "../utils/supabase";
import { Feather } from '@expo/vector-icons';
import { printToFileAsync } from "expo-print";

const EditProfileModal = ({ isVisible, onClose, profileData, onUpdate }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (profileData) {
            setUsername(profileData.username || "");
            setPassword(profileData?.password || "")
            setConfirmPassword(profileData?.password || "")
        }
    }, [profileData]);

    const handleUpdateProfile = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const updates = { username };
            if (password) {
                const { error: passwordError } = await supabase.auth.updateUser(
                    { password }
                );

                if (passwordError) throw passwordError;

                updates.password = password
            }

            const { error } = await supabase
                .from("users")
                .update(updates)
                .eq("id", profileData.id);

            if (error) throw error;

            Alert.alert("Success", "Profile updated");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error.message);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.handle} />
                    <Text style={styles.modalTitle}>Edit Profile</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter new username"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter new password"
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={togglePasswordVisibility}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? (
                                    <Feather name="eye-off" size={24} color="#007AFF" />
                                ) : (
                                    <Feather name="eye" size={24} color="#007AFF" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm new password"
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={toggleConfirmPasswordVisibility}
                                style={styles.eyeIcon}
                            >
                                {showConfirmPassword ? (
                                    <Feather name="eye-off" size={24} color="#007AFF" />
                                ) : (
                                    <Feather name="eye" size={24} color="#007AFF" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdateProfile}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.updateButtonText}>
                                Update Profile
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalView: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#00000030",
        borderRadius: 3,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#EDF2F7",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EDF2F7",
        borderRadius: 8,
    },
    passwordInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    updateButton: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    updateButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    cancelButton: {
        marginTop: 15,
    },
    cancelButtonText: {
        color: "#007AFF",
        fontSize: 18,
    },
});

export default EditProfileModal;
