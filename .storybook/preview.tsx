import type { Decorator, Preview } from '@storybook/react-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '../src/styles/global.scss';
import { createAppStore } from '../src/store';

const withStore: Decorator = (Story, context) => (
  <Provider store={createAppStore(context.parameters.preloadedState)}>
    <Story />
  </Provider>
);

const withRouter: Decorator = (Story, context) => (
  <MemoryRouter initialEntries={[context.parameters.route ?? '/']}>
    <Story />
  </MemoryRouter>
);

const preview: Preview = {
  decorators: [withStore, withRouter],
  parameters: {
    layout: 'centered',
    viewport: { options: INITIAL_VIEWPORTS },
    backgrounds: {
      options: {
        app: { name: 'App', value: '#f0f0f2' },
        surface: { name: 'Surface', value: '#ffffff' },
        primary: { name: 'Primary', value: '#060725' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'app' },
  },
};

export default preview;
