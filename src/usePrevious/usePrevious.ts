import { useEffect, useRef } from 'react'

export default function usePrevious<T = any>(value: T) {
    const ref = useRef<T>(value)
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}
