import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Page, Section, TokenLabel } from './style-guide-helpers';

const DURATIONS = [
  ['--duration-fast', 'Hover, press, and focus feedback'],
  ['--duration-base', 'Menus, popovers, tooltips, toggles'],
  ['--duration-slow', 'Dialogs, sheets, and page-level changes'],
] as const;

const EASINGS = [
  ['--ease-standard', 'State changes that stay in place'],
  ['--ease-emphasized', 'Things that enter or leave the screen'],
] as const;

function Track({
  duration,
  easing,
  moved,
}: {
  duration: string;
  easing: string;
  moved: boolean;
}) {
  return (
    <div className="relative h-8 border border-border bg-muted">
      <div
        className="absolute top-0 left-0 h-full w-8 bg-primary"
        style={{
          translate: moved ? 'calc(min(64rem, 100vw) * 0.3)' : '0',
          transitionProperty: 'translate',
          transitionDuration: `var(${duration})`,
          transitionTimingFunction: `var(${easing})`,
        }}
      />
    </div>
  );
}

function MotionPage() {
  const [moved, setMoved] = useState(false);

  return (
    <Page>
      <Section
        title="Play"
        description="Run every row at once to compare the tokens. With reduced motion turned on in the OS, each one becomes a cut."
      >
        <button
          type="button"
          onClick={() => setMoved((value) => !value)}
          className="border border-input px-3 py-1.5 text-sm"
        >
          {moved ? 'Reset' : 'Play'}
        </button>
      </Section>

      <Section
        title="Durations"
        description="Three steps. Pick by how far the change travels, not by taste."
      >
        <div className="space-y-4">
          {DURATIONS.map(([token, use]) => (
            <div
              key={token}
              className="grid items-center gap-3 sm:grid-cols-[14rem_1fr]"
            >
              <div>
                <TokenLabel token={token} />
                <p className="text-muted-foreground text-xs">{use}</p>
              </div>
              <Track duration={token} easing="--ease-standard" moved={moved} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Easings" description="Shown at the slow duration.">
        <div className="space-y-4">
          {EASINGS.map(([token, use]) => (
            <div
              key={token}
              className="grid items-center gap-3 sm:grid-cols-[14rem_1fr]"
            >
              <div>
                <TokenLabel token={token} />
                <p className="text-muted-foreground text-xs">{use}</p>
              </div>
              <Track duration="--duration-slow" easing={token} moved={moved} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Rules">
        <ul className="max-w-prose list-disc space-y-1 pl-5 text-sm">
          <li>
            Never write a duration or easing as a literal. Use the tokens:{' '}
            <code className="font-mono text-xs">
              duration-(--duration-base) ease-(--ease-standard)
            </code>
            .
          </li>
          <li>
            Animate opacity, translate, and scale. Leave layout properties
            alone.
          </li>
          <li>
            Motion explains a change. If removing it loses no meaning, gate it
            with <code className="font-mono text-xs">motion-safe:</code>.
          </li>
          <li>
            The theme turns every transition and animation into a cut when the
            OS asks for reduced motion.
          </li>
        </ul>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Style Guide/Motion',
  component: MotionPage,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof MotionPage>;

export default meta;

/** Duration and easing tokens, with a live comparison. */
export const Motion: StoryObj<typeof meta> = {};
