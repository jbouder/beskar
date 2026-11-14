import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useIsMobile } from '@/hooks/use-mobile';

/** jsdom has no `matchMedia`. This stand-in follows `window.innerWidth`. */
function installMatchMedia() {
  const listeners = new Set<() => void>();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: (_: string, listener: () => void) =>
        listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) =>
        listeners.delete(listener),
    })),
  );
  return {
    listeners,
    resize(width: number) {
      vi.stubGlobal('innerWidth', width);
      for (const listener of listeners) listener();
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useIsMobile', () => {
  it('is false at desktop width', () => {
    installMatchMedia();
    vi.stubGlobal('innerWidth', 1280);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('is true below the md breakpoint and follows resizes', () => {
    const media = installMatchMedia();
    vi.stubGlobal('innerWidth', 500);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    act(() => media.resize(1024));
    expect(result.current).toBe(false);

    act(() => media.resize(767));
    expect(result.current).toBe(true);
  });

  it('stops listening on unmount', () => {
    const media = installMatchMedia();
    vi.stubGlobal('innerWidth', 1280);

    const { unmount } = renderHook(() => useIsMobile());
    expect(media.listeners.size).toBe(1);

    unmount();
    expect(media.listeners.size).toBe(0);
  });
});
