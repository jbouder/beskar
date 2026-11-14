import {
  ArrowRightIcon,
  BellIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  CheckIcon,
  CopyIcon,
  DotsThreeIcon,
  GearIcon,
  type IconWeight,
  MagnifyingGlassIcon,
  MoonIcon,
  PencilSimpleIcon,
  PlusIcon,
  SunIcon,
  TrashIcon,
  UserIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page, Section } from './style-guide-helpers';

const ICONS = [
  ['PlusIcon', PlusIcon],
  ['XIcon', XIcon],
  ['CheckIcon', CheckIcon],
  ['CaretDownIcon', CaretDownIcon],
  ['ArrowRightIcon', ArrowRightIcon],
  ['MagnifyingGlassIcon', MagnifyingGlassIcon],
  ['DotsThreeIcon', DotsThreeIcon],
  ['PencilSimpleIcon', PencilSimpleIcon],
  ['TrashIcon', TrashIcon],
  ['CopyIcon', CopyIcon],
  ['GearIcon', GearIcon],
  ['UserIcon', UserIcon],
  ['BellIcon', BellIcon],
  ['CalendarBlankIcon', CalendarBlankIcon],
  ['WarningIcon', WarningIcon],
  ['SunIcon', SunIcon],
  ['MoonIcon', MoonIcon],
] as const;

const WEIGHTS: IconWeight[] = ['regular', 'bold', 'fill', 'duotone'];

type IconsPageProps = {
  /** Phosphor weight. Regular is the default across Beskar. */
  weight: IconWeight;
};

function IconsPage({ weight }: IconsPageProps) {
  return (
    <Page>
      <Section
        title="Phosphor"
        description={
          <>
            Beskar uses Phosphor icons from{' '}
            <code className="font-mono">@phosphor-icons/react</code>. Import the
            names that end in <code className="font-mono">Icon</code>. Icons
            inherit the text color.
          </>
        }
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ICONS.map(([name, Icon]) => (
            <li
              key={name}
              className="flex items-center gap-3 border border-border p-3"
            >
              <Icon aria-hidden className="size-5 shrink-0" weight={weight} />
              <span className="truncate font-mono text-xs">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Sizes"
        description="size-4 inside buttons, inputs, and menus. size-5 standing alone in a toolbar. Larger sizes are for empty states."
      >
        <div className="flex items-end gap-6">
          {(
            [
              ['size-3.5', 'size-3.5'],
              ['size-4', 'size-4'],
              ['size-5', 'size-5'],
              ['size-6', 'size-6'],
              ['size-8', 'size-8'],
            ] as const
          ).map(([label, className]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <GearIcon aria-hidden className={className} weight={weight} />
              <span className="font-mono text-muted-foreground text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Weights"
        description="Regular everywhere. Use fill for a selected or active state, and bold only when an icon must hold up at a small size."
      >
        <div className="flex gap-6">
          {WEIGHTS.map((w) => (
            <div key={w} className="flex flex-col items-center gap-2">
              <BellIcon aria-hidden className="size-6" weight={w} />
              <span className="font-mono text-muted-foreground text-xs">
                {w}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Accessibility"
        description="An icon next to a text label is decoration: mark it aria-hidden. An icon-only control needs an accessible name on the control, not on the icon."
      >
        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-input px-3 py-1.5 text-sm"
          >
            <PlusIcon aria-hidden className="size-4" />
            New note
          </button>
          <button
            type="button"
            aria-label="Delete note"
            className="inline-flex size-8 items-center justify-center border border-input"
          >
            <TrashIcon aria-hidden className="size-4" />
          </button>
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Style Guide/Icons',
  component: IconsPage,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    weight: { control: 'inline-radio', options: WEIGHTS },
  },
  args: { weight: 'regular' },
} satisfies Meta<typeof IconsPage>;

export default meta;

/** The icon set, sizes, weights, and how to label icons. */
export const Icons: StoryObj<typeof meta> = {};
