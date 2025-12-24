import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import type { TabsVariant, TabsColor } from './tabs.type';

interface UseTabIndicatorProps {
  variant: TabsVariant;
  color: TabsColor;
  orientation: 'horizontal' | 'vertical';
  activeValue?: string;
  items: Array<{ id: string }>;
}

const SHADOW_COLORS: Record<TabsColor, string> = {
  primary: 'rgba(59, 130, 246, 0.15)',
  secondary: 'rgba(139, 92, 246, 0.15)',
  success: 'rgba(34, 197, 94, 0.15)',
  warning: 'rgba(234, 179, 8, 0.15)',
  danger: 'rgba(239, 68, 68, 0.15)',
  neutral: 'rgba(0, 0, 0, 0.08)',
};

const HIDDEN_STYLE: CSSProperties = {
  opacity: 0,
  visibility: 'hidden',
};

function calculatePillsIndicatorStyle(
  activeTabRect: DOMRect,
  tabsListRect: DOMRect,
  orientation: 'horizontal' | 'vertical',
  color: TabsColor
): CSSProperties {
  const shadowColor = SHADOW_COLORS[color];
  const baseStyle: CSSProperties = {
    position: 'absolute',
    width: `${activeTabRect.width}px`,
    height: `${activeTabRect.height}px`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1,
    visibility: 'visible',
    boxShadow: `0 1px 2px 0 ${shadowColor}`,
  };

  if (orientation === 'horizontal') {
    return {
      ...baseStyle,
      left: `${activeTabRect.left - tabsListRect.left}px`,
      top: '4px',
    };
  }

  return {
    ...baseStyle,
    top: `${activeTabRect.top - tabsListRect.top}px`,
    left: '4px',
  };
}

function calculateUnderlineIndicatorStyle(
  activeTabRect: DOMRect,
  tabsListRect: DOMRect,
  orientation: 'horizontal' | 'vertical'
): CSSProperties {
  const baseStyle: CSSProperties = {
    position: 'absolute',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1,
    visibility: 'visible',
  };

  if (orientation === 'horizontal') {
    return {
      ...baseStyle,
      left: `${activeTabRect.left - tabsListRect.left}px`,
      bottom: '0px',
      width: `${activeTabRect.width}px`,
      height: '3px',
    };
  }

  return {
    ...baseStyle,
    top: `${activeTabRect.top - tabsListRect.top}px`,
    right: '0px',
    width: '2px',
    height: `${activeTabRect.height}px`,
  };
}

export function useTabIndicator({
  variant,
  color,
  orientation,
  activeValue,
  items,
}: UseTabIndicatorProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>(HIDDEN_STYLE);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if ((variant !== 'pills' && variant !== 'underline') || !tabsListRef.current || !activeValue) {
      setIndicatorStyle(HIDDEN_STYLE);
      return;
    }

    const activeTab = tabRefs.current.get(activeValue);
    if (!activeTab) {
      setIndicatorStyle(HIDDEN_STYLE);
      return;
    }

    const tabsList = tabsListRef.current;
    const tabsListRect = tabsList.getBoundingClientRect();
    const activeTabRect = activeTab.getBoundingClientRect();

    if (variant === 'pills') {
      setIndicatorStyle(calculatePillsIndicatorStyle(activeTabRect, tabsListRect, orientation, color));
    } else if (variant === 'underline') {
      setIndicatorStyle(calculateUnderlineIndicatorStyle(activeTabRect, tabsListRect, orientation));
    }
  }, [activeValue, variant, orientation, items, color]);

  const setTabRef = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (node) {
      tabRefs.current.set(id, node);
    } else {
      tabRefs.current.delete(id);
    }
  }, []);

  return {
    indicatorStyle,
    tabsListRef,
    setTabRef,
  };
}

