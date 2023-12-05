import { useEffect, useState } from 'react'

export default function useDebounce(value: unknown, timeout: number) {
    const [debounce, setDebouce] = useState(value)
    useEffect(() => {
        const handleDelay = setTimeout(() => {
            setDebouce(value)
        }, timeout)
        return (() => {
            clearTimeout(handleDelay)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    return debounce
}