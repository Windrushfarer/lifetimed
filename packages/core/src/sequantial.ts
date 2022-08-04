import { LifetimeTerminable } from "./lifetime"

export class SequentialLifetimes {
  private current: LifetimeTerminable | null = null

  constructor(private parentLifetime: LifetimeTerminable) { }

  get currentOrNext(): LifetimeTerminable {
    return this.current ?? this.next()
  }

  next(): LifetimeTerminable {
    const nested = this.createNested()
    this.setCurrent(nested)

    return nested
  }

  clear() {
    this.setCurrent(null)
  }

  private setCurrent(lt: LifetimeTerminable | null) {
    this.current?.terminate()
    this.current = lt
  }

  private createNested(): LifetimeTerminable {
    const parent = this.parentLifetime
    const nested = new LifetimeTerminable(parent.isTerminated)

    const termimationAction = () => { nested.terminate() }

    parent.onTerminate(termimationAction, { callImmediately: true })
    nested.onTerminate(() => {
      parent.removeFn(termimationAction)
    }, { callImmediately: true })

    return nested
  }
}

export function createSequantial(parent: LifetimeTerminable): SequentialLifetimes {
  return new SequentialLifetimes(parent)
}