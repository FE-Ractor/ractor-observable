import { EventEmitter2 } from "eventemitter2"
import { Observable } from "rxjs/Rx"
import { ObservableStore } from "./ObservableStore"
import { Listener } from "./ObservableReceiveBuilder"

/** a schedule service to listen current system's event stream
 *  for performance perspective，current implemantation all listen system, not listen actor respective
 */
export class ObservableScheduler {
	private defaultListener?: Listener
	private callback = (value: Object) => {
		const listener = this.listeners.find(listener => !!listener.message && value instanceof listener.message)
		try {
			if (listener) {
				const next$ = listener.callback(Observable.of(value))
				this.owner.state.next(next$)
				return
			}
			if (this.defaultListener) {
				const next$ = this.defaultListener.callback(Observable.of(value))
				this.owner.state.next(next$)
				return
			}
		} catch (e) {
			this.owner.postError(e)
		}

	}

	constructor(private eventStream: EventEmitter2, private event: string, private listeners: Listener[], private owner: ObservableStore<any>) {
		this.defaultListener = this.listeners.find(listener => !listener.message)
	}

	public cancel() {
		this.eventStream.removeListener(this.event, this.callback)
		return true
	}

	public isCancelled() {
		return !this.eventStream.listeners(this.event).length
	}

	public pause() {
		this.cancel()
	}

	public restart() {
		this.cancel()
		this.start()
	}

	public start() {
		this.eventStream.addListener(this.event, this.callback)
	}
}