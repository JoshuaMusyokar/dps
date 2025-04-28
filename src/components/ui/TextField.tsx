// ui/TextField.tsx
import { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function TextField({
  label,
  error,
  helpText,
  className = "",
  startIcon,
  endIcon,
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          className={`
            w-full px-3 py-2 
            ${startIcon ? "pl-10" : ""} 
            ${endIcon ? "pr-10" : ""}
            border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-300" : "border-gray-300"}
          `}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
