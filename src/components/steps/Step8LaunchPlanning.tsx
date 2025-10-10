import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileCheck } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors?: { [key: string]: string };
}

// Updated: Only two plans - Starter ($29) and Professional ($79)
export const Step8LaunchPlanning = ({ formData, updateFormData, errors = {} }: StepProps) => {
  console.log("🧩 Step8 formData:", formData);

  const plans = [
    {
      name: "Starter",
      price: "$29 / month",
      description: "Perfect for small businesses getting started",
    },
    {
      name: "Professional",
      price: "$79 / month",
      description: "Ideal for growing businesses with higher volume",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <FileCheck className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Launch Planning</h2>
        <p className="text-muted-foreground text-lg">
          Plan your go-live and training schedule
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        {/* Go-Live Date */}
        <FormField
          label="Target Go-Live Date"
          required
          error={errors.goLiveDate}
          description="When would you like to launch LUVIX?"
        >
          <Input
            type="date"
            value={formData.goLiveDate}
            onChange={(e) => updateFormData({ goLiveDate: e.target.value })}
            className="h-12 text-base"
            min={new Date().toISOString().split("T")[0]}
          />
        </FormField>

        {/* Training Date */}
        <FormField
          label="Preferred Training Date"
          description="When would you like your team training session?"
        >
          <Input
            type="date"
            value={formData.trainingDate}
            onChange={(e) => updateFormData({ trainingDate: e.target.value })}
            className="h-12 text-base"
            min={new Date().toISOString().split("T")[0]}
          />
        </FormField>

        {/* Training Attendees */}
        <FormField
          label="Number of Training Attendees"
          description="How many team members will attend the training?"
        >
          <Input
            type="number"
            min="1"
            value={formData.trainingAttendees}
            onChange={(e) => updateFormData({ trainingAttendees: e.target.value })}
            className="h-12 text-base"
            placeholder="e.g., 5"
          />
        </FormField>

        {/* Plan Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Your Plan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the plan that best fits your business needs
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.selectedPlan === plan.name
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-secondary/50"
                }`}
                onClick={() => updateFormData({ selectedPlan: plan.name })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">{plan.price}</p>
                  </div>
                  {formData.selectedPlan === plan.name && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>
            ))}
          </div>
          {errors.selectedPlan && (
            <p className="text-sm text-destructive mt-2">{errors.selectedPlan}</p>
          )}
        </div>
      </div>
    </div>
  );
};
