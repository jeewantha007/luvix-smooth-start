import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Rocket } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step8LaunchPlanning = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <Rocket className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Launch Planning</h2>
        <p className="text-muted-foreground text-lg">
          Let's schedule your LUVIX deployment
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField label="Preferred Go-Live Date" required description="When would you like to launch LUVIX?">
          <Input
            type="date"
            value={formData.goLiveDate}
            onChange={(e) => updateFormData({ goLiveDate: e.target.value })}
            className="h-12 text-base"
            min={new Date().toISOString().split("T")[0]}
          />
        </FormField>

        <FormField 
          label="Training Session" 
          description="Schedule a training session for your team (optional)"
        >
          <div className="space-y-4">
            <Input
              type="datetime-local"
              value={formData.trainingDate}
              onChange={(e) => updateFormData({ trainingDate: e.target.value })}
              className="h-12 text-base"
            />
            <Input
              placeholder="Number of attendees"
              type="number"
              value={formData.trainingAttendees}
              onChange={(e) => updateFormData({ trainingAttendees: e.target.value })}
              className="h-12 text-base"
              min="1"
            />
          </div>
        </FormField>

        <FormField label="Select Your Plan" required description="Choose the LUVIX plan that fits your needs">
          <RadioGroup
            value={formData.selectedPlan}
            onValueChange={(value) => updateFormData({ selectedPlan: value })}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-6 border-2 border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="starter" id="starter" className="mt-1" />
              <Label htmlFor="starter" className="cursor-pointer flex-1">
                <div className="font-semibold text-lg mb-1">Starter</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Perfect for small businesses getting started
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Up to 1,000 messages/month</li>
                  <li>• 1 WhatsApp number</li>
                  <li>• Basic AI training</li>
                  <li>• Email support</li>
                </ul>
                <div className="mt-3 text-2xl font-bold text-primary">$49<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-6 border-2 border-primary rounded-lg hover:border-primary/80 transition-colors cursor-pointer bg-primary/5">
              <RadioGroupItem value="professional" id="professional" className="mt-1" />
              <Label htmlFor="professional" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold text-lg">Professional</div>
                  <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">Popular</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  For growing businesses with higher volume
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Up to 5,000 messages/month</li>
                  <li>• Up to 3 WhatsApp numbers</li>
                  <li>• Advanced AI training & customization</li>
                  <li>• CRM integrations</li>
                  <li>• Priority support</li>
                </ul>
                <div className="mt-3 text-2xl font-bold text-primary">$149<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-6 border-2 border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="enterprise" id="enterprise" className="mt-1" />
              <Label htmlFor="enterprise" className="cursor-pointer flex-1">
                <div className="font-semibold text-lg mb-1">Enterprise</div>
                <div className="text-sm text-muted-foreground mb-2">
                  For large organizations with custom needs
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Unlimited messages</li>
                  <li>• Unlimited WhatsApp numbers</li>
                  <li>• Custom AI training & workflows</li>
                  <li>• All integrations included</li>
                  <li>• Dedicated account manager</li>
                  <li>• Custom SLA & support</li>
                </ul>
                <div className="mt-3 text-2xl font-bold text-primary">Custom<span className="text-sm font-normal text-muted-foreground"> pricing</span></div>
              </Label>
            </div>
          </RadioGroup>
        </FormField>
      </div>
    </div>
  );
};
