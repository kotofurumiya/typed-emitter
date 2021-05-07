export declare type Listener<T> = (event: T) => unknown;
export declare type UnlistenFunction = () => boolean;
export declare type EmitterOptions = Record<string, never>;
export declare type EventMap = Record<string, unknown>;
declare type ListenerMap<T extends EventMap> = {
  [K in keyof T]?: Listener<T[K]>[];
};
export declare type ListenOptions = {
  readonly once?: boolean;
};
/**
 * A simple event emitter but well-typed.
 */
export declare class Emitter<T extends EventMap = EventMap> {
  #private;
  /**
   * Create new instance of `Emitter`.
   * `options` is just preserved for future and not used currently.
   *
   * @param options - options
   */
  constructor(options?: EmitterOptions);
  private _getListenerList;
  private _removeListener;
  /**
   * Register a `listener` to `eventName` and return a function to cancel.
   * Return value is a function which is useful to remove the `listener`.
   *
   * @example Basic Usage
   *
   * ```
   * const emitter = new Emitter();
   * const cb = (event: { name: string }) => console.log(`Hello! ${name}!`);
   *
   * const unlisten = emitter.listen('join', cb);
   * emitter.emit('join', { name: 'John' });
   * unlisten();
   * ```
   *
   * @remarks
   *
   * With `once` option, you can register a `listener` as once listener.
   * If listener is marked as `once`, the `listener` will be removed after invoked.
   *
   * @example Once Listener
   *
   * ```
   * const emitter = new Emitter();
   * const cb = (event: { name: string }) => console.log(`Hello! ${name}!`);
   *
   * // listen as once
   * emitter.listen('join', cb, { once: true });
   *
   * // invoke and remove the listener automatically
   * emitter.emit('join', { name: 'Alice' });
   *
   * // nothing happens
   * emitter.emit('join', { name: 'Bob' });
   * ```
   *
   * @remarks
   *
   * It is important that this method never check duplication,
   * therefore, registering multiple times causes multiple callbacks.
   *
   * @param eventName - event name which binds to `listener`
   * @param listener - callback listener function
   * @param options - additional options
   * @returns function to unlisten
   */
  listen<E extends keyof T = keyof T>(
    eventName: E,
    listener: Listener<T[E]>,
    options?: ListenOptions
  ): UnlistenFunction;
  /**
   * Removes a `listener` from `eventName` and
   * returns `true` if `listener` exists in `eventName` otherwise `false`.
   *
   * This method does not have `options` argument,
   * which means it doesn't matter whether the `listener` is once or not.
   *
   * @remarks
   *
   * Note that this method just removes a very first found listener.
   * If you register same function reference multiple times,
   * you may need to call this method multiple times.
   *
   * When single same function reference bound as both once listener and not once listener,
   * finding order is not guaranteed.
   *
   * @param eventName - event name which binds to `listener`
   * @param listener - callback listener function
   * @returns `true` if `listener` exists in `eventName` otherwise `false`.
   *
   * @example Basic Usage
   *
   * ```
   * const emitter = new Emitter();
   * const cb = (event: { name: string }) => console.log(`Hello! ${name}!`);
   *
   * emitter.listen('join', cb);
   * emitter.emit('join', { name: 'John' });
   * emitter.unlisten('join', cb);
   * ```
   *
   */
  unlisten<E extends keyof T>(eventName: E, listener: Listener<T[E]>): boolean;
  /**
   * Remove all listeners from `eventName`, including once listeners.
   *
   * @param eventName - event name which you want to remove
   */
  unlistenAllOf<E extends keyof T>(eventName: E): void;
  /**
   * Broadcast `event` to listeners bound to `eventName`.
   *
   * @remarks
   * Iterates listeners and once listeners,
   * and call them with `event` synchronously.
   * After iteration, removes all once listeners bound to `eventName`.
   *
   * @param eventName - event name which you want to emit
   * @param event - event object
   */
  emit<E extends keyof T>(eventName: E, event: T[E]): void;
  /**
   * For debug. Don't use this.
   */
  dump(): {
    listenerMap: ListenerMap<T>;
    onceListenerMap: ListenerMap<T>;
  };
}
export {};
