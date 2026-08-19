import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { useFocusOnOpen } from './useFocusOnOpen';

const mountRefs = () => {
  const input = document.createElement('input');
  const trigger = document.createElement('button');

  input.value = 'react';
  document.body.append(input, trigger);
  trigger.focus();

  return {
    targetRef: createRef<HTMLInputElement>(),
    restoreRef: createRef<HTMLElement>(),
    input,
    trigger,
  };
};

const renderFocus = (isOpen: boolean) => {
  const { targetRef, restoreRef, input, trigger } = mountRefs();

  Object.assign(targetRef, { current: input });
  Object.assign(restoreRef, { current: trigger });

  const view = renderHook(({ open }) => useFocusOnOpen(open, targetRef, restoreRef), {
    initialProps: { open: isOpen },
  });

  return { ...view, input, trigger };
};

describe('useFocusOnOpen', () => {
  it('focuses and selects the target when it opens', () => {
    const { input } = renderFocus(true);

    expect(document.activeElement).toBe(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('react'.length);
  });

  it('leaves focus alone while it stays closed', () => {
    const { trigger } = renderFocus(false);

    expect(document.activeElement).toBe(trigger);
  });

  it('restores focus to the trigger once it closes', () => {
    const { rerender, input, trigger } = renderFocus(true);

    expect(document.activeElement).toBe(input);

    rerender({ open: false });

    expect(document.activeElement).toBe(trigger);
  });
});
