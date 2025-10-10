import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import logo from "./logo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors?: { [key: string]: string };
}

export const Step0Welcome = ({
  formData,
  updateFormData,
  errors = {},
}: StepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          LUVIX QUICK ONBOARDING FORM
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome to LUVIX! Complete this quick form to get started.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="px-3 py-1 bg-secondary rounded-full">
            ⏱️ Time: 8–10 minutes
          </span>
          <span className="px-3 py-1 bg-secondary rounded-full">
            Fields marked * are required
          </span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <FormField label="Business Name" required error={errors.businessName}>
          <Input
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => updateFormData({ businessName: e.target.value })}
            className="h-12 text-base"
          />
        </FormField>

        <FormField label="Industry" required error={errors.industry}>
          <Select
            value={formData.industry}
            onValueChange={(value) => updateFormData({ industry: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="hospitality">Hospitality</SelectItem>
              <SelectItem value="real-estate">Real Estate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {formData.industry === "other" && (
          <FormField
            label="Please specify your industry"
            error={errors.industryOther}
          >
            <Input
              placeholder="Enter your industry"
              value={formData.industryOther}
              onChange={(e) =>
                updateFormData({ industryOther: e.target.value })
              }
              className="h-12 text-base"
            />
          </FormField>
        )}

        <FormField
          label="Website"
          description="Optional - your business website"
        >
          <Input
            type="url"
            placeholder="https://yourwebsite.com"
            value={formData.website}
            onChange={(e) => updateFormData({ website: e.target.value })}
            className="h-12 text-base"
          />
        </FormField>

        <div className="pt-6 border-t border-border">
          <h3 className="text-xl font-semibold mb-6">Primary Contact</h3>

          <div className="space-y-6">
            <FormField label="Full Name" required error={errors.contactName}>
              <Input
                placeholder="John Doe"
                value={formData.contactName}
                onChange={(e) =>
                  updateFormData({ contactName: e.target.value })
                }
                className="h-12 text-base"
              />
            </FormField>

            <FormField label="Email" required error={errors.contactEmail}>
              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.contactEmail}
                onChange={(e) =>
                  updateFormData({ contactEmail: e.target.value })
                }
                className="h-12 text-base"
              />
            </FormField>

            <FormField
              label="Phone Number"
              required
              error={errors.contactPhone}
            >
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) =>
                  updateFormData({ contactPhone: e.target.value })
                }
                className="h-12 text-base"
              />
            </FormField>

            <FormField
              label="WhatsApp Number"
              description="Optional - if different from phone"
            >
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.contactWhatsApp}
                onChange={(e) =>
                  updateFormData({ contactWhatsApp: e.target.value })
                }
                className="h-12 text-base"
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
};
