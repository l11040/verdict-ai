import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';
import type { TextFieldColor, TextFieldSize } from './text-field.type';

const meta: Meta<typeof TextField> = {
  title: 'Components/Inputs/TextField',
  component: TextField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral'],
      description: 'TextField의 색상',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'TextField의 크기',
    },
    disabled: {
      control: 'boolean',
      description: 'TextField 비활성화 여부',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    helperText: {
      control: 'text',
      description: '도움말 텍스트',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

const colors: TextFieldColor[] = ['primary', 'secondary', 'neutral'];
const sizes: TextFieldSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const Playground: Story = {
  render: () => (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Basic TextField */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Basic TextField</h3>
            <div className="space-y-4">
              <TextField placeholder="Enter text..." />
              <TextField label="Label" placeholder="Enter text..." />
              <TextField label="Label" helperText="This is a helper text" placeholder="Enter text..." />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Colors</h3>
            <div className="space-y-4">
              {colors.map((color) => (
                <TextField
                  key={color}
                  label={`${color.charAt(0).toUpperCase() + color.slice(1)} Color`}
                  color={color}
                  placeholder="Enter text..."
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Sizes</h3>
            <div className="space-y-4">
              {sizes.map((size) => (
                <TextField
                  key={size}
                  label={`${size.toUpperCase()} Size`}
                  size={size}
                  placeholder="Enter text..."
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Error States */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Error States</h3>
            <div className="space-y-4">
              <TextField
                label="Error TextField"
                error
                errorMessage="This is an error message"
                placeholder="Enter text..."
              />
              {colors.map((color) => (
                <TextField
                  key={color}
                  label={`${color.charAt(0).toUpperCase() + color.slice(1)} Error`}
                  color={color}
                  error
                  errorMessage="This is an error message"
                  placeholder="Enter text..."
                />
              ))}
            </div>
          </div>

          {/* Disabled States */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Disabled States</h3>
            <div className="space-y-4">
              <TextField label="Disabled TextField" disabled placeholder="Enter text..." />
              <TextField
                label="Disabled with Value"
                disabled
                value="Disabled value"
                placeholder="Enter text..."
              />
            </div>
          </div>

          {/* With Icons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">With Icons</h3>
            <div className="space-y-4">
              <TextField
                label="With Start Icon"
                startIcon={
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                placeholder="Enter username..."
              />
              <TextField
                label="With End Icon"
                endIcon={
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                }
                type="password"
                placeholder="Enter password..."
              />
              <TextField
                label="With Both Icons"
                startIcon={
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                endIcon={
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                }
                placeholder="Enter email..."
              />
            </div>
          </div>

          {/* Different Input Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Different Input Types</h3>
            <div className="space-y-4">
              <TextField label="Email" type="email" placeholder="example@email.com" />
              <TextField label="Password" type="password" placeholder="Enter password..." />
              <TextField label="Number" type="number" placeholder="Enter number..." />
              <TextField label="Search" type="search" placeholder="Search..." />
              <TextField label="URL" type="url" placeholder="https://example.com" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

