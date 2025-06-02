import React, { useState, useRef, useEffect } from "react";
import {
  User,
  FileText,
  Camera,
  CheckCircle,
  Upload,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

// Enhanced Progress Stepper Component
interface Step {
  id: number;
  label: string;
  description?: string;
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
    <div className="relative w-full">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl blur-3xl opacity-60" />

      <div className="relative p-8">
        <div className="flex items-center justify-between relative">
          {/* Animated Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{
                width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            >
              <div className="h-full bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
            </div>
          </div>

          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;
            const isUpcoming = activeStep < step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
              >
                {/* Step Circle with Enhanced Animations */}
                <div
                  className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-500 ease-out transform
                  ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-110"
                      : isActive
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/40 scale-125 animate-pulse"
                      : "bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                  }
                  ${isActive ? "ring-4 ring-blue-200 dark:ring-blue-800" : ""}
                  hover:scale-105 cursor-pointer
                `}
                >
                  {/* Animated Background */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-spin-slow opacity-20" />
                  )}

                  {/* Step Content */}
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 animate-bounce-in" />
                  ) : (
                    <span className="relative z-10">{step.id}</span>
                  )}

                  {/* Glow Effect for Active Step */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                  )}
                </div>

                {/* Step Label with Animation */}
                {!compact && (
                  <div className="mt-4 text-center max-w-24">
                    <div
                      className={`
                      font-medium text-sm transition-all duration-300
                      ${
                        isCompleted
                          ? "text-green-600 dark:text-green-400"
                          : isActive
                          ? "text-blue-600 dark:text-blue-400 animate-pulse"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    `}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 opacity-70">
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
