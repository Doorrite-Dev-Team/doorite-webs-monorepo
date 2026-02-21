import { cn } from "@repo/ui/lib/utils";
import * as React from "react";
import { Label } from "./label";

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: "default" | "ghost" | "filled" | "underlined";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = "default",
      size = "md",
      leftIcon,
      rightIcon,
      label,
      helperText,
      error,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId();
    const helperTextId = React.useId();

    const baseStyles = cn(
      // Base styles
      "relative w-full transition-all duration-200 ease-out",
      "placeholder:text-muted-foreground/60",
      "selection:bg-primary/20 selection:text-primary-foreground",
      "focus:outline-none focus:ring-0",
      "disabled:cursor-not-allowed disabled:opacity-50",

      // File input styles
      "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",

      // Size variants
      {
        "h-8 px-3 text-sm rounded-md": size === "sm",
        "h-10 px-3 text-sm rounded-lg": size === "md",
        "h-12 px-4 text-base rounded-lg": size === "lg",
      },

      // Icon padding adjustments
      {
        "pl-9": leftIcon && size === "sm",
        "pl-10": leftIcon && size === "md",
        "pl-11": leftIcon && size === "lg",
        "pr-9": rightIcon && size === "sm",
        "pr-10": rightIcon && size === "md",
        "pr-11": rightIcon && size === "lg",
      },
    );

    const variantStyles = {
      default: cn(
        "border border-border/60 bg-background/50 backdrop-blur-sm",
        "hover:border-border hover:bg-background/80",
        "focus:border-ring/70 focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.12)]",
        "data-[invalid]:border-destructive/70 data-[invalid]:focus:shadow-[0_0_0_3px_hsl(var(--destructive)/0.12)]",
      ),
      ghost: cn(
        "border-0 bg-transparent hover:bg-muted/50",
        "focus:bg-muted/80 focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.12)]",
        "data-[invalid]:focus:shadow-[0_0_0_3px_hsl(var(--destructive)/0.12)]",
      ),
      filled: cn(
        "border-0 bg-muted/60 hover:bg-muted/80",
        "focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.12)]",
        "data-[invalid]:focus:shadow-[0_0_0_3px_hsl(var(--destructive)/0.12)]",
      ),
      underlined: cn(
        "border-0 border-b-2 border-border/60 bg-transparent rounded-none px-0 pb-2",
        "hover:border-border focus:border-ring/70",
        "focus:shadow-[0_1px_0_0_hsl(var(--ring))]",
        "data-[invalid]:border-destructive/70 data-[invalid]:focus:border-destructive data-[invalid]:focus:shadow-[0_1px_0_0_hsl(var(--destructive))]",
      ),
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              error && "text-destructive",
            )}
          >
            {label}
          </Label>
        )}

        <div className="relative group">
          {leftIcon && (
            <div
              className={cn(
                // Added z-10 here to ensure it sits on top of the input
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/60 group-focus-within:text-foreground/80 transition-colors pointer-events-none",
                {
                  "left-2.5 w-3 h-3": size === "sm",
                  "left-3 w-4 h-4": size === "md",
                  "left-3.5 w-5 h-5": size === "lg",
                },
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-label={label ? label : type}
            disabled={disabled}
            data-invalid={error ? true : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={helperText || error ? helperTextId : undefined}
            className={cn(
              baseStyles,
              variantStyles[variant],
              "peer",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-foreground/80 transition-colors z-100",
                {
                  "right-2.5 w-3 h-3": size === "sm",
                  "right-3 w-4 h-4": size === "md",
                  "right-3.5 w-5 h-5": size === "lg",
                },
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            id={helperTextId}
            className={cn(
              "text-xs",
              error ? "text-destructive" : "text-muted-foreground/80",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type InputProps };
