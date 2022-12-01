import { Lifetime } from "@lifetimed/core";

export function setTimeoutLifetimed(
  lifetime: Lifetime,
  fn: Function,
  timeout?: number,
  ...fnArgs: any[]
): number {
  const timerId = setTimeout(fn, timeout, ...fnArgs)

  lifetime.addCleanup(() => clearTimeout(timerId))

  return timerId
}
