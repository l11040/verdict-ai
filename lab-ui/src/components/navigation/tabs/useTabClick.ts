import { useCallback } from 'react';

interface UseTabClickProps {
  disabled: boolean;
  onChange?: (value: string) => void;
}

export function useTabClick({ disabled, onChange }: UseTabClickProps) {
  return useCallback(
    (tabId: string, tabDisabled: boolean) => {
      if (disabled || tabDisabled) return;
      onChange?.(tabId);
    },
    [disabled, onChange]
  );
}

