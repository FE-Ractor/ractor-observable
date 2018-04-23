import { Listener } from "./ObservableReceiveBuilder"

export class ObservableReceive {
	public getListener() {
		return this.listeners
	}
	constructor(private listeners: Listener[]) {
	}
}