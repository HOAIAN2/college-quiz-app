import { useEffect, useState } from 'react'
import useAppContext from './useAppContext'

export default function useLanguage<T>(langFile: string) {
    const { appLanguage } = useAppContext()
    const [language, setLanguage] = useState<T>()
    useEffect(() => {
        import(`../../assets/langs/${appLanguage.language}/${langFile}.ts`)
            .then((data) => {
                setLanguage(data.default as T)
            })
    })
    return language
}
