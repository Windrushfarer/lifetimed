import { LifetimeTerminable } from '@lifetimed/core'

export function addEventListenerLifetimed<K extends keyof ElementEventMap>(
  lifetime: LifetimeTerminable,
  element: Element,
  type: K,
  listener: (this: Element, ev: ElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  if (!lifetime.isTerminated) {
    element.addEventListener(type, listener, options)

    lifetime.addCleanup(() => {
      element.removeEventListener(type, listener, options)
    })
  }
}
