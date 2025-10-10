import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileCheck } from "lucide-react";
// Removed Button import since we're not using explicit submit button

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors?: { [key: string]: string };
  // Removed onSubmit prop since we're using the existing navigation button
}

export const Step9FinalDetails = ({ formData, updateFormData, errors = {} }: StepProps) => {
  const referralOptions = [
    "Google Search",
    "LinkedIn",
    "Facebook",
    "Instagram",
    "Twitter/X",
  ];

  const toggleReferral = (option: string) => {
    const current = formData.referralSource || [];
    if (current.includes(option)) {
      updateFormData({ referralSource: current.filter((item) => item !== option) });
    } else {
      updateFormData({ referralSource: [...current, option] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <FileCheck className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Final Details & Agreement</h2>
        <p className="text-muted-foreground text-lg">
          Just a few more details to complete your onboarding
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField 
          label="What Does Success Look Like?" 
          required
          error={errors.successLooks}
          description="Describe your goals and expectations for LUVIX"
        >
          <Textarea
            placeholder="e.g., Reduce response time by 50%, handle 80% of inquiries automatically..."
            value={formData.successLooks}
            onChange={(e) => updateFormData({ successLooks: e.target.value })}
            className="min-h-[100px] text-base resize-none"
          />
        </FormField>

        <FormField 
          label="Current Challenges" 
          description="What problems are you trying to solve? (optional)"
        >
          <Textarea
            placeholder="e.g., Long response times, missed leads, repetitive questions..."
            value={formData.challenges}
            onChange={(e) => updateFormData({ challenges: e.target.value })}
            className="min-h-[100px] text-base resize-none"
          />
        </FormField>

        <FormField label="Special Requirements" description="Any specific needs or customizations? (optional)">
          <Textarea
            placeholder="Tell us about any unique requirements..."
            value={formData.specialRequirements}
            onChange={(e) => updateFormData({ specialRequirements: e.target.value })}
            className="min-h-[100px] text-base resize-none"
          />
        </FormField>

        <FormField label="How Did You Hear About LUVIX?">
          <div className="space-y-3">
            {referralOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => toggleReferral(option)}
              >
                <Checkbox
                  id={`referral-${option}`}
                  checked={formData.referralSource?.includes(option)}
                  onCheckedChange={() => toggleReferral(option)}
                />
                <Label
                  htmlFor={`referral-${option}`}
                  className="cursor-pointer flex-1 text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
            <div className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="referral-person"
                  checked={!!formData.referralName}
                  onCheckedChange={(checked) => {
                    if (!checked) updateFormData({ referralName: "" });
                  }}
                />
                <Label htmlFor="referral-person" className="text-base font-medium">
                  Referral from someone
                </Label>
              </div>
              {formData.referralName !== undefined && (
                <Input
                  placeholder="Enter referrer's name"
                  value={formData.referralName}
                  onChange={(e) => updateFormData({ referralName: e.target.value })}
                  className="h-11 text-base"
                />
              )}
            </div>
            <div className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="referral-other"
                  checked={!!formData.referralOther}
                  onCheckedChange={(checked) => {
                    if (!checked) updateFormData({ referralOther: "" });
                  }}
                />
                <Label htmlFor="referral-other" className="text-base font-medium">
                  Other
                </Label>
              </div>
              {formData.referralOther !== undefined && (
                <Input
                  placeholder="Please specify"
                  value={formData.referralOther}
                  onChange={(e) => updateFormData({ referralOther: e.target.value })}
                  className="h-11 text-base"
                />
              )}
            </div>
          </div>
        </FormField>

        <div className="pt-6 border-t-2 border-border">
          <h3 className="text-xl font-semibold mb-4">Agreement</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Please review and confirm the following statements:
          </p>
          <div className="space-y-4">
            <div
              className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => updateFormData({ agreementAuthority: !formData.agreementAuthority })}
            >
              <Checkbox
                id="agreement-authority"
                checked={formData.agreementAuthority}
                onCheckedChange={(checked) => updateFormData({ agreementAuthority: checked as boolean })}
                className="mt-1"
              />
              <Label htmlFor="agreement-authority" className="cursor-pointer text-base">
                I have the authority to enter into this agreement on behalf of my organization *
              </Label>
            </div>

            <div
              className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => updateFormData({ agreementTerms: !formData.agreementTerms })}
            >
              <Checkbox
                id="agreement-terms"
                checked={formData.agreementTerms}
                onCheckedChange={(checked) => updateFormData({ agreementTerms: checked as boolean })}
                className="mt-1"
              />
              <Label htmlFor="agreement-terms" className="cursor-pointer text-base">
                I agree to LUVIX's Terms of Service and Privacy Policy *
              </Label>
            </div>

            <div
              className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => updateFormData({ agreementWhatsApp: !formData.agreementWhatsApp })}
            >
              <Checkbox
                id="agreement-whatsapp"
                checked={formData.agreementWhatsApp}
                onCheckedChange={(checked) => updateFormData({ agreementWhatsApp: checked as boolean })}
                className="mt-1"
              />
              <Label htmlFor="agreement-whatsapp" className="cursor-pointer text-base">
                I understand and agree to comply with WhatsApp Business API Policies *
              </Label>
            </div>

            <div
              className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => updateFormData({ agreementAccuracy: !formData.agreementAccuracy })}
            >
              <Checkbox
                id="agreement-accuracy"
                checked={formData.agreementAccuracy}
                onCheckedChange={(checked) => updateFormData({ agreementAccuracy: checked as boolean })}
                className="mt-1"
              />
              <Label htmlFor="agreement-accuracy" className="cursor-pointer text-base">
                I confirm that all information provided in this form is accurate *
              </Label>
            </div>
            
            {errors.agreements && (
              <p className="text-sm text-destructive">{errors.agreements}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-4">
          <FormField label="Full Name (Signature)" required error={errors.fullName}>
            <Input
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              className="h-12 text-base"
            />
          </FormField>

          <FormField label="Date" required error={errors.signatureDate}>
            <Input
              type="date"
              value={formData.signatureDate}
              onChange={(e) => updateFormData({ signatureDate: e.target.value })}
              className="h-12 text-base"
              max={new Date().toISOString().split("T")[0]}
            />
          </FormField>
        </div>

        {/* Removed the explicit submit button since we're using the existing navigation button */}
      </div>
    </div>
  );
};