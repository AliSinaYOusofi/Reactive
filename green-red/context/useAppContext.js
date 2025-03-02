import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase"; // Adjust path based on your project
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [
        refreshHomeScreenOnChangeDatabase,
        setRefreshHomeScreenOnChangeDatabase,
    ] = useState(false);
    const [
        refreshSingleViewChangeDatabase,
        setRefreshSingleViewChangeDatabase,
    ] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const value = await AsyncStorage.getItem("userId");
                if (value) {
                    console.log(value, '***********')
                    setUserId(value);
                }
            } catch (error) {
                console.error("Error getting userId from async storage:", error)
                setUserId(null)
            } finally {
                setLoading(false)
            }
        };

        getUser();
    }, []);

    return (
        <AppContext.Provider
            value={{
                userId,
                setUserId,
                refreshHomeScreenOnChangeDatabase,
                setRefreshHomeScreenOnChangeDatabase,
                refreshSingleViewChangeDatabase,
                setRefreshSingleViewChangeDatabase,
                loading
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
