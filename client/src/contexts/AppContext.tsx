import { ReactNode, createContext, useReducer, useState } from 'react'
import { sideBarRef, titleRef } from './DOMContext'
import { getLanguage } from '../utils/languages'
import { USER_ACTION, userReducer } from './UserContext'
import { AppContextType } from '../models/context'

const init: unknown = {}
export const AppContext = createContext<AppContextType>(init as AppContextType)

export function AppProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState(getLanguage())
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
                }
            }
        }>
            {children}
        </AppContext.Provider>
    )
}