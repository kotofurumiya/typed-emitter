import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { Emitter } from '../dist/esm/index.js';

type TestEventMap = {
  foo: string;
  bar: {
    name: string;
  };
  baz: number;
};

class MyEmitter extends Emitter<TestEventMap> {
  constructor() {
    super();
  }
}

test('emit simple event', () => {
  const emitter = new Emitter<TestEventMap>();

  emitter.listen('foo', (event) => {
    assert.is(event, 'hello');
  });

  emitter.listen('bar', (event) => {
    assert.equal(event, { name: 'alice' });
  });

  emitter.listen('baz', () => {
    assert.unreachable();
  });

  emitter.emit('foo', 'hello');
  emitter.emit('bar', { name: 'alice' });
});

test('once listener', () => {
  const emitter = new Emitter<TestEventMap>();

  let count = 0;

  emitter.listen(
    'foo',
    () => {
      count++;
    },
    { once: true }
  );

  emitter.emit('foo', 'hello');
  emitter.emit('foo', 'hello');
  emitter.emit('foo', 'hello');
  emitter.emit('foo', 'hello');

  assert.is(count, 1);
});

test('unlisten', () => {
  const emitter = new Emitter<TestEventMap>();

  const fn = () => assert.unreachable();

  // use unlisten method
  emitter.listen('foo', fn);
  emitter.unlisten('foo', fn);
  emitter.emit('foo', 'hello');

  // use unlisten return value
  const unlisten = emitter.listen('foo', fn);
  unlisten();
  emitter.emit('foo', 'hello');
});

test('unlistenAllOf', () => {
  const emitter = new Emitter<TestEventMap>();

  const listener = () => () => assert.unreachable();

  emitter.listen('foo', listener());
  emitter.listen('foo', listener(), { once: true });
  emitter.listen('foo', listener());
  emitter.listen('foo', listener(), { once: true });
  emitter.listen('foo', listener());

  emitter.unlistenAllOf('foo');

  emitter.emit('foo', 'hello');
});

// emitter can accept same function multiple times.
// this is by design.
test('duplicated listeners', () => {
  const emitter = new Emitter<TestEventMap>();

  let count = 0;
  const fn = () => count++;

  emitter.listen('foo', fn);
  emitter.listen('foo', fn);
  emitter.listen('foo', fn);

  emitter.emit('foo', 'hello');

  assert.is(count, 3);
});

test('extends emitter', () => {
  const emitter = new MyEmitter();

  let count = 0;
  const fn = () => count++;

  emitter.listen('foo', fn);
  emitter.listen('foo', fn, { once: true });

  emitter.emit('foo', 'hello');
  emitter.emit('foo', 'hello');

  assert.is(count, 3);
});

test.run();
