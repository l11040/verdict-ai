import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabPanel } from './index';
import type { TabsVariant, TabsSize, TabsColor } from './tabs.type';
import { Badge } from '../../data-display/badge';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['pills', 'underline', 'enclosed', 'chip'],
      description: '탭 스타일',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '탭 크기',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: '탭 색상',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '탭 방향',
    },
    disabled: {
      control: 'boolean',
      description: '전체 탭 비활성화 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const variants: TabsVariant[] = ['pills', 'underline', 'enclosed', 'chip'];
const sizes: TabsSize[] = ['sm', 'md', 'lg'];
const colors: TabsColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];

const basicItems = [
  { id: 'tab1', label: '탭 1' },
  { id: 'tab2', label: '탭 2' },
  { id: 'tab3', label: '탭 3' },
];

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState('tab1');
    return (
      <div className="p-8 space-y-12">
        {/* Basic Tabs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Basic Tabs</h3>
          <div className="space-y-4">
            <Tabs
              items={basicItems}
              value={value}
              onChange={setValue}
              variant="pills"
              color="primary"
            />
            <div className="mt-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900">
              {value === 'tab1' && (
                <TabPanel>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">탭 1 내용입니다.</p>
                </TabPanel>
              )}
              {value === 'tab2' && (
                <TabPanel>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">탭 2 내용입니다.</p>
                </TabPanel>
              )}
              {value === 'tab3' && (
                <TabPanel>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">탭 3 내용입니다.</p>
                </TabPanel>
              )}
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Variants</h3>
          <div className="space-y-6">
            {variants.map((variant) => (
              <div key={variant} className="space-y-2">
                <div className="text-sm font-medium text-neutral-300">
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </div>
                <Tabs
                  items={basicItems}
                  defaultValue="tab1"
                  variant={variant}
                  color="primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Colors</h3>
          <div className="space-y-6">
            {colors.map((color) => (
              <div key={color} className="space-y-2">
                <div className="text-sm font-medium text-neutral-300">
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </div>
                <Tabs
                  items={basicItems}
                  defaultValue="tab1"
                  variant="pills"
                  color={color}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Sizes</h3>
          <div className="space-y-6">
            {sizes.map((size) => (
              <div key={size} className="space-y-2">
                <div className="text-sm font-medium text-neutral-300">
                  {size.toUpperCase()}
                </div>
                <Tabs
                  items={basicItems}
                  defaultValue="tab1"
                  variant="pills"
                  size={size}
                  color="primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* With Icons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">With Icons</h3>
          <div className="space-y-4">
            <Tabs
              items={[
                {
                  id: 'home',
                  label: '홈',
                  startIcon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  ),
                },
                {
                  id: 'search',
                  label: '검색',
                  startIcon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  ),
                },
                {
                  id: 'settings',
                  label: '설정',
                  startIcon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  ),
                },
              ]}
              defaultValue="home"
              variant="pills"
              color="primary"
            />
          </div>
        </div>

        {/* With Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">With Badges</h3>
          <div className="space-y-4">
            <Tabs
              items={[
                {
                  id: 'inbox',
                  label: '받은 편지함',
                  badge: <Badge color="danger" variant="solid" size="xs" count={5} />,
                },
                {
                  id: 'sent',
                  label: '보낸 편지함',
                  badge: <Badge color="success" variant="solid" size="xs" count={12} />,
                },
                {
                  id: 'drafts',
                  label: '임시 보관함',
                  badge: <Badge color="neutral" variant="soft" size="xs" count={3} />,
                },
              ]}
              defaultValue="inbox"
              variant="pills"
              color="primary"
            />
          </div>
        </div>

        {/* Disabled Tabs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Disabled Tabs</h3>
          <div className="space-y-4">
            <Tabs
              items={[
                { id: 'tab1', label: '활성 탭' },
                { id: 'tab2', label: '비활성 탭', disabled: true },
                { id: 'tab3', label: '일반 탭' },
              ]}
              defaultValue="tab1"
              variant="pills"
              color="primary"
            />
            <div className="mt-4">
              <Tabs
                items={basicItems}
                defaultValue="tab1"
                variant="pills"
                color="primary"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Vertical Orientation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Vertical Orientation</h3>
          <div className="space-y-4">
            <div className="flex gap-8">
              <Tabs
                items={basicItems}
                defaultValue="tab1"
                variant="pills"
                orientation="vertical"
                color="primary"
              />
              <div className="flex-1 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">세로 방향 탭 예시입니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-100">Usage Examples</h3>
          <div className="space-y-6">
            {/* Settings Panel */}
            <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 space-y-6">
              <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">설정</h4>
              <Tabs
                items={[
                  { id: 'general', label: '일반' },
                  { id: 'security', label: '보안' },
                  { id: 'notifications', label: '알림' },
                  { id: 'advanced', label: '고급' },
                ]}
                defaultValue="general"
                variant="underline"
                color="primary"
              />
              <div className="pt-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  각 탭을 클릭하여 해당 설정 섹션으로 이동할 수 있습니다.
                </p>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 space-y-6">
              <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">대시보드</h4>
              <Tabs
                items={[
                  {
                    id: 'overview',
                    label: '개요',
                    startIcon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    ),
                  },
                  {
                    id: 'analytics',
                    label: '분석',
                    startIcon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    badge: <Badge color="primary" variant="soft" size="xs">New</Badge>,
                  },
                  {
                    id: 'reports',
                    label: '보고서',
                    startIcon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    ),
                  },
                ]}
                defaultValue="overview"
                variant="enclosed"
                color="primary"
              />
              <div className="pt-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  다양한 탭 스타일과 아이콘, 배지를 조합한 예시입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

