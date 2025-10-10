import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors?: { [key: string]: string };
}

export const Step7Compliance = ({ formData, updateFormData, errors = {} }: StepProps) => {
  const complianceOptions = [
    "None",
    "HIPAA (Healthcare)",
    "GDPR (EU Data Protection)",
    "CCPA (California Privacy)",
    "PCI DSS (Payment Card)",
  ];

  const toggleCompliance = (option: string) => {
    const current = formData.compliance || [];
    if (current.includes(option)) {
      updateFormData({ compliance: current.filter((item) => item !== option) });
    } else {
      updateFormData({ compliance: [...current, option] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Compliance & Preferences</h2>
        <p className="text-muted-foreground text-lg">
          Ensure your setup meets industry requirements
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField 
          label="Industry Compliance Requirements" 
          required
          error={errors.compliance}
          description="Select all compliance standards that apply to your business"
        >
          <div className="space-y-3">
            {complianceOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => toggleCompliance(option)}
              >
                <Checkbox
                  id={`compliance-${option}`}
                  checked={formData.compliance?.includes(option)}
                  onCheckedChange={() => toggleCompliance(option)}
                />
                <Label
                  htmlFor={`compliance-${option}`}
                  className="cursor-pointer flex-1 text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Checkbox
                  id="compliance-other"
                  checked={!!formData.complianceOther}
                  onCheckedChange={(checked) => {
                    if (!checked) updateFormData({ complianceOther: "" });
                  }}
                />
                <Label htmlFor="compliance-other" className="text-base font-medium">
                  Other
                </Label>
              </div>
              <Input
                placeholder="Specify other compliance requirements"
                value={formData.complianceOther}
                onChange={(e) => updateFormData({ complianceOther: e.target.value })}
                className="h-11 text-base mt-2"
              />
            </div>
          </div>
        </FormField>

        <FormField label="Language Support" required error={errors.language} description="What languages should the AI support?">
          <Select
            value={formData.language}
            onValueChange={(value) => updateFormData({ language: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select language option" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="english">English only</SelectItem>
              <SelectItem value="spanish">Spanish & English</SelectItem>
              <SelectItem value="french">French & English</SelectItem>
              <SelectItem value="multi">Multi-language</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {formData.language === "multi" && (
          <FormField label="Specify Languages" required error={errors.languageOther} description="List all languages you need">
            <Input
              placeholder="e.g., English, Spanish, Arabic, Hindi"
              value={formData.languageOther}
              onChange={(e) => updateFormData({ languageOther: e.target.value })}
              className="h-12 text-base"
            />
          </FormField>
        )}

        <FormField label="Data Storage Preference" required error={errors.dataStorage} description="Where should your data be stored?">
          <Select
            value={formData.dataStorage}
            onValueChange={(value) => updateFormData({ dataStorage: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select storage option" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="us">Standard (AWS US)</SelectItem>
              <SelectItem value="eu">EU Servers (GDPR compliant)</SelectItem>
              <SelectItem value="uk">UK Servers</SelectItem>
              <SelectItem value="asia">Asia-Pacific Servers</SelectItem>
              <SelectItem value="custom">Custom location</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
};