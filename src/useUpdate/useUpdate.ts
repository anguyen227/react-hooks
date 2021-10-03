import { useEffect, useRef } from 'react'

export default function useUpdate(callback: React.EffectCallback, deps?: React.DependencyList) {
    const _mounted = useRef(false)
    useEffect(() => {
        let cb
        if (_mounted.current) {
            cb = callback?.()
        }
        _mounted.current = true
        return cb
    }, deps)
}
