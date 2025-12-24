import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import type { SelectOption } from './select.type';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Inputs/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Select 크기',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral'],
      description: 'Select 색상',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    preferredPosition: {
      control: 'select',
      options: ['top', 'bottom'],
      description: '드롭다운 기본 위치',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const sampleOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
];

const manyOptions: SelectOption[] = Array.from({ length: 15 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
  disabled: i === 2 || i === 5,
}));

export const Playground: Story = {
  render: () => {
    const [value1, setValue1] = useState<string>();
    const [value2, setValue2] = useState<string>('option2');
    const [value3, setValue3] = useState<string>();
    const [value4, setValue4] = useState<string>();
    const [value5, setValue5] = useState<string>();
    const [value6, setValue6] = useState<string>();
    const [value7, setValue7] = useState<string>();
    const [value8, setValue8] = useState<string>();

    return (
      <div className="space-y-8 p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Basic Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Basic</h3>
            <div className="space-y-4">
              <Select
                options={sampleOptions}
                value={value1}
                onChange={setValue1}
                placeholder="Select an option"
              />
              <Select
                options={sampleOptions}
                value={value2}
                onChange={setValue2}
                placeholder="With selected value"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Colors</h3>
            <div className="flex flex-col gap-4">
              <Select
                options={sampleOptions}
                value={value6}
                onChange={setValue6}
                color="primary"
                placeholder="Primary"
              />
              <Select
                options={sampleOptions}
                value={value7}
                onChange={setValue7}
                color="secondary"
                placeholder="Secondary"
              />
              <Select
                options={sampleOptions}
                value={value8}
                onChange={setValue8}
                color="neutral"
                placeholder="Neutral (default)"
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Sizes</h3>
            <div className="flex flex-col gap-4">
              <Select
                options={sampleOptions}
                value={value3}
                onChange={setValue3}
                size="xs"
                placeholder="Extra Small"
              />
              <Select
                options={sampleOptions}
                value={value3}
                onChange={setValue3}
                size="sm"
                placeholder="Small"
              />
              <Select
                options={sampleOptions}
                value={value3}
                onChange={setValue3}
                size="md"
                placeholder="Medium (default)"
              />
              <Select
                options={sampleOptions}
                value={value3}
                onChange={setValue3}
                size="lg"
                placeholder="Large"
              />
              <Select
                options={sampleOptions}
                value={value3}
                onChange={setValue3}
                size="xl"
                placeholder="Extra Large"
              />
            </div>
          </div>

          {/* States */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">States</h3>
            <div className="flex flex-col gap-4">
              <Select
                options={sampleOptions}
                value={value4}
                onChange={setValue4}
                placeholder="Normal"
              />
              <Select
                options={sampleOptions}
                value="option1"
                onChange={() => {}}
                disabled
                placeholder="Disabled"
              />
              <Select
                options={sampleOptions}
                value={value5}
                onChange={setValue5}
                error
                errorMessage="이 필드는 필수입니다"
                placeholder="Error state"
              />
            </div>
          </div>
        </div>

        {/* With Many Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Many Options (with disabled)</h3>
          <Select
            options={manyOptions}
            value={value1}
            onChange={setValue1}
            placeholder="Select from many options"
          />
        </div>
      </div>
    );
  },
};

