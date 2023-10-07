import { useContext } from 'react'
import { UserContext } from './UserContext'
import { LanguageContext } from './LanguageContext'
import { DOMContext } from './DOMContext'

export function useUserData() {
    return useContext(UserContext)
}
export function useLanguage() {
    return useContext(LanguageContext)
}
export function useDOMContext() {
    return useContext(DOMContext)
}