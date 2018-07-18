import { IActorReceiveBuilder, Message, IActorReceive } from "js-actor"
import { Observable } from "rxjs"
import { ObservableReceive } from "./ObservableReceive"
import { Listener } from "./Listener"

export class ObservableReceiveBuilder implements IActorReceiveBuilder {
  private listeners: Listener[] = []

  public match<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>, Message<T10>], callback: (obj: Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10>) => Observable<object>): this
  public match<T1, T2, T3, T4, T5, T6, T7, T8, T9>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>], callback: (obj: Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>) => Observable<object>): this
  public match<T1, T2, T3, T4, T5, T6, T7, T8>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>], callback: (obj: Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>) => Observable<object>): this
  public match<T1, T2, T3, T4, T5, T6, T7>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>], callback: (obj: Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7>) => Observable<object>): this
  public match<T1, T2, T3, T4, T5, T6>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>], callback: (obj: Observable<T1 | T2 | T3 | T4 | T5 | T6>) => Observable<object>): this
  public match<T1, T2, T3, T4, T5>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>], callback: (obj: Observable<T1 | T2 | T3 | T4 | T5>) => Observable<object>): this
  public match<T1, T2, T3, T4>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>], callback: (obj: Observable<T1 | T2 | T3 | T4>) => Observable<object>): this
  public match<T1, T2, T3>(messages: [Message<T1>, Message<T2>, Message<T3>], callback: (obj: Observable<T1 | T2 | T3>) => Observable<object>): this
  public match<T1, T2>(messages: [Message<T1>, Message<T2>], callback: (obj: Observable<T1 | T2>) => Observable<object>): this
  public match<T1>(messages: [Message<T1>], callback: (obj: Observable<T1>) => Observable<object>): this
  public match<T>(messages: Message<T>, callback: (obj: Observable<T>) => Observable<object>): this
  public match<T extends object>(message: Message<T> | Message<object>[], callback: (obj: Observable<object>) => Observable<object>) {
    if (Array.isArray(message)) {
      message.forEach(message => this.listeners.push({ message, callback }))
    } else {
      this.listeners.push({ message, callback })
    }
    return this
  }

  public matchAny(callback: (obj: Observable<object>) => Observable<object>) {
    this.listeners.push({ callback })
    return this
  }

  public build(): IActorReceive {
    return new ObservableReceive(this.listeners)
  }
}
