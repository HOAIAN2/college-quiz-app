import { useEffect, useState } from "react"
import useAppContext from "./useAppContext"
export default function useLanguage<T>(langFile: string) {
    const { appLanguage } = useAppContext()
    const [language, setLanguage] = useState<T>()
    useEffect(() => {
        fetch(`/langs/${langFile}.${appLanguage.language}.json`)
            .then(res => res.json())
            .then((data: T) => {
                setLanguage(data)
            })
    })
    return language
}