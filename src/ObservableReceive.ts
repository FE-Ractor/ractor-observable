import { IActorReceive } from "js-actor"
import { Listener } from "./Listener"

export class ObservableReceive implements IActorReceive {
  constructor(public listeners: Listener[]) { }
}