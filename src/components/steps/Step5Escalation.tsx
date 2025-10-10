import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors?: { [key: string]: string };
}

export const Step5Escalation = ({ formData, updateFormData, errors = {} }: StepProps) => {
  const escalationOptions = [
    "Customer requests to speak with a human",
    "Negative words detected (angry, frustrated, etc.)",
    "Complex question AI can't answer",
    "Pricing negotiations",
    "Complaints or refund requests",
  ];

  const toggleEscalation = (option: string) => {
    const current = formData.escalationRules || [];
    if (current.includes(option)) {
      updateFormData({ escalationRules: current.filter((item) => item !== option) });
    } else {
      updateFormData({ escalationRules: [...current, option] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <AlertCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Escalation Rules</h2>
        <p className="text-muted-foreground text-lg">
          Define when conversations should be escalated to your team
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField 
          label="AI Escalation Triggers" 
          required
          error={errors.escalationRules}
          description="Select all conditions that should trigger a human takeover"
        >
          <div className="space-y-3">
            {escalationOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => toggleEscalation(option)}
              >
                <Checkbox
                  id={`escalation-${option}`}
                  checked={formData.escalationRules?.includes(option)}
                  onCheckedChange={() => toggleEscalation(option)}
                />
                <Label
                  htmlFor={`escalation-${option}`}
                  className="cursor-pointer flex-1 text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Checkbox
                  id="escalation-messages"
                  checked={!!formData.escalationMessages}
                  onCheckedChange={(checked) => {
                    if (!checked) updateFormData({ escalationMessages: "" });
                  }}
                />
                <Label htmlFor="escalation-messages" className="text-base font-medium">
                  After a specific number of messages
                </Label>
              </div>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={formData.escalationMessages}
                onChange={(e) => updateFormData({ escalationMessages: e.target.value })}
                className="h-11 text-base mt-2"
                min="1"
              />
            </div>
          </div>
        </FormField>

        <FormField label="How should we notify you?" required error={errors.escalationType}>
          <RadioGroup
            value={formData.escalationType}
            onValueChange={(value) => updateFormData({ escalationType: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="whatsapp" id="notif-whatsapp" />
              <Label htmlFor="notif-whatsapp" className="cursor-pointer flex-1 text-base">
                WhatsApp notification
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="email" id="notif-email" />
              <Label htmlFor="notif-email" className="cursor-pointer flex-1 text-base">
                Email notification
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="both" id="notif-both" />
              <Label htmlFor="notif-both" className="cursor-pointer flex-1 text-base">
                Both WhatsApp and Email
              </Label>
            </div>
          </RadioGroup>
        </FormField>

        <FormField 
          label="Escalation Contact" 
          required
          error={errors.escalationContact}
          description={
            formData.escalationType === "whatsapp" 
              ? "WhatsApp number for notifications"
              : formData.escalationType === "email"
              ? "Email address for notifications"
              : "WhatsApp number and Email"
          }
        >
          {formData.escalationType === "both" ? (
            <div className="space-y-4">
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.escalationContact}
                onChange={(e) => updateFormData({ escalationContact: e.target.value })}
                className="h-12 text-base"
              />
              <Input
                type="email"
                placeholder="escalation@example.com"
                className="h-12 text-base"
              />
            </div>
          ) : (
            <Input
              type={formData.escalationType === "email" ? "email" : "tel"}
              placeholder={
                formData.escalationType === "email"
                  ? "escalation@example.com"
                  : "+1 (555) 123-4567"
              }
              value={formData.escalationContact}
              onChange={(e) => updateFormData({ escalationContact: e.target.value })}
              className="h-12 text-base"
            />
          )}
        </FormField>
      </div>
    </div>
  );
};