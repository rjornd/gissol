import assert from 'node:assert/strict';
import test from 'node:test';
import * as cursorMotion from '../src/cursorMotion.js';
import { createMapSafely } from '../src/mapResilience.js';

const { createCursorFrameScheduler } = cursorMotion;

test('map creation errors are returned instead of escaping to React', () => {
  const webglError = new Error('Failed to initialize WebGL');

  const result = createMapSafely(() => {
    throw webglError;
  });

  assert.equal(result.map, null);
  assert.equal(result.error, webglError);
});

test('cursor movement is coalesced to the latest position once per animation frame', () => {
  const queuedFrames = [];
  const renderedPositions = [];

  const scheduler = createCursorFrameScheduler({
    requestFrame: (callback) => {
      queuedFrames.push(callback);
      return queuedFrames.length;
    },
    cancelFrame: () => {},
    renderPosition: (position) => renderedPositions.push(position),
  });

  scheduler.schedule({ x: 10, y: 20 });
  scheduler.schedule({ x: 30, y: 40 });

  assert.equal(queuedFrames.length, 1);
  assert.deepEqual(renderedPositions, []);

  queuedFrames[0]();

  assert.deepEqual(renderedPositions, [{ x: 30, y: 40 }]);
});

test('cursor stays hidden when it leaves before a queued frame renders', () => {
  const { createCursorController } = cursorMotion;
  const queuedFrames = new Map();
  const renderedPositions = [];
  let hiddenCount = 0;
  let nextFrameId = 1;

  assert.equal(typeof createCursorController, 'function');

  const controller = createCursorController({
    requestFrame: (callback) => {
      const frameId = nextFrameId++;
      queuedFrames.set(frameId, callback);
      return frameId;
    },
    cancelFrame: (frameId) => queuedFrames.delete(frameId),
    renderPosition: (position) => renderedPositions.push(position),
    hidePosition: () => {
      hiddenCount += 1;
    },
  });

  controller.move({ x: 10, y: 20 });
  controller.hide();
  queuedFrames.forEach((callback) => callback());

  assert.equal(hiddenCount, 1);
  assert.deepEqual(renderedPositions, []);
});
