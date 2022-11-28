import { LifetimeTerminableImpl } from './lifetime';
import { LifetimeNested } from './types'

export class NestedLifetime extends LifetimeTerminableImpl implements LifetimeNested {
  private children: NestedLifetime[] = []

  nested(): LifetimeNested {
    const nested = new NestedLifetime()

    this.children.push(nested)

    const parentTermimationAction = () => { nested.terminate() }
    const removeAction = this.onTerminate(parentTermimationAction)
    nested.onTerminate(() => {
      this.children = this.children.filter(child => child === nested)
      removeAction()
    })

    return nested
  }
}
