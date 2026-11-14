import '@testing-library/jest-dom/vitest';

// jsdom has no layout, so it ships neither of these. cmdk needs both.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub;
Element.prototype.scrollIntoView ??= () => {};
