interface Step {
  id: number;
  label: string;
}

interface ProgressStepperProps {
  steps: Step[];
  activeStep: number;
  compact?: boolean;
}

export function ProgressStepper({
  steps,
  activeStep,
  compact = false,
}: ProgressStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center z-10">
            {/* Step Circle */}
            <div
              className={`
                  flex items-center justify-center
                  rounded-full font-medium transition-all duration-300
                  ${compact ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"}
                  ${
                    activeStep >= step.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-600"
                  }
                  ${activeStep === step.id ? "ring-4 ring-blue-100" : ""}
                `}
              aria-current={activeStep === step.id ? "step" : undefined}
            >
              {step.id}
            </div>

            {/* Step Label (for non-compact mode) */}
            {!compact && (
              <span
                className={`
                    mt-2 text-xs md:text-sm transition-colors duration-300
                    ${
                      activeStep >= step.id
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }
                  `}
              >
                {step.label}
              </span>
            )}
          </div>
        ))}

        {/* Connector Lines - Now positioned in background */}
        <div className="absolute top-3 left-0 right-0 flex items-center z-0">
          {steps.map(
            (step, index) =>
              index < steps.length - 1 && (
                <div
                  key={`connector-${step.id}`}
                  className={`
                    h-1 flex-1 mx-1 transition-all duration-300
                    ${activeStep > step.id ? "bg-blue-600" : "bg-gray-200"}
                  `}
                ></div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
