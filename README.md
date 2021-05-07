# typed-emitter

Strongly typed simple event emitter with zero dependencies.
It works on arbitrary JS engines.

## Support

| Env     | Version | Status |
|---------|---------|:------:|
| Node.js | 12.x    | never  |
| Node.js | 14.x    | ok     |
| Node.js | 16.x    | ok     |
| Browser | latest  | ok     |

## Install

```
npm i @kotofurumiya/typed-emitter
```

## API Reference

See [API Document](./docs/api.md).

## Overview

Without types.

```ts
import { Emitter } from '@kotofurumiya/typed-emitter';

const emitter = new Emitter();
const listener = (event) => console.log(event);
emitter.listen('myevent', listener);
emitter.listen('myawesomeevent', listener, { once: true });
emitter.emit('myevent', { name: 'John' });
emitter.unlisten(listener);
```

With types.

```ts
import { Emitter } from '@kotofurumiya/typed-emitter';

// define `eventName: eventType` record type.
type MyEventMap = {
  foo: string;
  bar: {
    name: string;
  }
};

// apply it
const emitter = new Emitter<MyEventMap>();

// ok and types are inferred automatically
emitter.listen('foo', (val) => console.log(val));
emitter.listen('bar', ({name}) => console.log(name));

// type mismatch error
emitter.listen('foo', ({ zzz }) => console.log(zzz));
emitter.listen('bar', ({name}) => console.log(name));

// type error('awesome' event does not exists)
emitter.listen('awesome', (event) => console.log(event));

// ok to emit event
emitter.emit('foo', 'hello!');
emitter.emit('bar', { name: 'John' });

// type mismatch error
emitter.emit('foo', 123);
emitter.emit('bar', true);
```

## Basic Usage

Usually, you want to use a emitter with `extends`.
It's possible of course.

```ts
class GameEnemy extends Emitter<GameEvent> {
  constructor() {
    // `super()` in constructor is required. Don't forget.
    super();
  }
};
```

But to simplify explanation, I'll use bare `Emitter` here.

It's very simple to use `Emitter`. Just `listen` and `emit`, it's all.

```ts
import { Emitter } from '@kotofurumiya/typed-emitter';

const emitter = new Emitter();
const listener = (event) => console.log(event);
emitter.listen('myevent', listener);
emitter.listen('myawesomeevent', listener, { once: true });
emitter.emit('myevent', { name: 'John' });
emitter.unlisten(listener);
```

These methods are strongly typed.
If you give definition of "events" to `Emitter`,
your text editor can suggest and lint wisely.

```ts
import { Emitter } from '@kotofurumiya/typed-emitter';

const emitter = new Emitter<{ foo: string }>();

// error! 'foo' must emit `string`
emitter.emit('foo', 123);
```

If you don't need type checks, you can omit it.

```ts
// with type check
const emitter = new Emitter<{ foo: string }>();

// without type check
const emitter = new Emitter();
```

## Advanced Usage

### Once listener

You can register a listener as "once" listener
by passing `{ once: true }` to `listen` method.

"once" listener will be automatically removed after event is fired.

```ts
emitter.listen('myevent', listener, { once: true });
```

once listeners can be removed with `emitter.unlisten`.

```ts
emitter.listen('myevent', listener, { once: true });
emitter.unlisten('myevent', listener);
```

## Unlisten function

`listen` method returns a unlitening function.
This function is same as `emitter.unlisten(eventName, listener)`.

```ts
const unlisten = emitter.listen('myevent', listener);
unlisten(); // same as `emitter.unlisten('myevent', listener)`
```

If you want to prune all listeners, you can use `unlistenAllOf`.

```ts
// Remove all 'myevent' listeners, includes once listeners.
emitter.unlistenAllOf('myevent');
```
