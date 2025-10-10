import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { FormData } from "../OnboardingForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors?: { [key: string]: string };
}

export const Step2BusinessOps = ({ formData, updateFormData, errors = {} }: StepProps) => {
  const updateTeamMember = (index: number, field: "name" | "email", value: string) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    updateFormData({ teamMembers: newTeamMembers });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
          <Clock className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Business Operations</h2>
        <p className="text-muted-foreground text-lg">
          Help us understand your business hours and team
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Business Hours & Timezone</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="Opening Time" required error={errors.businessHoursStart}>
              <Input
                type="time"
                value={formData.businessHoursStart}
                onChange={(e) => updateFormData({ businessHoursStart: e.target.value })}
                className="h-12 text-base"
              />
            </FormField>

            <FormField label="Closing Time" required error={errors.businessHoursEnd}>
              <Input
                type="time"
                value={formData.businessHoursEnd}
                onChange={(e) => updateFormData({ businessHoursEnd: e.target.value })}
                className="h-12 text-base"
              />
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label="Timezone" required error={errors.timezone}>
              <Select
                value={formData.timezone}
                onValueChange={(value) => updateFormData({ timezone: value })}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </div>

        <FormField label="Daily WhatsApp Message Volume" required error={errors.messageVolume} description="Approximate number of messages you receive per day">
          <RadioGroup
            value={formData.messageVolume}
            onValueChange={(value) => updateFormData({ messageVolume: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="<50" id="vol-50" />
              <Label htmlFor="vol-50" className="cursor-pointer flex-1 text-base">Less than 50</Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="50-100" id="vol-100" />
              <Label htmlFor="vol-100" className="cursor-pointer flex-1 text-base">50–100</Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="100-200" id="vol-200" />
              <Label htmlFor="vol-200" className="cursor-pointer flex-1 text-base">100–200</Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="200-500" id="vol-500" />
              <Label htmlFor="vol-500" className="cursor-pointer flex-1 text-base">200–500</Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="500+" id="vol-more" />
              <Label htmlFor="vol-more" className="cursor-pointer flex-1 text-base">500+</Label>
            </div>
          </RadioGroup>
        </FormField>

        <div>
          <h3 className="text-xl font-semibold mb-4">Team Members Needing LUVIX Access</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add up to 4 team members who will need access to LUVIX
          </p>
          <div className="space-y-4">
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border border-border rounded-lg">
                <FormField label={`Team Member ${index + 1} Name`}>
                  <Input
                    placeholder="Full name"
                    value={member.name}
                    onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                    className="h-12 text-base"
                  />
                </FormField>
                <FormField label="Email">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={member.email}
                    onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                    className="h-12 text-base"
                  />
                </FormField>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};