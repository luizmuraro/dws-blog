import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useSearchTerm } from './useSearchTerm';

const renderSearchTerm = (initialEntries = ['/']) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );

  return renderHook(() => ({ ...useSearchTerm(), navigate: useNavigate() }), { wrapper });
};

describe('useSearchTerm', () => {
  it('starts empty when the url carries no query', () => {
    const { result } = renderSearchTerm();

    expect(result.current.term).toBe('');
    expect(result.current.committedTerm).toBe('');
  });

  it('seeds the field from the committed query', () => {
    const { result } = renderSearchTerm(['/?q=react']);

    expect(result.current.term).toBe('react');
    expect(result.current.committedTerm).toBe('react');
  });

  it('lets the field move away from the committed term', () => {
    const { result } = renderSearchTerm(['/?q=react']);

    act(() => result.current.setTerm('design'));

    expect(result.current.term).toBe('design');
    expect(result.current.committedTerm).toBe('react');
  });

  it('re-seeds the field when the route changes', () => {
    const { result } = renderSearchTerm(['/?q=react']);

    act(() => result.current.setTerm('half typed'));
    act(() => result.current.navigate('/?q=design'));

    expect(result.current.term).toBe('design');
    expect(result.current.committedTerm).toBe('design');
  });

  it('clears the field when navigating to a route without a query', () => {
    const { result } = renderSearchTerm(['/?q=react']);

    act(() => result.current.navigate('/'));

    expect(result.current.term).toBe('');
  });
});
