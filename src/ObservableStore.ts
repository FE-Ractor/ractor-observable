import { Store } from "ractor"
import { IActorReceive } from "js-actor"
import { ObservableReceiveBuilder } from "./ObservableReceiveBuilder";
import { ObservableScheduler } from "./ObservableScheduler";

export abstract class ObservableStore<S> extends Store<S> {
  abstract createReceive(): IActorReceive

  protected receiveBuilder() {
    return new ObservableReceiveBuilder()
  }

  public receive() {
    const receive = this.createReceive()
    this.context.scheduler = new ObservableScheduler(this.context.system, this.context.path, receive.listeners, this)
    this.context.scheduler.start()
    this.preStart()
  }
}