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
SystemUI.setBackgroundColorAsync("white");

import {
    Database,
    House,
    LogIn,
    PenSquare,
    Settings2,
    Signature,
    UserPlus,
    Settings,
    LogInIcon,
} from "lucide-react-native";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/Signup";
import SettingsScreen from "./screens/Settings";
import { ActivityIndicator } from "react-native-paper";

const StackNavigator = createNativeStackNavigator();

export default function App() {
    return (
        <AppContextProvider>
            <Navigation />
        </AppContextProvider>
    );
}

const Navigation = () => {
    const { userId, loading } = useAppContext();

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    const initialRoute = userId ? "homescreen" : "login";

    return (
        <NavigationContainer>
            <StackNavigator.Navigator
                initialRouteName={initialRoute}
                screenOptions={({ navigation, route }) => ({
                    headerShown: true,
                    contentStyle: {
                        marginHorizontal: 10,
                        marginBottom: 4,
                        fontSize: 20,
                    },
                    headerRight: () =>
                        route.name !== "login" && route.name !== "signup" && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("settings")}
                                style={{ marginRight: 10 }}
                            >
                                <Settings size={24} color="black" />
                            </TouchableOpacity>
                        ),
                })}
            >
                <StackNavigator.Screen
                    name="homescreen"
                    component={HomeScreen}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => <House size={24} color="black" />,
                    }}
                />
                <StackNavigator.Screen
                    name="settings"
                    component={SettingsScreen}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => <Settings size={24} color="black" />,
                        headerRight: () => null,
                    }}
                />
                <StackNavigator.Screen
                    name="login"
                    component={LoginScreen}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => <LogIn size={24} color="black" />,
                    }}
                />
                <StackNavigator.Screen
                    name="signup"
                    component={SignupScreen}
                    options={{
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => (
                            <LogInIcon size={24} color="black" />
                        ),
                    }}
                />
                <StackNavigator.Screen
                    name="Add Customer"
                    component={AddUser}
                    options={{
                        title: "Add Customer",
                        headerTitleStyle: { fontSize: 25 },
                        headerTitle: () => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 4,
                                }}
                            >
                                <UserPlus color="black" />
                            </View>
                        ),
                        headerRight: () => null
                    }}
                />
                <StackNavigator.Screen
                    name="CustomerData"
                    component={SingleCustomerView}
                    options={{
                        title: "Customer Data",
                        headerTitle: () => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 4,
                                }}
                            >
                                <Database size={24} color="black" />
                            </View>
                        ),
                        headerRight: () => null
                    }}
                />
                <StackNavigator.Screen
                    name="EditCustomer"
                    component={EditCustomerParent}
                    options={{
                        title: "Customer Data",
                        headerTitle: () => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 4,
                                }}
                            >
                                <PenSquare color="black" />
                            </View>
                        ),
                        headerRight: () => null
                    }}
                />
            </StackNavigator.Navigator>
            <Toast />
        </NavigationContainer>
    );
};
