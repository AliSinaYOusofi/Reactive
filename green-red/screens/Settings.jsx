"use client";

import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { User, LogOut, Trash2, ChevronRight, Edit } from "lucide-react-native";
import { supabase } from "../utils/supabase";
import { useAppContext } from "../context/useAppContext";
import ProfileDetailsModal from "../components/ProfileDetails";
import EditProfileModal from "../components/EditProfile";

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { setUserId, userId } = useAppContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
        useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) throw error;
            setProfileData(data);
        } catch (error) {
            console.error("Error fetching profile data:", error.message);
            Alert.alert(
                "Error",
                "Failed to fetch profile data. Please try again."
            );
        }
    };

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: async () => {
                    setIsLoggingOut(true);
                    try {
                        const { error } = await supabase.auth.signOut();
                        if (error) throw error;

                        setUserId(null);
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "login" }],
                        });
                    } catch (error) {
                        console.error("Error logging out:", error.message);
                        Alert.alert(
                            "Error",
                            "Failed to logout. Please try again."
                        );
                    } finally {
                        setIsLoggingOut(false);
                    }
                },
            },
        ]);
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setIsDeletingAccount(true);
                        try {
                            const { error } = await supabase.rpc(
                                "delete_user_data",
                                { input_user_id: userId }
                            );
                            if (error) throw error;

                            await supabase.auth.signOut();
                            setUserId(null);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "login" }],
                            });
                            Alert.alert(
                                "Success",
                                "Your account has been deleted."
                            );
                        } catch (error) {
                            console.error(
                                "Error deleting account:",
                                error.message
                            );
                            Alert.alert(
                                "Error",
                                "Failed to delete account. Please try again."
                            );
                        } finally {
                            setIsDeletingAccount(false);
                        }
                    },
                },
            ]
        );
    };

    const SettingOption = ({ icon, text, onPress }) => (
        <TouchableOpacity style={styles.option} onPress={onPress}>
            <View style={styles.optionContent}>
                {icon}
                <Text style={styles.optionText}>{text}</Text>
            </View>
            <ChevronRight color="#666" size={20} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            <SettingOption
                icon={<User color="#007AFF" size={24} />}
                text="View Profile"
                onPress={() => setIsProfileModalVisible(true)}
            />

            <SettingOption
                icon={<Edit color="#4CD964" size={24} />}
                text="Edit Profile"
                onPress={() => setIsEditProfileModalVisible(true)}
            />

            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDeleteAccount}
                    disabled={isDeletingAccount}
                >
                    {isDeletingAccount ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Trash2 color="#fff" size={24} />
                            <Text style={styles.buttonText}>
                                Delete Account
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <LogOut color="#fff" size={24} />
                            <Text style={styles.buttonText}>Logout</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <ProfileDetailsModal
                isVisible={isProfileModalVisible}
                onClose={() => setIsProfileModalVisible(false)}
                profileData={profileData}
            />

            <EditProfileModal
                isVisible={isEditProfileModalVisible}
                onClose={() => setIsEditProfileModalVisible(false)}
                profileData={profileData}
                onUpdate={fetchProfileData}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    header: {
        fontSize: 34,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#000",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionText: {
        fontSize: 17,
        marginLeft: 15,
        color: "#000",
    },
    bottomButtonsContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
    },
    deleteButton: {
        backgroundColor: "#FF9500",
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        marginLeft: 10,
    },
});

export default SettingsScreen;
