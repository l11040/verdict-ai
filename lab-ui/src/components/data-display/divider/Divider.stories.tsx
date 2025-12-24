import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './index';
import type { DividerColor, DividerVariant, DividerSize, DividerOrientation } from './divider.type';
import { TextField } from '../../inputs/text-field';
import { Button } from '../../inputs/button';
import { IconButton } from '../../inputs/icon-button';
import { Badge, BadgeOverlay } from '../badge';

const meta: Meta<typeof Divider> = {
  title: 'Components/DataDisplay/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Divider 방향',
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Divider 스타일',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Divider 색상',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Divider 두께',
    },
    label: {
      control: 'text',
      description: 'Divider 라벨 텍스트',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: '라벨 위치',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

const colors: DividerColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];
const variants: DividerVariant[] = ['solid', 'dashed', 'dotted'];
const sizes: DividerSize[] = ['xs', 'sm', 'md', 'lg'];

export const Playground: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      {/* Basic Divider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Basic Divider</h3>
        <div className="space-y-4">
          <div className="text-sm text-neutral-300">기본 Divider</div>
          <Divider />
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Colors</h3>
        <div className="space-y-4">
          {colors.map((color) => (
            <div key={color} className="space-y-2">
              <div className="text-sm font-medium text-neutral-300">
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </div>
              <Divider color={color} />
            </div>
          ))}
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
              <Divider variant={variant} />
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Sizes</h3>
        <div className="space-y-4">
          {sizes.map((size) => (
            <div key={size} className="space-y-2">
              <div className="text-sm font-medium text-neutral-300">
                {size.toUpperCase()}
              </div>
              <Divider size={size} />
            </div>
          ))}
        </div>
      </div>

      {/* With Label */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">With Label</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">Center (기본)</div>
            <Divider label="OR" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">Left</div>
            <Divider label="Section Title" labelPosition="left" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">Right</div>
            <Divider label="Section Title" labelPosition="right" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">다양한 색상과 함께</div>
            <Divider label="Primary" color="primary" />
            <Divider label="Success" color="success" />
            <Divider label="Warning" color="warning" />
            <Divider label="Danger" color="danger" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-300">다양한 스타일과 함께</div>
            <Divider label="Solid" variant="solid" />
            <Divider label="Dashed" variant="dashed" />
            <Divider label="Dotted" variant="dotted" />
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Vertical Divider</h3>
        <div className="space-y-4">
          <div className="text-sm text-neutral-300">수직 Divider는 label을 지원하지 않습니다</div>
          <div className="flex items-center gap-4 h-20">
            <span className="text-sm text-neutral-300">Left</span>
            <Divider orientation="vertical" />
            <span className="text-sm text-neutral-300">Center</span>
            <Divider orientation="vertical" color="primary" />
            <span className="text-sm text-neutral-300">Right</span>
          </div>
          <div className="flex items-center gap-4 h-20">
            {colors.map((color) => (
              <React.Fragment key={color}>
                <span className="text-xs text-neutral-400">{color}</span>
                <Divider orientation="vertical" color={color} />
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-4 h-20">
            {variants.map((variant) => (
              <React.Fragment key={variant}>
                <span className="text-xs text-neutral-400">{variant}</span>
                <Divider orientation="vertical" variant={variant} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Usage Examples</h3>
        <div className="space-y-6">
          {/* Card with Divider */}
          <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Settings</h4>
              <Badge color="primary" variant="soft">New</Badge>
            </div>
            <Divider />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Notifications</span>
                <BadgeOverlay badge={{ color: 'danger', count: 3 }}>
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Theme</span>
                <Badge color="success" variant="soft">Dark</Badge>
              </div>
            </div>
            <Divider />
            <div className="flex justify-end gap-2">
              <Button buttonStyle="ghost" size="sm" color="neutral">
                Cancel
              </Button>
              <Button buttonStyle="solid" size="sm" color="primary">
                Save Changes
              </Button>
            </div>
          </div>

          {/* List with Dividers */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden">
            <div className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">JD</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">John Doe</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">john.doe@example.com</div>
                </div>
              </div>
              <Badge color="success" variant="soft" size="sm">
                Active
              </Badge>
            </div>
            <Divider />
            <div className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">JS</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Jane Smith</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">jane.smith@example.com</div>
                </div>
              </div>
              <Badge color="warning" variant="soft" size="sm">
                Pending
              </Badge>
            </div>
            <Divider />
            <div className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">AB</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Alice Brown</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">alice.brown@example.com</div>
                </div>
              </div>
              <Badge color="neutral" variant="soft" size="sm">
                Inactive
              </Badge>
            </div>
          </div>

          {/* Form Section with Divider */}
          <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 space-y-6">
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Personal Information</h4>
              <div className="space-y-4">
                <TextField
                  label="Full Name"
                  placeholder="Enter your full name"
                  size="md"
                />
                <TextField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  size="md"
                />
              </div>
            </div>
            <Divider label="OR" />
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Company Information</h4>
              <TextField
                label="Company Name"
                placeholder="Enter company name"
                size="md"
              />
              <TextField
                label="Company Email"
                type="email"
                placeholder="Enter company email"
                size="md"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button buttonStyle="ghost" size="md" color="neutral">
                Cancel
              </Button>
              <Button buttonStyle="solid" size="md" color="primary">
                Submit
              </Button>
            </div>
          </div>

          {/* Navigation with Vertical Divider */}
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-4">
              <Button buttonStyle="ghost" size="sm" color="primary">
                Home
              </Button>
              <Divider orientation="vertical" />
              <Button buttonStyle="ghost" size="sm" color="neutral">
                Products
              </Button>
              <Divider orientation="vertical" />
              <Button buttonStyle="ghost" size="sm" color="neutral">
                About
              </Button>
              <Divider orientation="vertical" />
              <Button buttonStyle="ghost" size="sm" color="neutral">
                Contact
              </Button>
              <div className="flex-1" />
              <BadgeOverlay badge={{ color: 'danger', count: 5 }}>
                <IconButton
                  size="sm"
                  buttonStyle="ghost"
                  aria-label="Cart"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  }
                />
              </BadgeOverlay>
            </div>
          </div>

          {/* Settings Panel with Dividers */}
          <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 space-y-4">
            <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Account Settings</h4>
            <Divider />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Profile Visibility</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Control who can see your profile
                  </div>
                </div>
                <Badge color="primary" variant="outline" size="sm">
                  Public
                </Badge>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Email Notifications</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Receive email updates
                  </div>
                </div>
                <Badge color="success" variant="soft" size="sm">
                  Enabled
                </Badge>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Two-Factor Authentication</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Add an extra layer of security
                  </div>
                </div>
                <Badge color="warning" variant="outline" size="sm">
                  Disabled
                </Badge>
              </div>
            </div>
            <Divider />
            <div className="flex justify-end">
              <Button buttonStyle="solid" size="sm" color="primary">
                Update Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

