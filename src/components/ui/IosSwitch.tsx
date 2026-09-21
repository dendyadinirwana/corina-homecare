import React, { useId } from 'react';
import { cn } from '../../lib/utils';

export interface IosSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const IosSwitch: React.FC<IosSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  className,
  id: customId,
  'aria-label': ariaLabelProp,
  'data-testid': testId = 'ios-switch',
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  const labelString = typeof label === 'string' ? label : undefined;
  const accessibleName = ariaLabelProp || labelString || 'Toggle switch';

  const switchButton = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={accessibleName}
      disabled={disabled}
      onClick={handleToggle}
      data-testid={testId}
      className={cn(
        'w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-200 ease-in-out cursor-pointer relative shrink-0 select-none inline-flex items-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30',
        isChecked ? 'bg-[#34C759]' : 'bg-[#E9E9EA]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'w-[27px] h-[27px] rounded-full bg-white shadow-sm block transition-transform duration-200 ease-in-out transform pointer-events-none',
          isChecked ? 'translate-x-[20px]' : 'translate-x-0'
        )}
      />
    </button>
  );

  if (!label) {
    return switchButton;
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center justify-between gap-3 min-h-[44px] cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span className="text-sm font-medium text-ink-primary leading-tight">
        {label}
      </span>
      {switchButton}
    </label>
  );
};

export default IosSwitch;
