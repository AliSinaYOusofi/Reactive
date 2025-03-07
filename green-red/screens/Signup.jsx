import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";
import { useAppContext } from "../context/useAppContext";
import ConfirmationEmail from "../components/ConfrimationEmail";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const [confirmationModal, setConfirmationModal] = useState(true)

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
                            password: password,
                        },
                    ]);

                if (customInsertError) {
                    alert(
                        "Error saving custom user: " + customInsertError.message
                    );
                    throw customInsertError;
                }

                setUserId(user.id);
                await AsyncStorage.setItem("userId", user.id);

                setConfirmationModal(true)
                
            }
        } catch (error) {
            console.error("Signup process error:", error);
        } finally {
            setIsSigningUp(false);
        }
    };

    const handleGoogleSignin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
            });
            if (error) {
                alert("Google sign in error: " + error.message);
                throw error;
            }

            const user = data.user;

            if (user) {
                const { error: customInsertError } = await supabase
                    .from("users")
                    .insert([
                        {
                            id: user.id,
                            username: user.email.split("@")[0],
                            email: user.email,
                            password: "",
                        },
                    ]);

                if (customInsertError) {
                    alert(
                        "Error saving custom user: " + customInsertError.message
                    );
                    throw customInsertError;
                }

                alert("Confirmat");
                navigation.navigate("login");
            }
        } catch (error) {
            console.error("Google sign in error:", error);
        }
    };

    return (
        <>
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
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleSignin}
                        disabled={isSigningUp}
                    >
                        {isSigningUp ? (
                            <ActivityIndicator size="small" color="#DB4437" />
                        ) : (
                            <View style={styles.googleButtonContent}>
                                <MaterialCommunityIcons
                                    name="google"
                                    size={20}
                                    color="#DB4437"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.googleButtonText}>Sign Up with Google</Text>
                            </View>
                        )}
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => navigation.navigate("login")}>
                        <Text style={styles.loginText}>
                            Already have an account?{" "}
                            <Text style={styles.loginLink}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                
            </View>
            
            <Modal
                style={{width: '100%'}}
                visible={confirmationModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setConfirmationModal(false)}
            >
                
                <ConfirmationEmail
                    email={email || "my email@gmail.com"}
                    password={password || "pass12"}
                    setConfirmationModal={setConfirmationModal}
                />
                
            </Modal>
        </>
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
    googleButton: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    googleButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    googleButtonText: {
        color: "#DB4437",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default SignupScreen;
