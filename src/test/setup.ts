import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

class ResizeObserverStub implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverStub;
window.scrollTo = () => {};

afterEach(() => {
  window.localStorage.clear();
});
