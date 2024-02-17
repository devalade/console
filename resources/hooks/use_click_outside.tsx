import { useEffect, type RefObject } from 'react'

type EventType = 'mousedown' | 'mouseup' | 'touchstart' | 'touchend'

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  eventType: EventType = 'mousedown'
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      // Do nothing if the target is not connected to the document
      if (!target || !target.isConnected) {
        return
      }

      const isOutside = Array.isArray(ref)
        ? ref.every((r) => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target)

      if (isOutside) {
        handler(event)
      }
    }

    document.addEventListener(eventType, listener)
    return () => {
      document.removeEventListener(eventType, listener)
    }
  }, [ref, handler, eventType])
}
