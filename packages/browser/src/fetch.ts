import { LifetimeTerminable } from '@lifetimed/core'

export function fetchLifetimed(
  lifetime: LifetimeTerminable,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController()

  lifetime.addCleanup(() => {
    controller.abort()
  })

  // Any input AbortController will be overwritten
  return fetch(input, { ...init, signal: controller.signal })
}
