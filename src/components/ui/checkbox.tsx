import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  subLabel?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, subLabel, id, checked, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <label
        htmlFor={inputId}
        className="group inline-flex items-start gap-2.5 cursor-pointer select-none text-left"
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          {/* Hộp viền Checkbox tùy chỉnh */}
          <div
            className={cn(
              "h-4.5 w-4.5 rounded-[5px] border border-zinc-700 bg-zinc-900/80 transition-all duration-200",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#b8955a] peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-black",
              "peer-checked:border-[#b8955a] peer-checked:bg-[#b8955a] peer-hover:border-zinc-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <Check className="h-3.5 w-3.5 text-black stroke-[3] opacity-0 transition-opacity peer-checked:opacity-100" />
          </div>
        </div>

        {(label || subLabel) && (
          <div className="flex flex-col text-xs leading-snug">
            {label && (
              <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                {label}
              </span>
            )}
            {subLabel && (
              <span className="text-[10px] text-zinc-500 mt-0.5">{subLabel}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";