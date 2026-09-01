export function createCursorFrameScheduler({ requestFrame, cancelFrame, renderPosition }) {
  let frameId = null;
  let latestPosition = null;

  return {
    schedule(position) {
      latestPosition = position;
      if (frameId !== null) return;

      frameId = requestFrame(() => {
        frameId = null;
        const positionToRender = latestPosition;
        latestPosition = null;
        if (positionToRender) renderPosition(positionToRender);
      });
    },
    cancel() {
      if (frameId !== null) cancelFrame(frameId);
      frameId = null;
      latestPosition = null;
    },
  };
}

export function createCursorController({
  requestFrame,
  cancelFrame,
  renderPosition,
  hidePosition,
}) {
  const scheduler = createCursorFrameScheduler({ requestFrame, cancelFrame, renderPosition });

  return {
    move(position) {
      scheduler.schedule(position);
    },
    hide() {
      scheduler.cancel();
      hidePosition();
    },
    dispose() {
      scheduler.cancel();
    },
  };
}
