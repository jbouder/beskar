import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page, Section, TokenLabel } from './style-guide-helpers';

const SCALE: { name: string; className: string; use: string }[] = [
  {
    name: 'text-4xl',
    className: 'font-heading font-semibold text-4xl tracking-tight',
    use: 'Page title',
  },
  {
    name: 'text-2xl',
    className: 'font-heading font-semibold text-2xl',
    use: 'Section or card title',
  },
  {
    name: 'text-lg',
    className: 'font-heading font-semibold text-lg',
    use: 'Subsection',
  },
  { name: 'text-base', className: 'text-base', use: 'Long-form body' },
  { name: 'text-sm', className: 'text-sm', use: 'Default UI text' },
  {
    name: 'text-xs',
    className: 'text-xs',
    use: 'Labels, captions, and component text',
  },
];

const WEIGHTS: { name: string; className: string }[] = [
  { name: 'font-normal (400)', className: 'font-normal' },
  { name: 'font-medium (500)', className: 'font-medium' },
  { name: 'font-semibold (600)', className: 'font-semibold' },
  { name: 'font-bold (700)', className: 'font-bold' },
];

function TypographyPage() {
  return (
    <Page>
      <Section
        title="Families"
        description="Oxanium carries the UI and the headings. JetBrains Mono is for code, IDs, and tabular figures only."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 border border-border bg-card p-4 text-card-foreground">
            <p className="font-sans text-3xl">Oxanium Variable</p>
            <p className="font-sans text-sm">
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>
            <TokenLabel token="--font-sans" />
          </div>
          <div className="space-y-3 border border-border bg-card p-4 text-card-foreground">
            <p className="font-mono text-3xl">JetBrains Mono</p>
            <p className="font-mono text-sm">
              {'const beskar = forge(); // 0123456789'}
            </p>
            <TokenLabel token="--font-mono" />
          </div>
        </div>
      </Section>

      <Section
        title="Scale"
        description="Tailwind's default type scale. Headings use font-heading, which points at the sans family."
      >
        <div className="divide-y divide-border border border-border">
          {SCALE.map((step) => (
            <div
              key={step.name}
              className="grid items-baseline gap-2 p-4 sm:grid-cols-[1fr_14rem]"
            >
              <p className={step.className}>Forged for the long haul</p>
              <div className="text-muted-foreground text-xs">
                <span className="font-mono">{step.name}</span>
                <span className="block">{step.use}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Weights">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WEIGHTS.map((weight) => (
            <div key={weight.name} className="border border-border p-4">
              <p className={`text-2xl ${weight.className}`}>Aa</p>
              <p className="font-mono text-muted-foreground text-xs">
                {weight.name}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Text colors"
        description="Foreground for content, muted-foreground for supporting text. Both pass 4.5:1 on background and card."
      >
        <div className="space-y-1 text-sm">
          <p>Foreground: the task is due on Friday.</p>
          <p className="text-muted-foreground">
            Muted foreground: last edited two hours ago.
          </p>
        </div>
      </Section>

      <Section
        title="Numbers"
        description="Use tabular-nums on counters, timers, and columns of figures so digits do not jitter."
      >
        <div className="grid max-w-xs grid-cols-2 gap-x-6 font-mono text-sm tabular-nums">
          <span>1,204.50</span>
          <span>00:41:07</span>
          <span>987.25</span>
          <span>12:00:59</span>
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Style Guide/Typography',
  component: TypographyPage,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof TypographyPage>;

export default meta;

/** Font families, the type scale, weights, and text colors. */
export const Typography: StoryObj<typeof meta> = {};
