import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './index';
import type { TooltipPosition, TooltipColor, TooltipSize } from './tooltip.type';
import { Button } from '../../inputs/button';
import { IconButton } from '../../inputs/icon-button';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/DataDisplay/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Tooltip 내용',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip 위치',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Tooltip 색상',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tooltip 크기',
    },
    delay: {
      control: 'number',
      description: 'Tooltip 표시 지연 시간 (ms)',
    },
    hideDelay: {
      control: 'number',
      description: 'Tooltip 숨김 지연 시간 (ms)',
    },
    disabled: {
      control: 'boolean',
      description: 'Tooltip 비활성화 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const colors: TooltipColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];
const positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];
const sizes: TooltipSize[] = ['sm', 'md', 'lg'];

export const Playground: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      {/* Basic Tooltip */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Basic Tooltip</h3>
        <div className="space-y-4">
          <div className="text-sm text-neutral-300">마우스를 올려보세요</div>
          <div className="flex flex-wrap gap-4 items-center">
            <Tooltip content="기본 Tooltip입니다">
              <Button buttonStyle="solid" color="primary" size="md">
                Hover me
              </Button>
            </Tooltip>
            <Tooltip content="Primary 색상 Tooltip" color="primary">
              <Button buttonStyle="solid" color="primary" size="md">
                Primary
              </Button>
            </Tooltip>
            <Tooltip content="Success 색상 Tooltip" color="success">
              <Button buttonStyle="solid" color="success" size="md">
                Success
              </Button>
            </Tooltip>
            <Tooltip content="Warning 색상 Tooltip" color="warning">
              <Button buttonStyle="solid" color="warning" size="md">
                Warning
              </Button>
            </Tooltip>
            <Tooltip content="Danger 색상 Tooltip" color="danger">
              <Button buttonStyle="solid" color="danger" size="md">
                Danger
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Positions</h3>
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-8">
            <Tooltip content="Top position" position="top" color="primary">
              <Button buttonStyle="solid" color="primary" size="md">
                Top
              </Button>
            </Tooltip>
            <div className="flex items-center gap-8">
              <Tooltip content="Left position" position="left" color="primary">
                <Button buttonStyle="solid" color="primary" size="md">
                  Left
                </Button>
              </Tooltip>
              <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                <span className="text-xs text-neutral-400">Center</span>
              </div>
              <Tooltip content="Right position" position="right" color="primary">
                <Button buttonStyle="solid" color="primary" size="md">
                  Right
                </Button>
              </Tooltip>
            </div>
            <Tooltip content="Bottom position" position="bottom" color="primary">
              <Button buttonStyle="solid" color="primary" size="md">
                Bottom
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Colors</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {colors.map((color) => (
              <Tooltip key={color} content={`${color} color tooltip`} color={color}>
                <Button buttonStyle="solid" color={color} size="md">
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Sizes</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            {sizes.map((size) => (
              <Tooltip key={size} content={`${size.toUpperCase()} size tooltip`} size={size} color="primary">
                <Button buttonStyle="solid" color="primary" size="md">
                  {size.toUpperCase()}
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* With Delay */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">With Delay</h3>
        <div className="space-y-4">
          <div className="text-sm text-neutral-300">마우스를 올린 후 500ms 후에 표시됩니다</div>
          <div className="flex flex-wrap gap-4">
            <Tooltip content="500ms delay" delay={500} color="primary">
              <Button buttonStyle="solid" color="primary" size="md">
                Delay 500ms
              </Button>
            </Tooltip>
            <Tooltip content="1000ms delay" delay={1000} color="secondary">
              <Button buttonStyle="solid" color="secondary" size="md">
                Delay 1000ms
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Usage Examples</h3>
        <div className="space-y-6">
          {/* With IconButton */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">With IconButton</div>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="알림" position="bottom">
                <IconButton
                  size="md"
                  buttonStyle="ghost"
                  aria-label="Notifications"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  }
                />
              </Tooltip>
              <Tooltip content="설정" position="bottom">
                <IconButton
                  size="md"
                  buttonStyle="ghost"
                  aria-label="Settings"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                />
              </Tooltip>
              <Tooltip content="삭제" position="bottom" color="danger">
                <IconButton
                  size="md"
                  buttonStyle="ghost"
                  color="danger"
                  aria-label="Delete"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  }
                />
              </Tooltip>
            </div>
          </div>

          {/* With Text Link */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">With Text Link</div>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="더 자세한 정보를 확인하세요" position="top">
                <a
                  href="#"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  자세히 보기
                </a>
              </Tooltip>
              <Tooltip content="외부 링크로 이동합니다" position="top" color="success">
                <a
                  href="#"
                  className="text-success-600 dark:text-success-400 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  외부 링크
                </a>
              </Tooltip>
            </div>
          </div>

          {/* With Disabled Button */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">With Disabled Button</div>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="이 버튼은 비활성화되어 있습니다" position="top">
                <Button buttonStyle="solid" color="primary" size="md" disabled>
                  Disabled Button
                </Button>
              </Tooltip>
              <Tooltip content="이 기능은 곧 사용 가능합니다" position="top" color="warning">
                <Button buttonStyle="outline" color="neutral" size="md" disabled>
                  Coming Soon
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* With Long Content */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">With Long Content</div>
            <div className="flex flex-wrap gap-4">
              <Tooltip
                content="이것은 매우 긴 Tooltip 내용입니다. 여러 줄로 표시될 수 있으며, 사용자에게 추가 정보를 제공합니다."
                position="top"
                size="md"
              >
                <Button buttonStyle="solid" color="primary" size="md">
                  Long Content
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  <div>
                    <div className="font-semibold mb-1">제목</div>
                    <div className="text-xs opacity-90">부제목 또는 설명 텍스트</div>
                  </div>
                }
                position="top"
                size="md"
                color="primary"
              >
                <Button buttonStyle="solid" color="primary" size="md">
                  Rich Content
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* All Positions Grid */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">All Positions</div>
            <div className="grid grid-cols-3 gap-8 place-items-center p-8 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <div />
              <Tooltip content="Top position" position="top" color="primary">
                <Button buttonStyle="solid" color="primary" size="sm">
                  Top
                </Button>
              </Tooltip>
              <div />
              <Tooltip content="Left position" position="left" color="primary">
                <Button buttonStyle="solid" color="primary" size="sm">
                  Left
                </Button>
              </Tooltip>
              <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                <span className="text-xs text-neutral-400">Center</span>
              </div>
              <Tooltip content="Right position" position="right" color="primary">
                <Button buttonStyle="solid" color="primary" size="sm">
                  Right
                </Button>
              </Tooltip>
              <div />
              <Tooltip content="Bottom position" position="bottom" color="primary">
                <Button buttonStyle="solid" color="primary" size="sm">
                  Bottom
                </Button>
              </Tooltip>
              <div />
            </div>
          </div>

          {/* Card Example */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">Card Example</div>
            <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">User Profile</h4>
                <Tooltip content="프로필 편집" position="bottom">
                  <IconButton
                    size="sm"
                    buttonStyle="ghost"
                    aria-label="Edit"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    }
                  />
                </Tooltip>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <span className="text-lg font-medium text-primary-600 dark:text-primary-400">JD</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">John Doe</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">john.doe@example.com</div>
                </div>
                <Tooltip content="삭제" position="left" color="danger">
                  <IconButton
                    size="sm"
                    buttonStyle="ghost"
                    color="danger"
                    aria-label="Delete"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    }
                  />
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <Tooltip content="메시지 보내기" position="top">
                  <Button buttonStyle="solid" color="primary" size="sm">
                    Message
                  </Button>
                </Tooltip>
                <Tooltip content="프로필 보기" position="top">
                  <Button buttonStyle="outline" color="neutral" size="sm">
                    View Profile
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

