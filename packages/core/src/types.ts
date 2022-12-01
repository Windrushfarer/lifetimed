export interface Lifetime {
  readonly isTerminated: boolean

  addCleanup(fn: Function): () => void
}

export interface LifetimeTerminable extends Lifetime {
  terminate(): void
}

export interface LifetimeNested extends LifetimeTerminable {
  nested(): LifetimeNested
}
