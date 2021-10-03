import { useMemo } from 'react'
import debounce from '../utils/debounce'

export default function useDebounce<T = any, F extends (this: T, ...args: any) => void = () => void>(
    func: F,
    delay?: number
) {
    return useMemo(() => {
        return debounce<T, F>(func, delay)
    }, [func, delay])
}
