import { ReactNode, createContext, useRef, useState } from 'react'
import { User } from '../models/user'
import { getLanguage } from '../utils/languages'

type AppContextType = ReturnType<typeof useAppContext>

const init: unknown = {}
export const AppContext = createContext<AppContextType>(init as AppContextType)

function useAppContext() {
    const sideBarRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const [language, setLanguage] = useState(getLanguage())
    const [permissions, setPermissions] = useState<string[]>([])
    const [user, setUser] = useState<User | undefined>()

    return {
        DOM: {
            sideBarRef,
            titleRef
        },
        appLanguage: {
            language,
            setLanguage
        },
        user: {
            user,
            setUser
        },
        permissions: {
            items: permissions,
            setItems: setPermissions,
            has: (name: string) => permissions.includes(name)
        }
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
    const contextValue = useAppContext()

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}
