import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './index';
import type { CardVariant, CardSize, CardPadding, CardColor } from './card.type';

const meta: Meta<typeof Card> = {
  title: 'Components/Surfaces/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'elevated'],
      description: 'Card의 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Card의 크기',
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Card의 패딩',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Card의 색상 (테두리, 그림자 등에 적용)',
    },
    children: {
      control: 'text',
      description: 'Card 내부 내용',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const variants: CardVariant[] = ['outlined', 'filled', 'elevated'];
const sizes: CardSize[] = ['sm', 'md', 'lg', 'xl'];
const paddings: CardPadding[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
const colors: CardColor[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];

export const Playground: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {variants.map((variant) => (
            <Card key={variant} variant={variant}>
              <div className="space-y-2">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This is a {variant} card with default padding.
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Padding Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Padding Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {paddings.map((padding) => (
            <Card key={padding} variant="outlined" padding={padding}>
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded">
                <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 p-1 text-center">
                  {padding}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sizes.map((size) => (
            <Card key={size} variant="elevated" size={size}>
              <div className="space-y-2">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Size: {size.toUpperCase()}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This card uses the {size} size option.
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Combination Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Combination Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="outlined" padding="lg">
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Outlined Card
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                This is an outlined card with large padding. Perfect for content that needs breathing room.
              </p>
              <div className="pt-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Action
                </button>
              </div>
            </div>
          </Card>

          <Card variant="filled" padding="md">
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Filled Card
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                This is a filled card with medium padding. Great for secondary content sections.
              </p>
              <div className="pt-2">
                <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  Action
                </button>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="xl">
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Elevated Card
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                This is an elevated card with extra large padding. Ideal for featured content with shadow elevation.
              </p>
              <div className="pt-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Action
                </button>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Compact Card
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                This card uses small padding for a more compact layout.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* No Padding Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          No Padding (Custom Content)
        </h3>
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center">
            <div className="text-white text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium">Image Area</p>
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Image Card
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Card with no padding allows for full-bleed images or custom layouts.
            </p>
          </div>
        </Card>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Colors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {colors.map((color) => (
            <Card
              key={color}
              variant="outlined"
              color={color}
              padding="md"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Color: {color}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  ),
};


