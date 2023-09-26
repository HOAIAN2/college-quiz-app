import { useContext } from 'react'
import { UserContext } from './UserContext'
import { LanguageContext } from './LanguageContext'

function useUserData() {
    return useContext(UserContext)
}
function useLanguage() {
    return useContext(LanguageContext)
}

export {
    useUserData,
    useLanguage
}