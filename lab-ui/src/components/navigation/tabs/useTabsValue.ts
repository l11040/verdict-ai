import { useState, useCallback } from 'react';

interface UseTabsValueProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function useTabsValue({ value, defaultValue, onChange }: UseTabsValueProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  return {
    activeValue,
    handleChange,
  };
}


