import { ReactNode, createContext, useReducer, useState } from 'react'
import { DOMContextType } from '../contexts/DOMContext'
import { UserContextType } from '../contexts/UserContext'
import { getLanguage } from '../utils/languages'
import { sideBarRef, titleRef } from './DOMContext'
import { USER_ACTION, userReducer } from './UserContext'

type AppContextType = {
    DOM: DOMContextType,
    appLanguage: {
        language: string
        setLanguage: React.Dispatch<React.SetStateAction<string>>
    },
    user: UserContextType
    permissions: {
        items: string[]
        setItems: React.Dispatch<React.SetStateAction<string[]>>
    }
}

const init: unknown = {}
export const AppContext = createContext<AppContextType>(init as AppContextType)

export function AppProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState(getLanguage())
    const [permissions, setPermissions] = useState<string[]>([])
    const [user, dispatchUser] = useReducer(userReducer, undefined)
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
                    dispatchUser,
                    USER_ACTION: USER_ACTION
                },
                permissions: {
                    items: permissions,
                    setItems: setPermissions
                }
            }
        }>
            {children}
        </AppContext.Provider >
    )
}