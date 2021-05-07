# typed-emitter API

## new Emitter<T>()

Create new instance.
`T` is a type which represents pairs of event name and event value.

If `T` is omitted, default value is `Record<string, unknown>`.

```ts
type MyEventMap = {
  foo: string;
  bar: number;
};

const emitter = new Emitter<MyEventMap>();
```

## emitter.listen(eventName: string, listener: Function, options?: {once: boolean}): UnlistenFunction

start listening `eventName` with `listener` and returns `UnlistenFunction`.
Type of `listener` depends on `T` in constructor.
Default type of listener is `(event: unknown) => unknown`.

When `{once: true}` is given, `listener` will be removed after first invocation.

```ts
type MyEventMap = {
  foo: string;
  bar: number;
};

const emitter = new Emitter<MyEventMap>();

// type of listener is `(event: string) => unknown`
emitter.listen('foo', (event) => console.log(event));

// type of listener is `(event: number) => unknown`
emitter.listen('bar', (event) => console.log(event));

// get unlisten function
const unlisten = emitter.listen('foo', (event) => console.log(event));

// remove listener
unlisten();
```

## emitter.unlisten(eventName: string, listener: Function): boolean

Remove `listener` from emitter.
Returns `true` if `listener` is removed successfully,
otherwise false.

This method also can remove once listeners.

```ts
const emitter = new Emitter();
const listener = (event) => console.log(event);

emitter.listen('foo', listener);
emitter.listen('bar', listener, { once: true });

emitter.unlisten('foo', listener);
emitter.unlisten('bar', listener);
```

## emitter.unlistenAllOf(eventName: string): void

Remove all listeners and once listeners of `eventName`.

```ts
const emitter = new Emitter();

emitter.listen('foo', (event) => console.log(event));
emitter.listen('foo', (event) => console.log(event), { once: true });
emitter.listen('bar', (event) => console.log(event));
emitter.listen('bar', (event) => console.log(event), { once: true });

// remove all listeners
emitter.unlistenAllOf('foo');
emitter.unlistenAllOf('bar');
```

## emitter.emit(eventName: string, event: unknown): void

Emit a `event` to `eventName`.

```ts
const emitter = new Emitter();

emitter.listen('foo', (event) => console.log(event));

emitter.emit('foo', 'hello');
```