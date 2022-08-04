import { LifetimeTerminable } from '@lifetimed/core'

export function addEventListenerLifetimed<K extends keyof WindowEventMap>(
  lifetime: LifetimeTerminable,
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  if (!lifetime.isTerminated) {
    window.addEventListener(type, listener, options)

    lifetime.onTerminate(() => {
      window.removeEventListener(type, listener, options)
    }, { callImmediately: true })
  }
}