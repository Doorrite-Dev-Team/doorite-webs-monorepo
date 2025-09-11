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
      {/* Step circles + connectors */}
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300",
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isActive
                      ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                      : "border-gray-300 text-gray-500 bg-white"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-medium">{step.id}</span>
                )}
              </div>

              {/* Title below circle */}
              <span
                className={cn(
                  "mt-2 text-sm font-medium text-center",
                  isActive
                    ? "text-blue-600"
                    : isCompleted
                      ? "text-primary"
                      : "text-gray-500"
                )}
              >
                {step.title}
              </span>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-0 right-0 h-1 z-[-1]",
                    isCompleted ? "bg-primary" : "bg-gray-200"
                  )}
                  style={{
                    left: `${(index / (steps.length - 1)) * 100}%`,
                    right: `${
                      ((steps.length - 1 - index - 1) / (steps.length - 1)) *
                      100
                    }%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step info */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {steps[currentStep - 1]?.title}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
};
