export interface Lifetime {
  readonly isTerminated: boolean

  add(fn: Function): void
  remove(fn: Function): void
}

export class LifetimeSource implements Lifetime {
  private actions: Function[] = []

  isTerminated: boolean = false

  constructor(initiallyTerminated: boolean = false) {
    this.isTerminated = initiallyTerminated
  }

  add(fn: Function): void {
    if (!this.isTerminated) {
      this.actions.unshift(fn)
    } else {
      throw new Error("Can't add a function to terminated lifetime")
    }
  }

  addOrCallImmediately(fn: Function) {
    if (this.isTerminated) {
      fn()
    } else {
      this.add(fn)
    }
  }

  remove(fn: Function): void {
    this.actions = this.actions.filter(f => f == fn)
  }

  terminate(): void {
    this.isTerminated = true
    this.actions.forEach(f => f())
    this.actions = []
  }
}

export class SequentialLifetimes {
  private current: LifetimeSource | null = null

  constructor(private parentLifetime: LifetimeSource) { }

  get currentOrNext(): LifetimeSource {
    return this.current ?? this.next()
  }

  next(): LifetimeSource {
    const nested = this.createNested()
    this.setCurrent(nested)

    return nested
  }

  clear() {
    this.setCurrent(null)
  }

  private setCurrent(lt: LifetimeSource | null) {
    this.current?.terminate()
    this.current = lt
  }

  private createNested(): LifetimeSource {
    const parent = this.parentLifetime
    const nested = new LifetimeSource(parent.isTerminated)

    const termimationAction = () => { nested.terminate() }

    parent.addOrCallImmediately(termimationAction)
    nested.addOrCallImmediately(() => {
      parent.remove(termimationAction)
    })

    return nested
  }
}
