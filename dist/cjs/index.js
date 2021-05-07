'use strict';
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError('attempted to get private field on non-instance');
    }
    return privateMap.get(receiver);
  };
var _listenerMap, _onceListenerMap;
Object.defineProperty(exports, '__esModule', { value: true });
exports.Emitter = void 0;
/**
 * A simple event emitter but well-typed.
 */
class Emitter {
  /**
   * Create new instance of `Emitter`.
   * `options` is just preserved for future and not used currently.
   *
   * @param options - options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options = {}) {
    _listenerMap.set(this, {});
    _onceListenerMap.set(this, {});
    // noop currently
  }
  // FIXME: make it #private after TypeScript 4.3
  // FIXME: something wrong with inferring `map[eventName]` type.
  //   it should be resolved recursively but it remains `ListenerMap<T>[E]` and
  //   suddenly resolved when `return list;` as `T[K][] | undefined`.
  //   this bahaviour prevents narrowing to omit undefined.
  _getListenerList(map, eventName) {
    var _a;
    const list = (_a = map[eventName]) !== null && _a !== void 0 ? _a : [];
    map[eventName] = list;
    return list;
  }
  // FIXME: make it #private after TypeScript 4.3
  _removeListener(map, eventName, listener) {
    const list = this._getListenerList(map, eventName);
    const idx = list.indexOf(listener);
    return idx >= 0 ? !!list.splice(idx, 1) : false;
  }
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
  listen(eventName, listener, options = {}) {
    const targetMap = options.once
      ? __classPrivateFieldGet(this, _onceListenerMap)
      : __classPrivateFieldGet(this, _listenerMap);
    const listenerList = this._getListenerList(targetMap, eventName);
    listenerList.push(listener);
    return () => {
      return this._removeListener(targetMap, eventName, listener);
    };
  }
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
  unlisten(eventName, listener) {
    let removed = false;
    for (const targetMap of [
      __classPrivateFieldGet(this, _onceListenerMap),
      __classPrivateFieldGet(this, _listenerMap),
    ]) {
      removed || (removed = this._removeListener(targetMap, eventName, listener));
    }
    return removed;
  }
  /**
   * Remove all listeners from `eventName`, including once listeners.
   *
   * @param eventName - event name which you want to remove
   */
  unlistenAllOf(eventName) {
    delete __classPrivateFieldGet(this, _listenerMap)[eventName];
    delete __classPrivateFieldGet(this, _onceListenerMap)[eventName];
  }
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
  emit(eventName, event) {
    const listenerList = this._getListenerList(__classPrivateFieldGet(this, _listenerMap), eventName);
    const onceListenerList = this._getListenerList(__classPrivateFieldGet(this, _onceListenerMap), eventName);
    for (let i = 0; i < listenerList.length; i++) {
      listenerList[i](event);
    }
    for (let i = 0; i < onceListenerList.length; i++) {
      onceListenerList[i](event);
    }
    __classPrivateFieldGet(this, _onceListenerMap)[eventName] = undefined;
  }
  /**
   * For debug. Don't use this.
   */
  dump() {
    const copy = (map) =>
      Object.entries(map).reduce(
        (prev, [key, value]) => Object.assign(Object.assign({}, prev), { [key]: [...value] }),
        {}
      );
    return {
      listenerMap: copy(__classPrivateFieldGet(this, _listenerMap)),
      onceListenerMap: copy(__classPrivateFieldGet(this, _onceListenerMap)),
    };
  }
}
exports.Emitter = Emitter;
(_listenerMap = new WeakMap()), (_onceListenerMap = new WeakMap());
