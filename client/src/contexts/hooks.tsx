import { useContext } from 'react'
import { UserContext } from './UserContext'
import { LanguageContext } from './LanguageContext'
import { SideBarContext } from './SideBarContext'

export function useUserData() {
    return useContext(UserContext)
}
export function useLanguage() {
    return useContext(LanguageContext)
}
export function useSideBarContext() {
    return useContext(SideBarContext)
}