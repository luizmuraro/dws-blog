import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, renderHook } from '@testing-library/react';
import { useViewportFit, type UseViewportFitOptions } from './useViewportFit';

let triggerResize: () => void;
let disconnectSpy: ReturnType<typeof vi.fn<() => void>>;

const mountPanel = (top: number) => {
  const element = document.createElement('div');

  element.getBoundingClientRect = () => ({ top }) as DOMRect;
  document.body.append(element);

  return element;
};

const renderWithElement = (element: HTMLDivElement, options?: UseViewportFitOptions) =>
  renderHook(() => {
    const fit = useViewportFit<HTMLDivElement>(options);
    fit.ref.current = element;

    return fit;
  });

beforeEach(() => {
  disconnectSpy = vi.fn<() => void>();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        triggerResize = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {
        disconnectSpy();
      }
    },
  );
  window.innerHeight = 800;
  window.scrollY = 0;
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('useViewportFit', () => {
  it('leaves the height undefined while the ref is not attached', () => {
    const { result } = renderHook(() => useViewportFit<HTMLDivElement>());

    expect(result.current.maxHeight).toBeUndefined();
  });

  it('fills the space between the element top and the viewport bottom', () => {
    const { result } = renderWithElement(mountPanel(200));

    expect(result.current.maxHeight).toBe(600);
  });

  it('subtracts the bottom gap', () => {
    const { result } = renderWithElement(mountPanel(200), { bottomGap: 24 });

    expect(result.current.maxHeight).toBe(576);
  });

  it('accounts for the current scroll offset', () => {
    window.scrollY = 100;

    const { result } = renderWithElement(mountPanel(200));

    expect(result.current.maxHeight).toBe(500);
  });

  it('never goes below the minimum height', () => {
    const { result } = renderWithElement(mountPanel(790), { minHeight: 240 });

    expect(result.current.maxHeight).toBe(240);
  });

  it('remeasures when the body resizes', () => {
    const element = mountPanel(200);
    const { result } = renderWithElement(element);

    expect(result.current.maxHeight).toBe(600);

    element.getBoundingClientRect = () => ({ top: 300 }) as DOMRect;
    act(() => triggerResize());

    expect(result.current.maxHeight).toBe(500);
  });

  it('remeasures when the window resizes', () => {
    const { result } = renderWithElement(mountPanel(200));

    window.innerHeight = 1000;
    act(() => fireEvent(window, new Event('resize')));

    expect(result.current.maxHeight).toBe(800);
  });

  it('disconnects the observer and drops the resize listener on unmount', () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderWithElement(mountPanel(200));

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
