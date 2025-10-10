import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Step0Welcome } from "./steps/Step0Welcome";
import { Step1WhatsApp } from "./steps/Step1WhatsApp";
import { Step2BusinessOps } from "./steps/Step2BusinessOps";
import { Step3AITraining } from "./steps/Step3AITraining";
import { Step4LeadManagement } from "./steps/Step4LeadManagement";
import { Step5Escalation } from "./steps/Step5Escalation";
import { Step6Integrations } from "./steps/Step6Integrations";
import { Step7Compliance } from "./steps/Step7Compliance";
import { Step8LaunchPlanning } from "./steps/Step8LaunchPlanning";
import { Step9FinalDetails } from "./steps/Step9FinalDetails";
import { ThankYouStep } from "./steps/ThankYouStep";
import confetti from "canvas-confetti";

export interface FormData {
  // Step 0
  businessName: string;
  industry: string;
  industryOther: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsApp: string;
  
  // Step 1
  whatsappNumber: string;
  whatsappStatus: string;
  metaBusinessManager: string;
  metaBusinessManagerId: string;
  
  // Step 2
  businessHoursStart: string;
  businessHoursEnd: string;
  timezone: string;
  messageVolume: string;
  teamMembers: Array<{ name: string; email: string }>;
  
  // Step 3
  topQuestions: string[];
  businessDescription: string;
  communicationStyle: string;
  sharePricing: string;
  pricingDetails: string;
  
  // Step 4
  leadInfo: string[];
  leadInfoCustom: string;
  priorityLeads: string[];
  appointmentBooking: string;
  calendarEmail: string;
  
  // Step 5
  escalationRules: string[];
  escalationMessages: string;
  escalationContact: string;
  escalationType: string;
  
  // Step 6
  currentCRM: string;
  crmOther: string;
  integrations: string[];
  integrationsOther: string;
  
  // Step 7
  compliance: string[];
  complianceOther: string;
  language: string;
  languageOther: string;
  dataStorage: string;
  
  // Step 8
  goLiveDate: string;
  trainingDate: string;
  trainingAttendees: string;
  selectedPlan: string;
  
  // Step 9
  successLooks: string;
  challenges: string;
  specialRequirements: string;
  referralSource: string[];
  referralName: string;
  referralOther: string;
  agreementAuthority: boolean;
  agreementTerms: boolean;
  agreementWhatsApp: boolean;
  agreementAccuracy: boolean;
  fullName: string;
  signatureDate: string;
}

const TOTAL_STEPS = 10;

export const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    industry: "",
    industryOther: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactWhatsApp: "",
    whatsappNumber: "",
    whatsappStatus: "",
    metaBusinessManager: "",
    metaBusinessManagerId: "",
    businessHoursStart: "",
    businessHoursEnd: "",
    timezone: "",
    messageVolume: "",
    teamMembers: [
      { name: "", email: "" },
      { name: "", email: "" },
      { name: "", email: "" },
      { name: "", email: "" },
    ],
    topQuestions: ["", "", "", "", ""],
    businessDescription: "",
    communicationStyle: "",
    sharePricing: "",
    pricingDetails: "",
    leadInfo: [],
    leadInfoCustom: "",
    priorityLeads: [],
    appointmentBooking: "",
    calendarEmail: "",
    escalationRules: [],
    escalationMessages: "",
    escalationContact: "",
    escalationType: "",
    currentCRM: "",
    crmOther: "",
    integrations: [],
    integrationsOther: "",
    compliance: [],
    complianceOther: "",
    language: "",
    languageOther: "",
    dataStorage: "",
    goLiveDate: "",
    trainingDate: "",
    trainingAttendees: "",
    selectedPlan: "",
    successLooks: "",
    challenges: "",
    specialRequirements: "",
    referralSource: [],
    referralName: "",
    referralOther: "",
    agreementAuthority: false,
    agreementTerms: false,
    agreementWhatsApp: false,
    agreementAccuracy: false,
    fullName: "",
    signatureDate: "",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setDirection("forward");
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === TOTAL_STEPS - 1) {
      // Submit form
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Move to thank you step
    setDirection("forward");
    setCurrentStep(TOTAL_STEPS);

    // Here you would send the form data via email
    console.log("Form submitted:", formData);
    
    // TODO: Implement email submission
    // You could use a service like EmailJS or a backend API
  };

  const progress = ((currentStep) / TOTAL_STEPS) * 100;

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      key: `step-${currentStep}-${direction}`,
    };

    switch (currentStep) {
      case 0:
        return <Step0Welcome {...stepProps} />;
      case 1:
        return <Step1WhatsApp {...stepProps} />;
      case 2:
        return <Step2BusinessOps {...stepProps} />;
      case 3:
        return <Step3AITraining {...stepProps} />;
      case 4:
        return <Step4LeadManagement {...stepProps} />;
      case 5:
        return <Step5Escalation {...stepProps} />;
      case 6:
        return <Step6Integrations {...stepProps} />;
      case 7:
        return <Step7Compliance {...stepProps} />;
      case 8:
        return <Step8LaunchPlanning {...stepProps} />;
      case 9:
        return <Step9FinalDetails {...stepProps} />;
      case 10:
        return <ThankYouStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
      {currentStep < TOTAL_STEPS && (
        <div className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-md z-50 border-b border-border">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Step {currentStep + 1} of {TOTAL_STEPS}
              </h2>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}

      <div className={currentStep < TOTAL_STEPS ? "pt-24 pb-8" : "pt-8 pb-8"}>
        <div className="container max-w-4xl mx-auto px-4">
          <div
            className={`
              ${direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"}
            `}
          >
            {renderStep()}
          </div>

          {currentStep < TOTAL_STEPS && (
            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                variant="hero"
                size="lg"
                onClick={handleNext}
                className="flex-1"
              >
                {currentStep === TOTAL_STEPS - 1 ? "Submit" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
