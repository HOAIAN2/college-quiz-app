import { useContext } from 'react'
import { AppContext } from './AppContext'

export function useAppContext() {
    return useContext(AppContext)
}