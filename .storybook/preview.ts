import type { Preview } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
// Tokens, fonts, and base styles. The same file the `theme` item ships.
import '../registry/beskar/globals.css';
import './preview.css';
import { syncPreviewTheme } from './theme';

syncPreviewTheme(addons.getChannel());

const preview: Preview = {
  // An autodocs page, with the "Show code" snippet, for every component.
  tags: ['autodocs'],
  // One theme control for both Storybook contexts: the preview channel themes
  // the iframe, and manager.ts watches the same global to theme the chrome.
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'Style Guide',
          ['Colors', 'Typography', 'Icons', 'Motion'],
          'Components',
          'Hooks',
        ],
      },
    },
    // Run axe in the Vitest addon's browser tests and fail on any violation.
    a11y: { test: 'error' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
