import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step1WhatsApp = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <MessageSquare className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">WhatsApp Setup</h2>
        <p className="text-muted-foreground text-lg">
          Let's configure your WhatsApp integration
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField label="WhatsApp Number" required>
          <Input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.whatsappNumber}
            onChange={(e) => updateFormData({ whatsappNumber: e.target.value })}
            className="h-12 text-base"
          />
        </FormField>

        <FormField label="Current WhatsApp Status" required>
          <RadioGroup
            value={formData.whatsappStatus}
            onValueChange={(value) => updateFormData({ whatsappStatus: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="cursor-pointer flex-1 text-base">
                New number (not on WhatsApp yet)
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="regular" id="regular" />
              <Label htmlFor="regular" className="cursor-pointer flex-1 text-base">
                Already using regular WhatsApp
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="business" id="business" />
              <Label htmlFor="business" className="cursor-pointer flex-1 text-base">
                WhatsApp Business App
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="help" id="help" />
              <Label htmlFor="help" className="cursor-pointer flex-1 text-base">
                Need help deciding
              </Label>
            </div>
          </RadioGroup>
        </FormField>

        <FormField 
          label="Meta Business Manager Account" 
          required
          description="This is required for WhatsApp Business API integration"
        >
          <RadioGroup
            value={formData.metaBusinessManager}
            onValueChange={(value) => updateFormData({ metaBusinessManager: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="have" id="have" />
              <Label htmlFor="have" className="cursor-pointer flex-1 text-base">
                I have a Meta Business Manager account
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="need-help" id="need-help" />
              <Label htmlFor="need-help" className="cursor-pointer flex-1 text-base">
                Need help creating one
              </Label>
            </div>
          </RadioGroup>
        </FormField>

        {formData.metaBusinessManager === "have" && (
          <FormField label="Business Manager ID" description="Enter your Meta Business Manager ID">
            <Input
              placeholder="123456789012345"
              value={formData.metaBusinessManagerId}
              onChange={(e) => updateFormData({ metaBusinessManagerId: e.target.value })}
              className="h-12 text-base"
            />
          </FormField>
        )}
      </div>
    </div>
  );
};
