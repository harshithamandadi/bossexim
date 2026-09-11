"use client";

import { ChevronDown } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const controlStyles = cn(
  "w-full rounded-2xl bg-surface px-4 py-3.5 text-[15px] text-fg ring-1 ring-inset ring-border",
  "placeholder:text-fg-mute/70 transition-shadow duration-300 ease-apple",
  "focus:outline-none focus:ring-2 focus:ring-brand aria-[invalid=true]:ring-danger",
);

interface FieldBaseProps {
  label: string;
  error?: string;
  /** Text shown beside the label for non-required fields, e.g. "Optional". */
  optionalLabel?: string;
  className?: string;
}

/** Wires up label, error message and ARIA attributes for any form control. */
function useField(id: string | undefined, error: string | undefined) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  return {
    fieldId,
    errorId,
    controlProps: {
      id: fieldId,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? errorId : undefined,
    },
  };
}

interface FieldShellProps extends FieldBaseProps {
  fieldId: string;
  errorId: string;
  children: ReactNode;
}

function FieldShell({ fieldId, errorId, label, error, optionalLabel, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={fieldId} className="flex items-baseline justify-between gap-4 text-sm font-medium">
        {label}
        {optionalLabel && <span className="text-xs font-normal text-fg-mute">{optionalLabel}</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ label, error, optionalLabel, className, id, ...props }: FieldBaseProps & ComponentProps<"input">) {
  const { fieldId, errorId, controlProps } = useField(id, error);
  return (
    <FieldShell {...{ fieldId, errorId, label, error, optionalLabel, className }}>
      <input className={controlStyles} {...controlProps} {...props} />
    </FieldShell>
  );
}

export function TextAreaField({ label, error, optionalLabel, className, id, ...props }: FieldBaseProps & ComponentProps<"textarea">) {
  const { fieldId, errorId, controlProps } = useField(id, error);
  return (
    <FieldShell {...{ fieldId, errorId, label, error, optionalLabel, className }}>
      <textarea className={cn(controlStyles, "min-h-36 resize-y")} {...controlProps} {...props} />
    </FieldShell>
  );
}

export function SelectField({ label, error, optionalLabel, className, id, children, ...props }: FieldBaseProps & ComponentProps<"select">) {
  const { fieldId, errorId, controlProps } = useField(id, error);
  return (
    <FieldShell {...{ fieldId, errorId, label, error, optionalLabel, className }}>
      <div className="relative">
        <select className={cn(controlStyles, "appearance-none pr-11")} {...controlProps} {...props}>
          {children}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-mute" />
      </div>
    </FieldShell>
  );
}
