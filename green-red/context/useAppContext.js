import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase"; // Adjust path based on your project

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [refreshHomeScreenOnChangeDatabase, setRefreshHomeScreenOnChangeDatabase] = useState(false);
    const [refreshSingleViewChangeDatabase, setRefreshSingleViewChangeDatabase] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: userData, error } = await supabase.auth.getUser();
            if (userData?.user?.id) {
                setUserId(userData.user.id);
            } else {
                console.error("Error fetching user ID:", error);
            }
        };

        getUser();
    }, []);

    return (
        <AppContext.Provider
            value={{
                userId, setUserId,
                refreshHomeScreenOnChangeDatabase, setRefreshHomeScreenOnChangeDatabase,
                refreshSingleViewChangeDatabase, setRefreshSingleViewChangeDatabase,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
