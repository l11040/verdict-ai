import React from 'react';
import { cn } from '../../../utils/cn';
import { Badge } from './Badge';
import type { BadgeOverlayProps } from './badge.type';

export const BadgeOverlay = React.forwardRef<HTMLDivElement, BadgeOverlayProps>(
  ({ children, badge, anchorOrigin, offset, className, ...props }, ref) => {
    const { count, maxCount, dot, ...badgeProps } = badge;
    const origin = anchorOrigin || { vertical: 'top', horizontal: 'right' };

    // anchorOrigin에 따른 기본 위치 계산
    // Badge가 아이콘의 모서리를 약간 침범하도록 배치
    const getPositionStyles = () => {
      const styles: React.CSSProperties = {};
      const transforms: string[] = [];

      // 기본 오프셋: Badge의 중심이 아이콘의 모서리에 위치하도록
      const defaultOffset = '0px';

      if (origin.vertical === 'top') {
        // top일 때: Badge의 중심이 아이콘의 상단 모서리에 위치
        styles.top = offset?.top !== undefined ? offset.top : defaultOffset;
        transforms.push('translateY(-50%)');
      } else {
        // bottom일 때: Badge의 중심이 아이콘의 하단 모서리에 위치
        styles.bottom = offset?.bottom !== undefined ? offset.bottom : defaultOffset;
        transforms.push('translateY(50%)');
      }

      if (origin.horizontal === 'right') {
        // right일 때: Badge의 중심이 아이콘의 오른쪽 모서리에 위치
        styles.right = offset?.right !== undefined ? offset.right : defaultOffset;
        transforms.push('translateX(50%)');
      } else {
        // left일 때: Badge의 중심이 아이콘의 왼쪽 모서리에 위치
        styles.left = offset?.left !== undefined ? offset.left : defaultOffset;
        transforms.push('translateX(-50%)');
      }

      if (transforms.length > 0) {
        styles.transform = transforms.join(' ');
      }

      return styles;
    };

    return (
      <div ref={ref} className={cn('relative inline-flex', className)} {...props}>
        {children}
        {(count !== undefined || dot) && (
          <Badge
            {...badgeProps}
            overlay
            count={count}
            maxCount={maxCount}
            dot={dot}
            style={{
              ...getPositionStyles(),
              ...badgeProps.style,
            }}
          />
        )}
      </div>
    );
  }
);

BadgeOverlay.displayName = 'BadgeOverlay';

