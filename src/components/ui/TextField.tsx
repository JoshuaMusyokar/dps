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
    <div className={`${className} animate-fade-in-up`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
          {label}
        </label>
      )}
      <div className="relative group">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 dark:group-focus-within:text-dark-primary-400 transition-colors duration-300">
            {startIcon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 
            ${startIcon ? "pl-11" : ""} 
            ${endIcon ? "pr-11" : ""}
            bg-white/80 dark:bg-gray-800/80 
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            rounded-xl shadow-soft dark:shadow-glass-dark
            backdrop-blur-sm
            focus:outline-none focus:ring-2 
            focus:ring-primary-500 focus:border-primary-500
            dark:focus:ring-dark-primary-400 dark:focus:border-dark-primary-400
            hover:border-gray-400 dark:hover:border-gray-500
            disabled:bg-gray-100 dark:disabled:bg-gray-700
            disabled:text-gray-500 dark:disabled:text-gray-400
            disabled:cursor-not-allowed
            transition-all duration-300 ease-smooth
            ${
              error
                ? "border-error-500 dark:border-error-400 focus:ring-error-500 dark:focus:ring-error-400 bg-error-50/50 dark:bg-error-900/20"
                : ""
            }
          `}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 dark:group-focus-within:text-dark-primary-400 transition-colors duration-300">
            {endIcon}
          </div>
        )}

        {/* Focus ring enhancement */}
        <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-focus-within:ring-primary-200 dark:group-focus-within:ring-dark-primary-800 transition-all duration-300 pointer-events-none"></div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-center gap-1 animate-fade-in">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          {helpText}
        </p>
      )}
    </div>
  );
}
