import React from 'react';
import { cn } from '../../lib/utils';

export interface StatusBarProps {
  time?: string;
  showDynamicIsland?: boolean;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time = '9:41',
  showDynamicIsland = true,
  className,
}) => {
  return (
    <header
      data-testid="status-bar"
      className={cn(
        'w-full pt-3 pb-1 px-6 flex items-center justify-between select-none relative z-30',
        className
      )}
    >
      {/* Time */}
      <div className="w-16 flex items-center">
        <span
          data-testid="status-bar-time"
          className="text-[14px] font-semibold tracking-tight text-ink-primary"
        >
          {time}
        </span>
      </div>

      {/* Dynamic Island */}
      {showDynamicIsland && (
        <div
          data-testid="dynamic-island"
          className="w-[124px] h-[35px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm mx-auto"
          aria-label="Dynamic Island"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#111111] border border-white/10" />
          <div className="w-2 h-2 rounded-full bg-[#0a101d]/80 ring-1 ring-blue-900/30" />
        </div>
      )}

      {/* Icons: Signal, WiFi, Battery */}
      <div className="w-16 flex items-center justify-end space-x-1.5 text-ink-primary">
        {/* Cellular Signal Icon */}
        <svg
          data-testid="status-bar-signal"
          className="w-4 h-3.5 fill-current"
          viewBox="0 0 17 12"
          aria-hidden="true"
        >
          <rect x="0.5" y="8.5" width="2.5" height="3.5" rx="0.5" />
          <rect x="4.5" y="6" width="2.5" height="6" rx="0.5" />
          <rect x="8.5" y="3.5" width="2.5" height="8.5" rx="0.5" />
          <rect x="12.5" y="0.5" width="2.5" height="11.5" rx="0.5" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg
          data-testid="status-bar-wifi"
          className="w-4 h-3.5 fill-current"
          viewBox="0 0 16 12"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 3.2C10.6 3.2 12.9 4.2 14.7 5.8L16 4.4C13.8 2.5 11 1.4 8 1.4C5 1.4 2.2 2.5 0 4.4L1.3 5.8C3.1 4.2 5.4 3.2 8 3.2ZM8 6.6C9.6 6.6 11.1 7.2 12.3 8.3L13.6 6.9C12.1 5.5 10.1 4.7 8 4.7C5.9 4.7 3.9 5.5 2.4 6.9L3.7 8.3C4.9 7.2 6.4 6.6 8 6.6ZM8 9.8C8.9 9.8 9.6 10.4 9.6 11.2C9.6 12 8.9 12.6 8 12.6C7.1 12.6 6.4 12 6.4 11.2C6.4 10.4 7.1 9.8 8 9.8Z"
          />
        </svg>

        {/* Battery Icon */}
        <svg
          data-testid="status-bar-battery"
          className="w-5 h-3.5"
          viewBox="0 0 24 12"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="19"
            height="10"
            rx="3"
            strokeWidth="1.5"
            className="stroke-current"
          />
          <rect x="3" y="3" width="13" height="6" rx="1.5" className="fill-current" />
          <path
            d="M21 4.5V7.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="stroke-current"
          />
        </svg>
      </div>
    </header>
  );
};
export default StatusBar;
