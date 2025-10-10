import { ReactNode } from "react";
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
  return (
    <div className="space-y-2 animate-fade-in">
      <Label className="text-base font-medium flex items-center gap-2">
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
