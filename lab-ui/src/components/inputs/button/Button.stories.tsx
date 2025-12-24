import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import type { ButtonColor, ButtonStyle, ButtonSize } from './button.type';

const meta: Meta<typeof Button> = {
  title: 'Components/Inputs/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'neutral'],
      description: '버튼의 색상',
    },
    buttonStyle: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '버튼의 스타일',
    },
    size: {
      control: 'select',
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '버튼의 크기',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
    },
    children: {
      control: 'text',
      description: '버튼 내부 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

const colors: ButtonColor[] = ['primary', 'secondary', 'danger', 'neutral'];
const styles: ButtonStyle[] = ['solid', 'outline', 'ghost'];
const sizes: ButtonSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const Playground: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      {/* Color and Style Combinations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Color and Style Combinations</h3>
        <div className="space-y-6">
          {colors.map((color) => (
            <div key={color} className="space-y-2">
              <div className="text-sm font-medium text-neutral-300">
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </div>
              <div className="flex flex-wrap gap-3">
                {styles.map((style) => (
                  <Button key={`${color}-${style}`} color={color} buttonStyle={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Button key={size} color="primary" buttonStyle="solid" size={size}>
              {size.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Disabled States</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <div key={color} className="flex flex-wrap gap-3">
              {styles.map((style) => (
                <Button key={`disabled-${color}-${style}`} color={color} buttonStyle={style} disabled>
                  {color} {style}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">With Icons</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            color="primary"
            buttonStyle="solid"
            start={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Item
          </Button>
          <Button
            color="primary"
            buttonStyle="solid"
            end={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            Next
          </Button>
          <Button
            color="danger"
            buttonStyle="solid"
            start={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  ),
};

