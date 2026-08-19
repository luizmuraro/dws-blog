import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import BackgroundDecor from './BackgroundDecor';

let triggerResize: () => void;
let disconnect: ReturnType<typeof vi.fn<() => void>>;

beforeEach(() => {
  vi.useFakeTimers();
  disconnect = vi.fn<() => void>();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        triggerResize = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {
        disconnect();
      }
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('BackgroundDecor', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<BackgroundDecor />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the three blobs', () => {
    const { container } = render(<BackgroundDecor />);

    expect(container.firstElementChild?.children).toHaveLength(3);
  });

  it('stops observing once the layout has settled', () => {
    render(<BackgroundDecor />);

    act(() => triggerResize());
    expect(disconnect).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(150));
    expect(disconnect).toHaveBeenCalled();
  });

  it('restarts the delay while resizes keep arriving', () => {
    render(<BackgroundDecor />);

    act(() => triggerResize());
    act(() => vi.advanceTimersByTime(100));
    act(() => triggerResize());
    act(() => vi.advanceTimersByTime(100));

    expect(disconnect).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(50));
    expect(disconnect).toHaveBeenCalled();
  });

  it('stops observing on unmount', () => {
    const { unmount } = render(<BackgroundDecor />);

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
