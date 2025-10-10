import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plug } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step6Integrations = ({ formData, updateFormData }: StepProps) => {
  const integrationOptions = [
    "Google Calendar",
    "Shopify",
    "Payment Gateway (Stripe/PayPal)",
    "Email Marketing",
  ];

  const toggleIntegration = (option: string) => {
    const current = formData.integrations || [];
    if (current.includes(option)) {
      updateFormData({ integrations: current.filter((item) => item !== option) });
    } else {
      updateFormData({ integrations: [...current, option] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <Plug className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Integrations</h2>
        <p className="text-muted-foreground text-lg">
          Connect LUVIX with your existing tools
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField label="Current CRM" required description="What CRM system are you currently using?">
          <Select
            value={formData.currentCRM}
            onValueChange={(value) => updateFormData({ currentCRM: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select your CRM" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="hubspot">HubSpot</SelectItem>
              <SelectItem value="salesforce">Salesforce</SelectItem>
              <SelectItem value="zoho">Zoho CRM</SelectItem>
              <SelectItem value="pipedrive">Pipedrive</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {formData.currentCRM === "other" && (
          <FormField label="Please specify your CRM">
            <Input
              placeholder="Enter your CRM name"
              value={formData.crmOther}
              onChange={(e) => updateFormData({ crmOther: e.target.value })}
              className="h-12 text-base"
            />
          </FormField>
        )}

        <FormField 
          label="Need Integration With" 
          description="Select all tools you want to integrate with LUVIX"
        >
          <div className="space-y-3">
            {integrationOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => toggleIntegration(option)}
              >
                <Checkbox
                  id={`integration-${option}`}
                  checked={formData.integrations?.includes(option)}
                  onCheckedChange={() => toggleIntegration(option)}
                />
                <Label
                  htmlFor={`integration-${option}`}
                  className="cursor-pointer flex-1 text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Checkbox
                  id="integration-other"
                  checked={!!formData.integrationsOther}
                  onCheckedChange={(checked) => {
                    if (!checked) updateFormData({ integrationsOther: "" });
                  }}
                />
                <Label htmlFor="integration-other" className="text-base font-medium">
                  Other
                </Label>
              </div>
              <Input
                placeholder="Specify other integrations needed"
                value={formData.integrationsOther}
                onChange={(e) => updateFormData({ integrationsOther: e.target.value })}
                className="h-11 text-base mt-2"
              />
            </div>
          </div>
        </FormField>

        {formData.integrations?.includes("Email Marketing") && (
          <FormField label="Email Marketing Platform" description="Which email marketing tool do you use?">
            <Input
              placeholder="e.g., Mailchimp, SendGrid, ConvertKit"
              className="h-12 text-base"
            />
          </FormField>
        )}
      </div>
    </div>
  );
};
