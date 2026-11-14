import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page, Section, TokenLabel } from './style-guide-helpers';

function Swatch({ token }: { token: string }) {
  return (
    <div className="border border-border bg-card">
      <div
        className="h-14 w-full border-border border-b"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="p-3 text-card-foreground">
        <TokenLabel token={token} />
      </div>
    </div>
  );
}

function SwatchGrid({ tokens }: { tokens: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {tokens.map((token) => (
        <Swatch key={token} token={token} />
      ))}
    </div>
  );
}

const TONES = ['violet', 'cyan', 'green', 'amber', 'red', 'blue'] as const;

// Literal class names so Tailwind's scanner sees every pairing.
const TONE_CLASSES: Record<(typeof TONES)[number], string> = {
  violet: 'bg-tone-violet-soft text-tone-violet',
  cyan: 'bg-tone-cyan-soft text-tone-cyan',
  green: 'bg-tone-green-soft text-tone-green',
  amber: 'bg-tone-amber-soft text-tone-amber',
  red: 'bg-tone-red-soft text-tone-red',
  blue: 'bg-tone-blue-soft text-tone-blue',
};

function ColorsPage() {
  return (
    <Page>
      <Section
        title="Surfaces"
        description="Page, card, and popover backgrounds, each with the text color that sits on it."
      >
        <SwatchGrid
          tokens={[
            '--background',
            '--foreground',
            '--card',
            '--card-foreground',
            '--popover',
            '--popover-foreground',
            '--muted',
            '--muted-foreground',
          ]}
        />
      </Section>

      <Section
        title="Actions"
        description="Primary is the one filled action on a view. Secondary and accent are quiet fills for everything else."
      >
        <SwatchGrid
          tokens={[
            '--primary',
            '--primary-foreground',
            '--secondary',
            '--secondary-foreground',
            '--accent',
            '--accent-foreground',
          ]}
        />
      </Section>

      <Section
        title="Status"
        description="Destructive for errors and irreversible actions, warn for caution, ok for success. Ok and warn are safe as text on background and card."
      >
        <SwatchGrid
          tokens={[
            '--destructive',
            '--warn',
            '--warn-foreground',
            '--ok',
            '--ok-foreground',
          ]}
        />
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-ok px-2 py-1 text-ok-foreground">Deployed</span>
          <span className="bg-warn px-2 py-1 text-warn-foreground">Paused</span>
          <span className="font-medium text-ok">Passing</span>
          <span className="font-medium text-warn">Due today</span>
          <span className="font-medium text-destructive">Failed</span>
        </div>
      </Section>

      <Section
        title="Lines and focus"
        description="Border separates regions. Input is a field's edge, and ring is the focus outline. Both hold 3:1 against every surface."
      >
        <SwatchGrid tokens={['--border', '--input', '--ring', '--fx-glow']} />
      </Section>

      <Section
        title="Tones"
        description="Six categorical colors for tags, labels, and data series. Always pair the ink with its soft fill, like bg-tone-blue-soft text-tone-blue. The pairing stays legible in both themes."
      >
        <div className="flex flex-wrap gap-3">
          {TONES.map((tone) => (
            <span
              key={tone}
              className={`px-2 py-1 font-medium text-sm ${TONE_CLASSES[tone]}`}
            >
              {tone}
            </span>
          ))}
        </div>
        <SwatchGrid
          tokens={TONES.flatMap((tone) => [
            `--tone-${tone}`,
            `--tone-${tone}-soft`,
          ])}
        />
      </Section>

      <Section
        title="Charts"
        description="A neutral five-step ramp. Use the tones when series need to read as different categories."
      >
        <SwatchGrid
          tokens={[
            '--chart-1',
            '--chart-2',
            '--chart-3',
            '--chart-4',
            '--chart-5',
          ]}
        />
      </Section>

      <Section
        title="Sidebar"
        description="The sidebar carries its own set so it can sit a step away from the page."
      >
        <SwatchGrid
          tokens={[
            '--sidebar',
            '--sidebar-foreground',
            '--sidebar-primary',
            '--sidebar-primary-foreground',
            '--sidebar-accent',
            '--sidebar-accent-foreground',
            '--sidebar-border',
            '--sidebar-ring',
          ]}
        />
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Style Guide/Colors',
  component: ColorsPage,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof ColorsPage>;

export default meta;

/** Every color token, read live from the active theme. Toggle the theme in the toolbar. */
export const Colors: StoryObj<typeof meta> = {};
