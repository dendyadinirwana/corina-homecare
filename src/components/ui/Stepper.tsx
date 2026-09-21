import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StepItem {
  number: number;
  label: string;
}

export interface StepperProps {
  currentStep: number;
  steps?: string[] | StepItem[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  steps = [
    { number: 1, label: 'Tanggal' },
    { number: 2, label: 'Waktu' },
    { number: 3, label: 'Detail' },
  ],
  className,
}) => {
  const normalizedSteps: StepItem[] = steps.map((item, index) => {
    if (typeof item === 'string') {
      return { number: index + 1, label: item };
    }
    return item;
  });

  return (
    <div
      data-testid="stepper"
      className={cn('w-full py-3 px-2 select-none', className)}
    >
      <div className="flex items-center justify-between relative">
        {normalizedSteps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isUpcoming = step.number > currentStep;
          const state = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';

          const hasLine = index < normalizedSteps.length - 1;
          const nextStepIsCompletedOrActive =
            step.number < currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle & Label Column */}
              <div
                data-testid={`step-${step.number}`}
                data-state={state}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                {/* Circle */}
                <div
                  data-testid={`step-${step.number}-circle`}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-quick shrink-0',
                    isCompleted && 'bg-forest text-white shadow-sm',
                    isActive && 'bg-forest text-white ring-4 ring-[#E8F8EE] shadow-sm',
                    isUpcoming && 'bg-[#F0F0F2] text-ink-muted'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Label Below */}
                <span
                  data-testid={`step-${step.number}-label`}
                  className={cn(
                    'mt-2 text-xs text-center truncate max-w-[90px]',
                    isActive && 'font-semibold text-ink-primary',
                    isCompleted && 'font-medium text-ink-primary',
                    isUpcoming && 'font-normal text-ink-muted'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {hasLine && (
                <div
                  className={cn(
                    'h-[2px] -mt-5 flex-1 transition-colors duration-quick -mx-2 z-0',
                    nextStepIsCompletedOrActive ? 'bg-forest' : 'bg-[#E5E7EB]'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
