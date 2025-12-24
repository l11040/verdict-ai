import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import type { IconButtonColor, IconButtonStyle, IconButtonSize } from './icon-button.type';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Inputs/IconButton',
  component: IconButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'neutral'],
      description: '아이콘 버튼의 색상',
    },
    buttonStyle: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '아이콘 버튼의 스타일',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '아이콘 버튼의 크기',
    },
    disabled: {
      control: 'boolean',
      description: '아이콘 버튼 비활성화 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

const colors: IconButtonColor[] = ['primary', 'secondary', 'danger', 'neutral'];
const styles: IconButtonStyle[] = ['solid', 'outline', 'ghost'];
const sizes: IconButtonSize[] = ['xs', 'sm', 'md', 'lg'];

// 공통 아이콘 컴포넌트
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const DeleteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

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
                  <IconButton
                    key={`${color}-${style}`}
                    color={color}
                    buttonStyle={style}
                    aria-label={`${color} ${style} button`}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </IconButton>
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
            <IconButton
              key={size}
              color="primary"
              buttonStyle="solid"
              size={size}
              aria-label={`${size} size button`}
            >
              <PlusIcon className={size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
            </IconButton>
          ))}
        </div>
      </div>

      {/* Different Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Different Icons</h3>
        <div className="flex flex-wrap gap-3">
          <IconButton color="primary" buttonStyle="solid" aria-label="Add">
            <PlusIcon className="w-4 h-4" />
          </IconButton>
          <IconButton color="secondary" buttonStyle="solid" aria-label="Edit">
            <EditIcon className="w-4 h-4" />
          </IconButton>
          <IconButton color="danger" buttonStyle="solid" aria-label="Delete">
            <DeleteIcon className="w-4 h-4" />
          </IconButton>
          <IconButton color="primary" buttonStyle="outline" aria-label="Check">
            <CheckIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Disabled States</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <div key={color} className="flex flex-wrap gap-3">
              {styles.map((style) => (
                <IconButton
                  key={`disabled-${color}-${style}`}
                  color={color}
                  buttonStyle={style}
                  disabled
                  aria-label={`Disabled ${color} ${style} button`}
                >
                  <PlusIcon className="w-4 h-4" />
                </IconButton>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  ),
};

