import { LifetimeTerminableImpl } from "./lifetime"
import { LifetimeTerminable } from "./types"

export class SequentialLifetimes {
  private current: LifetimeTerminable | null = null

  constructor(private parentLifetime?: LifetimeTerminable) { }

  get currentOrNext(): LifetimeTerminable {
    return this.current ?? this.next()
  }

  next(): LifetimeTerminable {
    const next = this.createNext()
    this.setCurrent(next)

    return next
  }

  clear() {
    this.setCurrent(null)
  }

  private setCurrent(lt: LifetimeTerminable | null) {
    this.current?.terminate()
    this.current = lt
  }

  private createNext(): LifetimeTerminable {
    const parent = this.parentLifetime
    const nextLifetime = new LifetimeTerminableImpl(parent?.isTerminated)

    if (parent) {
      const termimationAction = () => { nextLifetime.terminate() }

      const removeAction = parent.onTerminate(termimationAction)
      nextLifetime.onTerminate(removeAction)
    }

    return nextLifetime
  }
}

export function createSequential(parent?: LifetimeTerminable): SequentialLifetimes {
  return new SequentialLifetimes(parent)
}
