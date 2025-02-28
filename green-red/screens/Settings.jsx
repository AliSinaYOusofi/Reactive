// screens/SettingsScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { User, Bell, Lock, LogOut, ChevronRight } from "lucide-react-native";
import { supabase } from "../utils/supabase";
import { useAppContext } from "../context/useAppContext";

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { setUserId} = useAppContext()
    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            const { error } = await supabase.auth.signOut();
                            if (error) throw error;
                            
                            setUserId(null)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'login' }],
                            });
                        } catch (error) {
                            console.error('Error logging out:', error.message);
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    }
                }
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
                text="Profile"
                onPress={() => alert("Profile settings")}
            />

            <SettingOption
                icon={<Bell color="#FF9500" size={24} />}
                text="Notifications"
                onPress={() => alert("Notification settings")}
            />

            <SettingOption
                icon={<Lock color="#FF3B30" size={24} />}
                text="Privacy"
                onPress={() => alert("Privacy settings")}
            />

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut color="#fff" size={24} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F7",
        padding: 20,
    },
    header: {
        fontSize: 34,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#000",
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 17,
        marginLeft: 15,
        color: "#000",
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#FF3B30",
        padding: 16,
        borderRadius: 12,
        marginTop: 30,
    },
    logoutText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        marginLeft: 10,
    },
});

export default SettingsScreen;