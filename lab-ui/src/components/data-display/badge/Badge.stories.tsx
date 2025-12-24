import type { Meta, StoryObj } from '@storybook/react';
import { Badge, BadgeOverlay } from './index';
import { IconButton } from '../../inputs/icon-button/IconButton';
import type { BadgeColor, BadgeVariant, BadgeSize } from './badge.type';

const meta: Meta<typeof Badge> = {
  title: 'Components/DataDisplay/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Badge의 색상',
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'soft'],
      description: 'Badge의 스타일',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Badge의 크기',
    },
    dot: {
      control: 'boolean',
      description: 'Dot만 표시 여부',
    },
    count: {
      control: 'number',
      description: '숫자 표시',
    },
    maxCount: {
      control: 'number',
      description: '최대 숫자 제한',
    },
    children: {
      control: 'text',
      description: 'Badge 내부 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

const colors: BadgeColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];
const variants: BadgeVariant[] = ['solid', 'outline', 'soft'];
const sizes: BadgeSize[] = ['xs', 'sm', 'md', 'lg'];

export const Playground: Story = {
  render: () => (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Basic Badge */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Basic Badge</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge color="primary">Primary</Badge>
                <Badge color="secondary">Secondary</Badge>
                <Badge color="success">Success</Badge>
                <Badge color="warning">Warning</Badge>
                <Badge color="danger">Danger</Badge>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Variants</h3>
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant} className="space-y-2">
                  <div className="text-sm font-medium text-neutral-300">
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <Badge key={`${variant}-${color}`} variant={variant} color={color}>
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Sizes</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {sizes.map((size) => (
                  <Badge key={size} size={size} color="primary">
                    {size.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* With Icons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">With Icons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  color="success"
                  startIcon={
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  }
                >
                  Verified
                </Badge>
                <Badge
                  color="warning"
                  startIcon={
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  }
                >
                  Warning
                </Badge>
                <Badge
                  color="danger"
                  endIcon={
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  }
                >
                  Remove
                </Badge>
                <Badge
                  color="primary"
                  startIcon={
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                  endIcon={
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  }
                >
                  Action
                </Badge>
              </div>
            </div>
          </div>

          {/* Dot Badge */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Dot Badge</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {colors.map((color) => (
                  <div key={color} className="flex items-center gap-2">
                    <Badge dot color={color} size="sm" />
                    <span className="text-sm text-neutral-300">{color}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <Badge dot color="primary" size={size} />
                    <span className="text-sm text-neutral-300">{size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Usage Examples</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-300">Notifications</span>
                <Badge color="danger" variant="solid" count={5} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-300">Status</span>
                <Badge color="success" variant="soft">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-300">Version</span>
                <Badge color="primary" variant="outline">
                  v1.0.0
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-300">New</span>
                <Badge color="warning" variant="solid" size="xs">
                  NEW
                </Badge>
              </div>
            </div>
          </div>

          {/* Badge Overlay with IconButton */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Badge Overlay with IconButton</h3>
            <div className="space-y-6">
              {/* Default */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-neutral-300">Default (top-right)</div>
                <div className="flex items-center gap-4">
                  <BadgeOverlay
                    badge={{ color: 'danger', count: 5 }}
                  >
                    <IconButton
                      size="sm"
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
                  </BadgeOverlay>
                </div>
              </div>

              {/* Anchor Origin Positions */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-neutral-300">Anchor Origin Positions</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <BadgeOverlay
                      badge={{ color: 'primary', count: 3 }}
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                      <IconButton
                        size="sm"
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
                    </BadgeOverlay>
                    <span className="text-xs text-neutral-400">top-left</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BadgeOverlay
                      badge={{ color: 'danger', count: 5 }}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <IconButton
                        size="sm"
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
                    </BadgeOverlay>
                    <span className="text-xs text-neutral-400">top-right</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BadgeOverlay
                      badge={{ color: 'warning', count: 12 }}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                      <IconButton
                        size="sm"
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
                    </BadgeOverlay>
                    <span className="text-xs text-neutral-400">bottom-left</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BadgeOverlay
                      badge={{ color: 'success', count: 8 }}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <IconButton
                        size="sm"
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
                    </BadgeOverlay>
                    <span className="text-xs text-neutral-400">bottom-right</span>
                  </div>
                </div>
              </div>

              {/* Other Examples */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-neutral-300">Other Examples</div>
                <div className="flex flex-wrap items-center gap-4">
                  <BadgeOverlay
                    badge={{ color: 'danger', count: 99, maxCount: 99 }}
                  >
                    <IconButton
                      size="sm"
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
                  </BadgeOverlay>
                  <BadgeOverlay
                    badge={{ color: 'danger', count: 150, maxCount: 99 }}
                  >
                    <IconButton
                      size="sm"
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
                  </BadgeOverlay>
                  <BadgeOverlay
                    badge={{ color: 'primary', dot: true }}
                  >
                    <IconButton
                      size="sm"
                      buttonStyle="ghost"
                      aria-label="Chat"
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      }
                    />
                  </BadgeOverlay>
                  <BadgeOverlay
                    badge={{ color: 'primary', count: 1, variant: 'soft' }}
                  >
                    <IconButton
                      size="sm"
                      buttonStyle="ghost"
                      aria-label="Like"
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      }
                    />
                  </BadgeOverlay>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

