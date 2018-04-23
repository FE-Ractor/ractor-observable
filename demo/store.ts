import { ObservableStore } from "../src/ObservableStore"

class Increment {
  constructor(public value: number) { }
}

export class CounterStore extends ObservableStore<{ value: number }> {
  public state = { value: 1 }

  public createObservableReceive() {
    return this.observableReceiveBuilder()
      .match(Increment, increment$ => increment$.map(increment => ({ value: increment.value++ })))
      .build()
  }
}
