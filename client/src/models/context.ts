import { DOMContextType } from '../contexts/DOMContext'
import { UserContextType } from '../contexts/UserContext'

export type AppContextType = {
    DOM: DOMContextType,
    appLanguage: {
        language: string
        setLanguage: React.Dispatch<React.SetStateAction<string>>
    },
    user: UserContextType
}