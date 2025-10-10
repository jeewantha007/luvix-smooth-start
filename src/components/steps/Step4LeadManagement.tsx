import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step4LeadManagement = ({ formData, updateFormData }: StepProps) => {
  const leadInfoOptions = [
    "Name",
    "Email",
    "Phone",
    "Service Needed",
    "Timeline/Urgency",
    "Budget",
    "Location",
  ];

  const priorityOptions = [
    "Mentioned specific product/service",
    "Asked about pricing",
    "Mentioned competitor",
    "Expressed urgency",
    "High budget indicated",
  ];

  const toggleLeadInfo = (option: string) => {
    const current = formData.leadInfo || [];
    if (current.includes(option)) {
      updateFormData({ leadInfo: current.filter((item) => item !== option) });
    } else {
      updateFormData({ leadInfo: [...current, option] });
    }
  };

  const togglePriorityLead = (option: string) => {
    const current = formData.priorityLeads || [];
    if (current.includes(option)) {
      updateFormData({ priorityLeads: current.filter((item) => item !== option) });
    } else {
      updateFormData({ priorityLeads: [...current, option] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <Users className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Lead Management</h2>
        <p className="text-muted-foreground text-lg">
          Configure how you want to capture and prioritize leads
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField 
          label="Information to Collect from Leads" 
          required
          description="Select all information the AI should gather from potential customers"
        >
          <div className="space-y-3">
            {leadInfoOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => toggleLeadInfo(option)}
              >
                <Checkbox
                  id={`lead-${option}`}
                  checked={formData.leadInfo?.includes(option)}
                  onCheckedChange={() => toggleLeadInfo(option)}
                />
                <Label
                  htmlFor={`lead-${option}`}
                  className="cursor-pointer flex-1 text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Checkbox
                  id="lead-custom"
                  checked={!!formData.leadInfoCustom}
                  onCheckedChange={(checked) => {
                    if (!checked) updateFormData({ leadInfoCustom: "" });
                  }}
                />
                <Label htmlFor="lead-custom" className="text-base font-medium">
                  Custom Field
                </Label>
              </div>
              <Input
                placeholder="e.g., Company Size, Industry, etc."
                value={formData.leadInfoCustom}
                onChange={(e) => updateFormData({ leadInfoCustom: e.target.value })}
                className="h-11 text-base mt-2"
              />
            </div>
          </div>
        </FormField>

        <FormField 
          label="High Priority Lead Indicators" 
          description="What signals indicate a high-value lead?"
        >
          <div className="space-y-3">
            {priorityOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => togglePriorityLead(option)}
              >
                <Checkbox
                  id={`priority-${option}`}
                  checked={formData.priorityLeads?.includes(option)}
                  onCheckedChange={() => togglePriorityLead(option)}
                />
                <Label
                  htmlFor={`priority-${option}`}
                  className="cursor-pointer flex-1 text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </FormField>

        <FormField label="Appointment Booking" required description="Should the AI help customers book appointments?">
          <RadioGroup
            value={formData.appointmentBooking}
            onValueChange={(value) => updateFormData({ appointmentBooking: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="yes" id="booking-yes" />
              <Label htmlFor="booking-yes" className="cursor-pointer flex-1 text-base">
                Yes, integrate with my calendar
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="no" id="booking-no" />
              <Label htmlFor="booking-no" className="cursor-pointer flex-1 text-base">
                No, I'll handle appointments manually
              </Label>
            </div>
          </RadioGroup>
        </FormField>

        {formData.appointmentBooking === "yes" && (
          <FormField label="Calendar Email" description="Google Calendar or Outlook email">
            <Input
              type="email"
              placeholder="calendar@example.com"
              value={formData.calendarEmail}
              onChange={(e) => updateFormData({ calendarEmail: e.target.value })}
              className="h-12 text-base"
            />
          </FormField>
        )}
      </div>
    </div>
  );
};
