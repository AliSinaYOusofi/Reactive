import { createContext, useContext, useState } from "react"

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const [refreshHomeScreenOnChangeDatabase, setRefreshHomeScreenOnChangeDatabase] = useState(false);
    const [refreshSingelViewChangeDatabase, setRefreshSingleViewChangeDatabase] = useState(false)

    return (
        <AppContext.Provider
            value={{
                refreshHomeScreenOnChangeDatabase, setRefreshHomeScreenOnChangeDatabase,
                refreshSingelViewChangeDatabase, setRefreshSingleViewChangeDatabase,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext = () => useContext(AppContext);
