import { useEffect } from 'react'
import debounce from '../utils/debounce'

export default function useEventListener<E extends HTMLElement, K extends keyof WindowEventMap>(
    eventName: K,
    eventHandler: (ev: WindowEventMap[K]) => void,
    target: React.RefObject<E> | E | Document | null = document,
    delay?: number
) {
    useEffect(() => {
        const ele: E | Window = (target as React.RefObject<E>)?.current || (target as E) || window

        if (!(ele && ele.addEventListener) || !eventName) return

        const hanldeListener = debounce(eventHandler, delay)

        ele.addEventListener(eventName, hanldeListener as any)

        return () => {
            ele.removeEventListener(eventName, hanldeListener as any)
        }
    }, [target, delay, eventName, eventHandler])
}
