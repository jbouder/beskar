import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { GLOBALS_UPDATED } from './theme';

// Neutral chrome that matches the base-lyra neutral palette.
const lightTheme = create({
  base: 'light',
  brandTitle: 'Beskar',
  brandUrl: 'https://github.com/jbouder/beskar',
  colorPrimary: '#171717',
  colorSecondary: '#171717',
  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appHoverBg: '#f5f5f5',
  appPreviewBg: '#ffffff',
  appBorderColor: '#d4d4d4',
  appBorderRadius: 0,
  inputBorderRadius: 0,
  textColor: '#0a0a0a',
  textMutedColor: '#525252',
  barTextColor: '#525252',
  barHoverColor: '#0a0a0a',
  barSelectedColor: '#171717',
  barBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#a3a3a3',
  inputTextColor: '#0a0a0a',
});

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Beskar',
  brandUrl: 'https://github.com/jbouder/beskar',
  colorPrimary: '#e5e5e5',
  colorSecondary: '#e5e5e5',
  appBg: '#0a0a0a',
  appContentBg: '#171717',
  appHoverBg: '#262626',
  appPreviewBg: '#0a0a0a',
  appBorderColor: '#404040',
  appBorderRadius: 0,
  inputBorderRadius: 0,
  textColor: '#fafafa',
  textMutedColor: '#a3a3a3',
  barTextColor: '#a3a3a3',
  barHoverColor: '#fafafa',
  barSelectedColor: '#e5e5e5',
  barBg: '#171717',
  inputBg: '#171717',
  inputBorder: '#737373',
  inputTextColor: '#fafafa',
});

export const managerThemes = {
  light: lightTheme,
  dark: darkTheme,
};

function setManagerTheme(theme: unknown) {
  addons.setConfig({
    theme: theme === 'dark' ? managerThemes.dark : managerThemes.light,
  });
}

addons.register('beskar/theme-sync', (api) => {
  setManagerTheme(api.getGlobals().theme);
  api.getChannel()?.on(GLOBALS_UPDATED, ({ globals }) => {
    setManagerTheme(globals.theme);
  });
});
