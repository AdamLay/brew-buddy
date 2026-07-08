import type { FieldError } from "react-hook-form";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: FieldError;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required = false, error, children }: FormFieldProps) {
  return (
    <div className="form-control w-full">
      <label className="label" htmlFor={htmlFor}>
        <span className="label-text font-medium text-base-content">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </span>
      </label>
      {children}
      {error && <span className="text-error text-sm mt-1">{error.message}</span>}
    </div>
  );
}
