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
import { Feather } from '@expo/vector-icons';
import { supabase } from "../utils/supabase";
import { useAppContext } from "../context/useAppContext";
import ProfileDetailsModal from "../components/ProfileDetails";
import EditProfileModal from "../components/EditProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { setUserId, userId } = useAppContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
        useState(false);
    const [profileData, setProfileData] = useState(null);

    

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
                        try {
                            await AsyncStorage.removeItem("userId");
                        } catch (error) {
                            console.error("Failed to remove userId");
                        }
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

                            await AsyncStorage.removeItem("userId");
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

    useEffect(() => {
        fetchProfileData();
    }, []);
    
    const SettingOption = ({ icon, text, onPress }) => (
        <TouchableOpacity style={styles.option} onPress={onPress}>
            <View style={styles.optionContent}>
                {icon}
                <Text style={styles.optionText}>{text}</Text>
            </View>
            <Feather name="chevron-right" color="#666" size={20} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            <SettingOption
                icon={<Feather name="user" color="#555" size={24} />}
                text="View Profile"
                onPress={() => setIsProfileModalVisible(true)}
            />

            <SettingOption
                icon={<Feather name="edit" color="#555" size={24} />}
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
                            <Feather name="trash-2" color="#fff" size={24} />
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
                            <Feather name="log-out" color="#fff" size={24} />
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
        padding: 20,
        backgroundColor: "white"
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#333",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        borderColor: "#E5E7EB",
        borderWidth: 1
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionText: {
        fontSize: 16,
        marginLeft: 15,
        color: "#333",
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
        backgroundColor: "#007FFF",
    },
    deleteButton: {
        backgroundColor: "#FF5A5F",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
    },
});

export default SettingsScreen;
