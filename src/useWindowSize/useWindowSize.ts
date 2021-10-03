import debounce from '../utils/debounce'

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'
import { useSafeState } from '../useSafeState'

export default function useWindowSize(delay = 0) {
    const isClient = typeof window === 'object'
    const getSize = () => ({
        height: isClient ? document.documentElement.clientHeight : 0,
        width: isClient ? document.documentElement.clientWidth : 0,
    })
    const [windowSize, setWindowSize] = useSafeState(getSize())

    useIsomorphicLayoutEffect(() => {
        const hanldeListener = debounce(function () {
            setWindowSize(getSize())
        }, delay)
        if (isClient) {
            hanldeListener()
            window.addEventListener('resize', hanldeListener)
        }
        return () => window.removeEventListener('resize', hanldeListener)
    }, [])

    return { ...windowSize }
}
