export interface Lifetime {
  readonly isTerminated: boolean

  onTerminate(fn: Function): void
  removeFn(fn: Function): void
}

type TerminationOptions = {
  callImmediately?: boolean
}

export class LifetimeTerminable implements Lifetime {
  private actions: Function[] = []

  isTerminated: boolean = false

  constructor(initiallyTerminated: boolean = false) {
    this.isTerminated = initiallyTerminated
  }

  onTerminate(fn: Function, options: TerminationOptions = {}): void {
    if (!this.isTerminated) {
      this.actions.unshift(fn)
    } else if (options.callImmediately) {
      fn()
    } else {
      throw new Error("Can't add a function to the terminated lifetime")
    }
  }

  removeFn(fn: Function): void {
    this.actions = this.actions.filter(f => f == fn)
  }

  terminate(): void {
    this.isTerminated = true
    this.actions.forEach(f => f())
    this.actions = []
  }
}
