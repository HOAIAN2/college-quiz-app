import { ReactNode, createContext, useRef, useState } from 'react'
import { User } from '../models/user'
import { getLanguage } from '../utils/languages'

type AppContextType = {
    DOM: {
        sideBarRef: React.RefObject<HTMLDivElement>
        titleRef: React.RefObject<HTMLHeadingElement>
    }
    appLanguage: {
        language: string
        setLanguage: React.Dispatch<React.SetStateAction<string>>
    },
    user: {
        user: User | undefined
        setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    }
    permissions: {
        items: string[]
        setItems: React.Dispatch<React.SetStateAction<string[]>>
        has: (name: string) => boolean
    }
}

const init: unknown = {}
export const AppContext = createContext<AppContextType>(init as AppContextType)

export function AppProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState(getLanguage())
    const [permissions, setPermissions] = useState<string[]>([])
    const [user, setUser] = useState<User | undefined>()
    const sideBarRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    return (
        <AppContext.Provider value={
            {
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
        }>
            {children}
        </AppContext.Provider >
    )
}