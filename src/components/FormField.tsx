import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
  description?: string;
}

export const FormField = ({
  label,
  required = false,
  children,
  error,
  description,
}: FormFieldProps) => {
  // Clone the children to add error styling if needed
  const childrenWithProps = error ? 
    React.cloneElement(children as React.ReactElement, {
      className: `${(children as React.ReactElement).props.className || ''} border-destructive focus-visible:ring-destructive`
    }) : 
    children;

  return (
    <div className="space-y-2 animate-fade-in">
      <Label className={`text-base font-medium flex items-center gap-2 ${error ? 'text-destructive' : ''}`}>
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {childrenWithProps}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};