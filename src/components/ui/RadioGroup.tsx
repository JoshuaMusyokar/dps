interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inline?: boolean;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  inline = true,
}: RadioGroupProps) {
  return (
    <div className="animate-fade-in-up">
      <div className={`${inline ? "flex flex-wrap gap-4" : "space-y-3"}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              group relative flex items-start cursor-pointer
              ${!inline ? "w-full" : ""}
            `}
          >
            <div className="flex items-center h-5">
              <input
                type="radio"
                name={name}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {/* Custom Radio Button */}
              <div
                className={`
                w-4 h-4 rounded-full border-2 transition-all duration-200 ease-smooth
                flex items-center justify-center
                ${
                  value === option.value
                    ? "border-primary-500 dark:border-dark-primary-400 bg-primary-500 dark:bg-dark-primary-400 shadow-glow"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-primary-400 dark:group-hover:border-dark-primary-500"
                }
              `}
              >
                {value === option.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-scale-pulse" />
                )}
              </div>
            </div>

            <div className="ml-3 text-sm">
              <span
                className={`
                font-medium transition-colors duration-200
                ${
                  value === option.value
                    ? "text-primary-700 dark:text-dark-primary-300"
                    : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                }
              `}
              >
                {option.label}
              </span>
              {option.description && (
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </p>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-lg group-hover:bg-primary-50/50 dark:group-hover:bg-dark-primary-900/20 transition-colors duration-200 -m-2 p-2"></div>
          </label>
        ))}
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
    </div>
  );
}
