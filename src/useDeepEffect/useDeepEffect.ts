import { useEffect } from 'react'
import isEqual from 'fast-deep-equal/react'
import { usePrevious } from '../usePrevious'

export default function useDeepEffect(callback: React.EffectCallback, deps?: React.DependencyList) {
    const prevDeps = usePrevious(deps)
    useEffect(() => {
        let cb
        if (!isEqual(deps, prevDeps)) {
            cb = callback?.()
        }
        return cb
    }, deps)
}
