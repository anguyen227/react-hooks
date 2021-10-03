import { useEffect, useMemo, useRef } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import { useDebounce } from '../useDebounce'
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'
import { useSafeState } from '../useSafeState'

type Size = {
    width: number
    height: number
}
type UseSizeOptions = {
    delay?: number
    onStop?(ele: DOMRectReadOnly, size: Size): void
    onStart?(ele: DOMRectReadOnly, size: Size): void
    onResize?(ele: DOMRectReadOnly, size: Size): void
}
export default function useSize<E extends HTMLElement>(
    target: React.RefObject<E> | E | null,
    options: UseSizeOptions = {}
) {
    const observer = useRef<ResizeObserver | null>(null)
    const resizing = useRef(false)
    const [size, setSize] = useSafeState<Size>({ width: 0, height: 0 })

    const updateSize = useDebounce(function (this: DOMRectReadOnly, size: Size) {
        setSize(size)
        resizing.current = false
        options?.onStop?.(this, size)
    }, options.delay)

    useIsomorphicLayoutEffect(() => {
        const targetEle = (target as React.RefObject<E>)?.current ?? (target as E)

        if (!!targetEle) {
            observer.current = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
                const ele = entries[0]?.contentRect
                const size = getSize(getComputedStyle(targetEle))

                if (!resizing.current) {
                    resizing.current = true
                    options?.onStart?.(ele, size)
                }
                options?.onResize?.(ele, size)
                updateSize.bind(ele)(size)
            })
            observer.current?.observe?.(targetEle)
        }

        return () => {
            if (!!targetEle) {
                observer.current?.unobserve?.(targetEle)
            }
        }
    }, [target])

    useEffect(() => {
        return () => {
            observer.current?.disconnect?.()
        }
    }, [])

    return useMemo(() => size, [size.height, size.width])
}

function getSize(cssStyleDeclaration: CSSStyleDeclaration) {
    if (cssStyleDeclaration.boxSizing === 'border-box') {
        return {
            height: parseInt(cssStyleDeclaration.height, 10),
            width: parseInt(cssStyleDeclaration.width, 10),
        }
    }

    return {
        height:
            parseInt(cssStyleDeclaration.height, 10) +
            parseInt(cssStyleDeclaration.marginTop, 10) +
            parseInt(cssStyleDeclaration.marginBottom, 10),
        width:
            parseInt(cssStyleDeclaration.width, 10) +
            parseInt(cssStyleDeclaration.marginLeft, 10) +
            parseInt(cssStyleDeclaration.marginRight, 10),
    }
}
