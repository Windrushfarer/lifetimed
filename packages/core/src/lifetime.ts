import { LifetimeTerminable } from "./types"

export class LifetimeTerminableImpl implements LifetimeTerminable {
  private actions: Function[] = []

  isTerminated: boolean = false

  constructor(initiallyTerminated: boolean = false) {
    this.isTerminated = initiallyTerminated
  }

  onTerminate(fn: Function) {
    if (!this.isTerminated) {
      this.actions.unshift(fn)
    } else {
      throw new Error("Can't add a function to the terminated lifetime")
    }

    return () => {
      this.actions = this.actions.filter(f => f == fn)
    }
  }

  terminate(): void {
    this.isTerminated = true
    this.actions.forEach(f => f())
    this.actions = []
  }
}
