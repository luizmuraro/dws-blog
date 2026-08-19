import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return { ...actual, useNavigate: vi.fn() };
});

const renderAt = (entries: string[]) => {
  vi.mocked(useNavigate).mockReturnValue(navigate);

  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={entries}>
        <Routes>
          <Route path="/" element={<BackButton />} />
          <Route path="/posts/:id" element={<BackButton />} />
        </Routes>
      </MemoryRouter>,
    ),
  };
};

describe('BackButton', () => {
  it('renders a labelled button', () => {
    renderAt(['/']);

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('goes home when there is no history to go back to', async () => {
    const { user } = renderAt(['/posts/post-1']);

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('goes back one entry when the user navigated here', async () => {
    const { user } = renderAt(['/', '/posts/post-1']);

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
