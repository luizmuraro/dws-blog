import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, renderHook } from '@testing-library/react';
import { useDropdown } from './useDropdown';

const mountElement = <T extends HTMLElement>(tag: string): T => {
  const element = document.createElement(tag) as T;

  document.body.append(element);

  return element;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('useDropdown', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useDropdown());

    expect(result.current.isOpen).toBe(false);
  });

  it('opens, closes and toggles', () => {
    const { result } = renderHook(() => useDropdown());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('keeps stable callback references across renders', () => {
    const { result, rerender } = renderHook(() => useDropdown());
    const { open, close, toggle } = result.current;

    rerender();

    expect(result.current.open).toBe(open);
    expect(result.current.close).toBe(close);
    expect(result.current.toggle).toBe(toggle);
  });

  it('closes on a click outside the container', () => {
    const container = mountElement<HTMLDivElement>('div');
    const outside = mountElement<HTMLDivElement>('div');
    const { result } = renderHook(() => useDropdown());

    result.current.containerRef.current = container;
    act(() => result.current.open());

    fireEvent.click(outside);

    expect(result.current.isOpen).toBe(false);
  });

  it('stays open on a click inside the container', () => {
    const container = mountElement<HTMLDivElement>('div');
    const inside = document.createElement('button');
    container.append(inside);

    const { result } = renderHook(() => useDropdown());

    result.current.containerRef.current = container;
    act(() => result.current.open());

    fireEvent.click(inside);

    expect(result.current.isOpen).toBe(true);
  });

  it('ignores a click while it is closed', () => {
    const outside = mountElement<HTMLDivElement>('div');
    const onOutsideClick = vi.fn();

    outside.addEventListener('click', onOutsideClick);
    renderHook(() => useDropdown());

    expect(fireEvent.click(outside)).toBe(true);
    expect(onOutsideClick).toHaveBeenCalled();
  });
});

describe('useDropdown dismissing click', () => {
  it('cancels the click that dismissed it', () => {
    const container = mountElement<HTMLDivElement>('div');
    const outside = mountElement<HTMLAnchorElement>('a');
    const onOutsideClick = vi.fn();

    outside.addEventListener('click', onOutsideClick);

    const { result } = renderHook(() => useDropdown());

    result.current.containerRef.current = container;
    act(() => result.current.open());

    expect(fireEvent.click(outside)).toBe(false);
    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('lets the click through when it lands in the same dropdown group', () => {
    const group = mountElement<HTMLDivElement>('div');
    const container = document.createElement('div');
    const sibling = document.createElement('button');

    group.setAttribute('data-dropdown-group', '');
    group.append(container, sibling);

    const onSiblingClick = vi.fn();
    sibling.addEventListener('click', onSiblingClick);

    const { result } = renderHook(() => useDropdown());

    result.current.containerRef.current = container;
    act(() => result.current.open());

    expect(fireEvent.click(sibling)).toBe(true);
    expect(onSiblingClick).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  it('still cancels clicks outside its own group', () => {
    const group = mountElement<HTMLDivElement>('div');
    const container = document.createElement('div');
    const outside = mountElement<HTMLAnchorElement>('a');

    group.setAttribute('data-dropdown-group', '');
    group.append(container);

    const { result } = renderHook(() => useDropdown());

    result.current.containerRef.current = container;
    act(() => result.current.open());

    expect(fireEvent.click(outside)).toBe(false);
    expect(result.current.isOpen).toBe(false);
  });
});

describe('useDropdown keyboard and cleanup', () => {
  it('closes on Escape and returns focus to the trigger', () => {
    const trigger = mountElement<HTMLButtonElement>('button');
    const { result } = renderHook(() => useDropdown());

    result.current.triggerRef.current = trigger;
    act(() => result.current.open());

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(result.current.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('ignores keys other than Escape', () => {
    const { result } = renderHook(() => useDropdown());

    act(() => result.current.open());

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(result.current.isOpen).toBe(true);
  });

  it('removes the document listeners once it closes', () => {
    const removeEventListener = vi.spyOn(document, 'removeEventListener');
    const { result } = renderHook(() => useDropdown());

    act(() => result.current.open());
    act(() => result.current.close());

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
    expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('removes the document listeners on unmount', () => {
    const removeEventListener = vi.spyOn(document, 'removeEventListener');
    const { result, unmount } = renderHook(() => useDropdown());

    act(() => result.current.open());
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
  });
});
