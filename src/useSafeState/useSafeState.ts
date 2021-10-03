import { useState, useRef, useEffect } from 'react'

export default function useSafeState<S = undefined>(
    initialState?: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] {
    const _mounted = useRef(true)

    const [state, setState] = useState<S>(initialState as any)

    const _setState: React.Dispatch<React.SetStateAction<S>> = (args) => {
        if (_mounted.current) {
            setState(args)
        }
    }

    useEffect(() => {
        _mounted.current = true
        return () => {
            _mounted.current = false
        }
    }, [])

    return [state, _setState]
}
