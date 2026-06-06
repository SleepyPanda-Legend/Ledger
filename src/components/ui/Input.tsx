import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Labeled input primitive.
 * Error state turns the border red and shows the message below.
 * Hint text provides secondary context when no error is present.
 *
 * Always pair inputs with a label — never rely on placeholder text alone.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "h-10 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground",
            "placeholder:text-subtle",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
            "disabled:pointer-events-none disabled:opacity-50",
            error
              ? "border-danger focus:ring-danger"
              : "border-border hover:border-muted",
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
