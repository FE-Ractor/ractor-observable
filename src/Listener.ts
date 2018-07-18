import { Observable } from "rxjs"

export type Listener<T = object> = {
  message?: new (...args: any[]) => T
  callback(source: Observable<T>): Observable<object>
  stream$
}