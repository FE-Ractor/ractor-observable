import { Increment } from "./Increment";
import { Decrement } from "./Decrement";
import { ObservableStore } from "../src/ObservableStore";
import { map, tap } from "rxjs/operators"

export class CounterStore extends ObservableStore<{ value: number }> {
  state = { value: 1 };

  createReceive() {
    return this.receiveBuilder()
      .match(Increment, increment$ => increment$.pipe(map(increment => ({ value: this.state.value + 1 }))))
      .match(Decrement, decrement$ => decrement$.pipe(tap(() => console.log(this.state)), map(decrement => ({ value: this.state.value - 1 }))))
      .matchAny(any$ => any$.pipe(tap(() => console.log("any", this.state)), map(() => this.state)))
      .build();
  }
}
