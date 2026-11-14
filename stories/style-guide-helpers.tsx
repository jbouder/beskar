import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

/**
 * Reads a CSS custom property's authored value off the document root and keeps
 * it in step with the active theme, so the Style Guide mirrors `globals.css`
 * instead of restating its values.
 */
export function useTokenValue(token: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    const read = () => {
      setValue(
        getComputedStyle(document.documentElement)
          .getPropertyValue(token)
          .trim(),
      );
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [token]);
  return value;
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl space-y-10 p-6 text-foreground">
      {children}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-heading font-semibold text-lg">{title}</h2>
        {description ? (
          <p className="max-w-prose text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** A token name in mono, with its live value under it. */
export function TokenLabel({ token }: { token: string }) {
  const value = useTokenValue(token);
  return (
    <div className="space-y-0.5">
      <div className="font-mono text-xs">{token}</div>
      <div className="break-all font-mono text-muted-foreground text-xs">
        {value || '...'}
      </div>
    </div>
  );
}
