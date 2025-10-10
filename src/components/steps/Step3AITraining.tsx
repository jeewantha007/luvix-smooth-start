import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step3AITraining = ({ formData, updateFormData }: StepProps) => {
  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.topQuestions];
    newQuestions[index] = value;
    updateFormData({ topQuestions: newQuestions });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <Brain className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">AI Training</h2>
        <p className="text-muted-foreground text-lg">
          Teach our AI about your business
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Top 5 Customer Questions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            What are the most common questions your customers ask?
          </p>
          <div className="space-y-4">
            {formData.topQuestions.map((question, index) => (
              <FormField key={index} label={`Question ${index + 1}`} required={index === 0}>
                <Input
                  placeholder={`e.g., What are your business hours?`}
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  className="h-12 text-base"
                />
              </FormField>
            ))}
          </div>
        </div>

        <FormField 
          label="What Does Your Business Do?" 
          required
          description="Provide a clear description of your products or services"
        >
          <Textarea
            placeholder="We provide... Our main services include..."
            value={formData.businessDescription}
            onChange={(e) => updateFormData({ businessDescription: e.target.value })}
            className="min-h-[120px] text-base resize-none"
          />
        </FormField>

        <FormField label="Communication Style" required description="How should the AI communicate with your customers?">
          <RadioGroup
            value={formData.communicationStyle}
            onValueChange={(value) => updateFormData({ communicationStyle: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional" className="cursor-pointer flex-1">
                <div className="font-medium text-base">Professional & Formal</div>
                <div className="text-sm text-muted-foreground">Best for B2B, legal, finance</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="friendly" id="friendly" />
              <Label htmlFor="friendly" className="cursor-pointer flex-1">
                <div className="font-medium text-base">Friendly & Approachable</div>
                <div className="text-sm text-muted-foreground">Balanced tone for most businesses</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="casual" id="casual" />
              <Label htmlFor="casual" className="cursor-pointer flex-1">
                <div className="font-medium text-base">Casual & Conversational</div>
                <div className="text-sm text-muted-foreground">Best for retail, lifestyle brands</div>
              </Label>
            </div>
          </RadioGroup>
        </FormField>

        <FormField label="Can AI Share Pricing?" required>
          <RadioGroup
            value={formData.sharePricing}
            onValueChange={(value) => updateFormData({ sharePricing: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="yes-full" id="yes-full" />
              <Label htmlFor="yes-full" className="cursor-pointer flex-1 text-base">
                Yes, provide exact prices
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="yes-starting" id="yes-starting" />
              <Label htmlFor="yes-starting" className="cursor-pointer flex-1 text-base">
                Yes, starting from (provide ranges)
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="no" id="no-pricing" />
              <Label htmlFor="no-pricing" className="cursor-pointer flex-1 text-base">
                No, connect them to sales team
              </Label>
            </div>
          </RadioGroup>
        </FormField>

        {(formData.sharePricing === "yes-full" || formData.sharePricing === "yes-starting") && (
          <FormField label="Pricing Information" description="Provide pricing details for the AI to share">
            <Textarea
              placeholder="Basic plan: $49/month&#10;Professional plan: $99/month&#10;Enterprise: Contact us"
              value={formData.pricingDetails}
              onChange={(e) => updateFormData({ pricingDetails: e.target.value })}
              className="min-h-[100px] text-base resize-none"
            />
          </FormField>
        )}
      </div>
    </div>
  );
};
