import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";
import { useAppContext } from "../context/useAppContext";

const SignupScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { setUserId } = useAppContext();
    const handleSignup = async () => {
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (email.length <= 3) {
            alert("Should be more than 3 characters");
            return;
        }

        setIsSigningUp(true);
        try {
            // Step 1: Sign up the user via Supabase Auth
            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email,
                    password,
                });

            if (authError) {
                alert("Signup error: " + authError.message);
                throw authError;
            }

            const user = authData.user;
            if (user) {
                // Step 2: Insert user data into your custom users table
                const { error: customInsertError } = await supabase
                    .from("users")
                    .insert([
                        {
                            id: user.id, // Use the UUID from Supabase Auth
                            username: username, // Replace with your desired username
                            email: user.email,
                            
                        },
                    ]);

                if (customInsertError) {
                    alert(
                        "Error saving custom user: " + customInsertError.message
                    );
                    throw customInsertError;
                }

                setUserId(user.id);

                const { error: signInError } =
                    await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                if (signInError) {
                    alert("Sign in error: " + signInError.message);
                    throw signInError;
                }

                alert("Account created successfully! Redirecting...");
                navigation.navigate("homescreen");
            }
        } catch (error) {
            console.error("Signup process error:", error);
        } finally {
            setIsSigningUp(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>

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
                            placeholder="Username"
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="email"
                            size={20}
                            color="#666"
                            style={styles.leftIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
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

                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="lock-check"
                            size={20}
                            color="#666"
                            style={styles.leftIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry={!showConfirmPassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                            value={confirmPassword}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            onPress={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            style={styles.eyeIconContainer}
                        >
                            <MaterialCommunityIcons
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handleSignup}
                    disabled={isSigningUp}
                >
                    {isSigningUp ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={styles.buttonText}>
                                Creating Account...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("login")}>
                    <Text style={styles.loginText}>
                        Already have an account?{" "}
                        <Text style={styles.loginLink}>Login</Text>
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
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
        borderColor: "#ddd",
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
    signupButton: {
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
    loginText: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
    },
    loginLink: {
        color: "#3366FF",
        fontWeight: "600",
    },
});

export default SignupScreen;
