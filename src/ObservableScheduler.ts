import { IActorScheduler, Message } from "js-actor"
import { Observable, Subscription, merge } from "rxjs"
import { ObservableStore } from "./ObservableStore"
import { System } from "ractor"
import { Listener } from "."


export class ObservableScheduler implements IActorScheduler {
  private handlers: { [key: string]: (messageInc?: object) => void } = {}
  private defaultHandler: any
  private subscription?: Subscription

  constructor(
    private system: System,
    private event: string,
    private listeners: Listener[],
    private owner: ObservableStore<any>
  ) { }

  public callback = (messageInc: Object) => {
    this.handlers
    try {
      this.handlers.forEach(handler => handler(messageInc))
    } catch (e) {
      this.owner.postError(e)
    }
  }

  public cancel() {
    this.system.eventStream.removeListener(this.event, this.callback)
    this.handlers.forEach(handler => handler())
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    return true
  }

  public isCancelled() {
    return !this.system.eventStream.listeners(this.event).length
  }

  public pause() {
    this.cancel()
  }

  public restart() {
    this.cancel()
    this.start()
  }

  public start() {
    this.system.eventStream.addListener(this.event, this.callback)
    const $ = this.mapListenersToObservable(this.listeners)
    this.subscription = $.subscribe(state => this.owner.setState(state))
  }

  public replaceListeners(listeners: Listener[]) {
    this.listeners = listeners
  }

  public ofMessage = (message?: Message<object>): Observable<object> =>
    new Observable(subscriber => {
      const handler = (messageInc?: object) => {
        if (messageInc) {
          // handler(obj) 表示有数据
          if (messageInc instanceof message) {
            try {
              subscriber.next(messageInc)
            } catch (error) {
              subscriber.error(error)
            }
          }
        } else {
          // handler() 表示取消stream
          subscriber.complete()
        }
      }
      this.handlers[message.name] = handler
    })

  public mapListenersToObservable(listeners: Listener[]) {
    const epics$ = listeners
      .map(listener => {
        listener.xx = listener.callback(this.ofMessage(listener.message))
      })

    return merge(...epics$)
  }

}
