import type { Decorator } from '@storybook/react-vite';

export const withSearchFieldFrame =
  (reservedSpace: string): Decorator =>
  (Story) => (
    <div style={{ paddingBottom: reservedSpace }}>
      <div style={{ position: 'relative', width: 'min(33.5rem, 100%)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '3.5rem',
            padding: 'var(--space-8) var(--space-8) var(--space-8) var(--space-16)',
            color: 'var(--color-neutral-dark)',
            backgroundColor: 'var(--color-neutral-lightest)',
            border: '1px solid var(--color-neutral-extra-light)',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 3px 18.1px rgb(91 123 193 / 29%)',
          }}
        >
          Search
        </div>
        <Story />
      </div>
    </div>
  );
