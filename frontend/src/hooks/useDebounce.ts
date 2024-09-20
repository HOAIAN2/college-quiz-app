import { useEffect, useState } from 'react';
import { DEFAULT_DEBOUNCE } from '../config/env';

export default function useDebounce<T>(value: T, timeout: number = DEFAULT_DEBOUNCE) {
    const [debounce, setDebouce] = useState(value);
    useEffect(() => {
        const handleDelay = setTimeout(() => {
            setDebouce(value);
        }, timeout);
        return (() => {
            clearTimeout(handleDelay);
        });
    }, [timeout, value]);
    return debounce;
}
