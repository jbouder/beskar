type ThemeChannel = {
  on: (
    event: string,
    listener: (payload: { globals: Record<string, unknown> }) => void,
  ) => void;
};

export const GLOBALS_UPDATED = 'globalsUpdated';

/**
 * Keeps the preview iframe's `.dark` class in step with the toolbar's theme
 * global. Runs outside story decorators so docs pages follow it too.
 */
export function syncPreviewTheme(channel: ThemeChannel, target = document) {
  let currentTheme: 'light' | 'dark' | undefined;

  const setTheme = (theme: unknown) => {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    if (nextTheme === currentTheme) {
      return;
    }

    currentTheme = nextTheme;
    target.documentElement.classList.toggle('dark', nextTheme === 'dark');
    target.body.style.backgroundColor = 'var(--background)';
  };

  setTheme('light');
  channel.on(GLOBALS_UPDATED, ({ globals }) => {
    setTheme(globals.theme);
  });
}
