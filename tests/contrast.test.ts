/**
 * WCAG contrast for every text-on-surface pairing the theme promises, in light
 * and dark. Reads the values from `globals.css`, so a token edit that breaks a
 * pairing fails here before it reaches a component.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deriveThemeItem } from '../scripts/derive-theme-item';

const { light, dark } = deriveThemeItem(
  readFileSync(
    resolve(import.meta.dirname, '../registry/beskar/globals.css'),
    'utf8',
  ),
).cssVars;

/** Relative luminance of an opaque `oklch(L C H)` color. */
function luminance(value: string): number {
  const match = value.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/);
  if (!match) throw new Error(`Not an opaque oklch() color: ${value}`);
  const [L, C, H] = match.slice(1).map(Number);
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  // OKLab to linear sRGB (Björn Ottosson's reference matrices).
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (channel: number) => Math.min(1, Math.max(0, channel));
  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);

  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

function contrast(foreground: string, background: string): number {
  const [hi, lo] = [luminance(foreground), luminance(background)].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

const TONES = ['violet', 'cyan', 'green', 'amber', 'red', 'blue'];

// [text token, surface token]. Body-size text: 4.5:1.
const TEXT_PAIRS: [string, string][] = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['accent-foreground', 'accent'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'card'],
  ['muted-foreground', 'muted'],
  ['ok-foreground', 'ok'],
  ['warn-foreground', 'warn'],
  ['ok', 'background'],
  ['ok', 'card'],
  ['warn', 'background'],
  ['warn', 'card'],
  ['destructive', 'background'],
  ['destructive', 'card'],
  ['sidebar-foreground', 'sidebar'],
  ['sidebar-primary-foreground', 'sidebar-primary'],
  ['sidebar-accent-foreground', 'sidebar-accent'],
  ...TONES.map((tone): [string, string] => [
    `tone-${tone}`,
    `tone-${tone}-soft`,
  ]),
];

describe.each([
  ['light', light],
  ['dark', { ...light, ...dark }],
])('%s theme contrast', (_name, tokens) => {
  it.each(TEXT_PAIRS)('%s on %s is at least 4.5:1', (text, surface) => {
    expect(contrast(tokens[text], tokens[surface])).toBeGreaterThanOrEqual(4.5);
  });

  it('the focus ring is at least 3:1 on background and card', () => {
    expect(contrast(tokens.ring, tokens.background)).toBeGreaterThanOrEqual(3);
    expect(contrast(tokens.ring, tokens.card)).toBeGreaterThanOrEqual(3);
  });
});
