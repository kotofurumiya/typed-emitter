//
// *NOTICE*
// This benchmark code is just for your reference.
// Result of execution is not based on statistical validity.
//
import { performance } from 'perf_hooks';
import { EventEmitter as NodeEmitter } from 'events';
import { Emitter as TypedEmitter } from '../dist/esm/index.js';

const measure = (fn, times) => {
  const startAt = performance.now();
  const endAt = performance.now();

  for (let i = 0; i < times; i++) {
    fn();
  }

  return endAt - startAt;
};

const benchmark = (title, fn, dryrun = false) => {
  const run = () => measure(fn, 1000);

  // warm up
  for (let i = 0; i < 10; i++) {
    run();
  }

  const results = [];
  for (let i = 0; i < 50; i++) {
    results.push(run());
  }

  if (!dryrun) {
    const time = results.reduce((prev, curr) => prev + curr) / results.length;
    console.log(title, (time * 1000).toPrecision(3) + ' us');
  }

  global.gc?.();
};

const createNodeEmitter = () => {
  const _ = new NodeEmitter();
};

const createTypedEmitter = () => {
  const _ = new TypedEmitter();
};

const listenAndUnlistenNodeEmitter = () => {
  const emitter = new NodeEmitter();
  emitter.setMaxListeners(150);

  const fnList = [];
  for (let i = 0; i < 100; i++) {
    const fn = () => {};
    fnList.push(fn);
    emitter.on('test', fn);
  }

  for (const fn of fnList) {
    emitter.off('test', fn);
  }
};

const listenAndUnlistenTypedEmitter = () => {
  const emitter = new TypedEmitter();

  const fnList = [];
  for (let i = 0; i < 100; i++) {
    const fn = () => {};
    fnList.push(fn);
    emitter.listen('test', fn);
  }

  for (const fn of fnList) {
    emitter.unlisten('test', fn);
  }
};

const emitNodeEmitter = () => {
  const emitter = new NodeEmitter();
  emitter.on('test', () => {});

  for (let i = 0; i < 1000; i++) {
    emitter.emit('test', 'foo');
  }
};

const emitTypedEmitter = () => {
  const emitter = new TypedEmitter();
  emitter.listen('test', () => {});

  for (let i = 0; i < 1000; i++) {
    emitter.emit('test', 'foo');
  }
};

// I have no idea how to prevent V8 optimization.
// Does warming-up execution make sense?
for (const dryrun of [true, true, false]) {
  benchmark('new EventEmitter()', createNodeEmitter, dryrun);
  benchmark('new TypedEmitter()', createTypedEmitter, dryrun);
  benchmark('listen unlisten EventEmitter', listenAndUnlistenNodeEmitter, dryrun);
  benchmark('listen unlisten TypedEmitter', listenAndUnlistenTypedEmitter, dryrun);
  benchmark('emit EventEmitter', emitNodeEmitter, dryrun);
  benchmark('emit TypedEmitter', emitTypedEmitter, dryrun);
}
