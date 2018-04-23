import { Store, StoreContext } from "ractor"
import { Scheduler } from "js-actor"
import { BehaviorSubject, Observable } from "rxjs"
import { ObservableReceive } from "./ObservableReceive"
import { ObservableScheduler } from "./ObservableScheduler"
import { ObservableReceiveBuilder } from "./ObservableReceiveBuilder"
import { shallowPartialEqual } from "./utils/shallowPartialEqual"

export abstract class ObservableStore<T> extends Store<any> {
  private state$: BehaviorSubject<Observable<T>>
  public abstract state: T

  protected abstract createObservableReceive(): ObservableReceive

  public createState$(state: T) {
    return new BehaviorSubject(Observable.of(state)).mergeAll().distinctUntilChanged(shallowPartialEqual).scan((acc: T, x: T) => Object.assign(acc, x)) as any
  }

  public receive() {
    this.state$ = this.createState$(this.state)
    const listeners = this.createObservableReceive().getListener()
    const eventStream = this.context.system.eventStream
    this.context.scheduler = new ObservableScheduler(eventStream, this.context.name, listeners, this) as any
    this.context.scheduler.start()
    this.preStart()
  }

  public observableReceiveBuilder() {
    return new ObservableReceiveBuilder()
  }

  public createReceive() {
    return this.receiveBuilder().build()
  }

}