import { Lifetime } from "@lifetimed/core";

export function setIntervalLifetimed(
  lifetime: Lifetime,
  fn: Function,
  timeout?: number,
  ...fnArgs: any[]
): number {
  const intervalId = setInterval(fn, timeout, ...fnArgs)

  lifetime.addCleanup(() => clearInterval(intervalId))

  return intervalId
}
