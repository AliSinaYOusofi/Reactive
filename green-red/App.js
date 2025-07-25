import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Toast from "react-native-toast-message";
import AddUser from "./screens/AddUser";
import SingleCustomerView from "./screens/SingleCustomerView";
import EditCustomerParent from "./screens/EditCustomerParent";
import { AppContextProvider, useAppContext } from "./context/useAppContext";
import * as SystemUI from "expo-system-ui";
import { ActivityIndicator } from "react-native-paper";

// Replace lucide-react-native icons with @expo/vector-icons variants
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import SettingsScreen from "./screens/Settings";
import LoginScreen from "./screens/LoginScreen";
import Signup from "./screens/Signup";
SystemUI.setBackgroundColorAsync("white");

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <AppContextProvider>
            <Navigation />
        </AppContextProvider>
    );
}

function Navigation() {
    const { userId, loading } = useAppContext();

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    const initialRoute = userId ? "homescreen" : "login";

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={({ navigation, route }) => ({
                    headerShown: true,
                    contentStyle: {
                        marginHorizontal: 10,
                        marginBottom: 4,
                        fontSize: 20,
                    },
                    headerRight: () =>
                        route.name !== "login" &&
                        route.name !== "signup" && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("settings")}
                                style={styles.headerIcon}
                            >
                                <Feather
                                    name="settings"
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        ),
                })}
            >
                <Stack.Screen
                    name="homescreen"
                    component={HomeScreen}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => (
                            <Ionicons
                                name="home-outline"
                                size={24}
                                color="black"
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="settings"
                    component={SettingsScreen}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => (
                            <Feather name="settings" size={24} color="black" />
                        ),
                        headerRight: () => null,
                    }}
                />
                <Stack.Screen
                    name="login"
                    component={LoginScreen}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => (
                            <MaterialCommunityIcons
                                name="login"
                                size={24}
                                color="black"
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="signup"
                    component={Signup}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => (
                            <MaterialCommunityIcons
                                name="account-plus"
                                size={24}
                                color="black"
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="Add Customer"
                    component={AddUser}
                    options={{
                        title: "Add Customer",
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => (
                            <View style={styles.iconRow}>
                                <FontAwesome5
                                    name="user-plus"
                                    size={24}
                                    color="black"
                                />
                            </View>
                        ),
                        headerRight: () => null,
                    }}
                />
                <Stack.Screen
                    name="CustomerData"
                    component={SingleCustomerView}
                    options={{
                        title: "Customer Data",
                        headerTitle: () => (
                            <View style={styles.iconRow}>
                                <MaterialCommunityIcons
                                    name="database"
                                    size={24}
                                    color="black"
                                />
                            </View>
                        ),
                        headerRight: () => null,
                    }}
                />
                <Stack.Screen
                    name="EditCustomer"
                    component={EditCustomerParent}
                    options={{
                        title: "Customer Data",
                        headerTitle: () => (
                            <View style={styles.iconRow}>
                                <Feather
                                    name="edit-2"
                                    size={24}
                                    color="black"
                                />
                            </View>
                        ),
                        headerRight: () => null,
                    }}
                />
            </Stack.Navigator>
            <Toast />
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerIcon: {
        marginRight: 10,
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
});
