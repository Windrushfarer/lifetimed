import { LifetimeTerminable } from '@lifetimed/core'

export function fetchLifetimed(
  lifetime: LifetimeTerminable,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController()

  lifetime.onTerminate(() => {
    controller.abort()
  }, { callImmediately: true })

  return fetch(input, { ...init, signal: controller.signal })
}