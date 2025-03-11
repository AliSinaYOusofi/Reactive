import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from "../context/useAppContext";
const LoginScreen = ({route}) => {
    const navigation = useNavigation();
    const {email: signupEmail = '', password: signupPassword = ''} = route?.params || {}
    
    const [email, setEmail] = useState(signupEmail);
    const [password, setPassword] = useState(signupPassword);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUserId } = useAppContext();

    useEffect(() => {
        setEmail(signupEmail);
        setPassword(signupPassword);
    }, [signupEmail, signupPassword]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(
                "Error",
                "Please fill in both email and password fields"
            );
            return;
        }

        setIsLoggingIn(true);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            });

            if (error) {
                throw error;
            }
            
            setUserId(data.user.id);
            await AsyncStorage.setItem("userId", data.user.id);
            navigation.reset({
                index: 0,
                routes: [{ name: "homescreen" }],
            });
        } catch (error) {
            console.error("Error logging in:", error.message);
            Alert.alert(
                "Login Failed",
                error.message || "An unexpected error occurred"
            );
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>

                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="account"
                            size={20}
                            color="#666"
                            style={styles.leftIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="lock"
                            size={20}
                            color="#666"
                            style={styles.leftIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIconContainer}
                        >
                            <MaterialCommunityIcons
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="white" />
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                    <Text style={styles.registerText}>
                        Don't have an account?{" "}
                        <Text style={styles.registerLink}>Register</Text>
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => Linking.openURL("https://pair-pay.vercel.app/reset_password")}>
                    <Text style={styles.registerText}>
                        Forgot password?{" "}
                        <Text style={styles.registerLink}>Reset here</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    formContainer: {
        width: "100%",
        maxWidth: 400,
        padding: 24,
        backgroundColor: "white",
        borderRadius: 16,
        
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#333",
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EDF2F7",
        borderRadius: 12,
        backgroundColor: "#f9f9f9",
        paddingHorizontal: 12,
        height: 56,
        position: "relative",
    },
    leftIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        height: "100%",
    },
    eyeIconContainer: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButton: {
        backgroundColor: "#3366FF",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 24,
        shadowColor: "#3366FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    registerText: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
    },
    registerLink: {
        color: "#3366FF",
        fontWeight: "600",
    },
});

export default LoginScreen;
