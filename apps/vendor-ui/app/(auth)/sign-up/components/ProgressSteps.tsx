// src/components/ProgressSteps.tsx
import { cn } from "@repo/ui/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="mb-10">
      {/* Step indicators */}
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 bg-white z-10",
                    isCompleted
                      ? "bg-primary border-primary text-white shadow-md"
                      : isActive
                        ? "bg-primary border-primary text-white shadow-lg ring-4 ring-primary/20"
                        : "border-gray-300 text-gray-400",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <span className="font-semibold text-sm">{step.id}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : isCompleted
                          ? "text-gray-700"
                          : "text-gray-500",
                    )}
                  >
                    {step.title}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-0.5 transition-colors hidden sm:block",
                      isActive ? "text-gray-600" : "text-gray-400",
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
