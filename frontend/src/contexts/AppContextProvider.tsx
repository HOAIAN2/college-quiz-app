import { ReactNode } from 'react';
import { AppContext, useAppContextValue } from './AppContext';

export function AppContextProvider({ children }: { children: ReactNode; }) {
    const contextValue = useAppContextValue();
    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}
