import { createContext, ReactNode, Dispatch, useState } from 'react'
import { getLanguage } from '../utils/languages'

const init: unknown = getLanguage()
interface LanguageType {
    appLanguage: string
    setAppLanguage: Dispatch<React.SetStateAction<string>>
}
const LanguageContext = createContext<LanguageType>(init as LanguageType)

function LanguageProvider({ children }: { children: ReactNode }) {
    const [appLanguage, setAppLanguage] = useState(init)
    return (
        <LanguageContext.Provider value={{ appLanguage, setAppLanguage } as LanguageType}>
            {children}
        </LanguageContext.Provider>
    )
}

export {
    LanguageProvider,
    LanguageContext,
}