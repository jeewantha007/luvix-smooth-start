import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme } = useTheme();
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
    console.log("handleNext called, currentStep:", currentStep);
    
    // Validate required fields before proceeding to next step
    if (!validateStep(currentStep, formData)) {
      return;
    }
    
    if (currentStep < TOTAL_STEPS) {
      setDirection("forward");
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === TOTAL_STEPS - 1) {
      console.log("Reached last step, calling handleSubmit");
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

  // Validation function for each step
  const validateStep = (step: number, data: FormData): boolean => {
    switch (step) {
      case 0: // Step 0 - Welcome
        if (!data.businessName?.trim()) {
          alert("Please enter your business name.");
          return false;
        }
        if (!data.industry) {
          alert("Please select your industry.");
          return false;
        }
        if (data.industry === "other" && !data.industryOther?.trim()) {
          alert("Please specify your industry.");
          return false;
        }
        if (!data.contactName?.trim()) {
          alert("Please enter the primary contact name.");
          return false;
        }
        if (!data.contactEmail?.trim()) {
          alert("Please enter the primary contact email.");
          return false;
        }
        if (!data.contactPhone?.trim()) {
          alert("Please enter the primary contact phone number.");
          return false;
        }
        return true;
      
      case 1: // Step 1 - WhatsApp
        if (!data.whatsappNumber?.trim()) {
          alert("Please enter your WhatsApp number.");
          return false;
        }
        if (!data.whatsappStatus) {
          alert("Please select your current WhatsApp status.");
          return false;
        }
        if (!data.metaBusinessManager) {
          alert("Please indicate if you have a Meta Business Manager account.");
          return false;
        }
        if (data.metaBusinessManager === "have" && !data.metaBusinessManagerId?.trim()) {
          alert("Please enter your Business Manager ID.");
          return false;
        }
        return true;
      
      case 2: // Step 2 - Business Operations
        if (!data.businessHoursStart) {
          alert("Please enter your business opening time.");
          return false;
        }
        if (!data.businessHoursEnd) {
          alert("Please enter your business closing time.");
          return false;
        }
        if (!data.timezone) {
          alert("Please select your timezone.");
          return false;
        }
        if (!data.messageVolume) {
          alert("Please select your daily WhatsApp message volume.");
          return false;
        }
        return true;
      
      case 3: // Step 3 - AI Training
        const filledQuestions = data.topQuestions?.filter(q => q.trim() !== "") || [];
        if (filledQuestions.length < 3) {
          alert("Please enter at least 3 top questions your customers ask.");
          return false;
        }
        if (!data.businessDescription?.trim()) {
          alert("Please describe your business.");
          return false;
        }
        if (!data.communicationStyle) {
          alert("Please select your communication style.");
          return false;
        }
        if (!data.sharePricing) {
          alert("Please indicate if AI can share pricing information.");
          return false;
        }
        if ((data.sharePricing === "yes-full" || data.sharePricing === "yes-starting") && 
            !data.pricingDetails?.trim()) {
          alert("Please provide pricing details for the AI to share.");
          return false;
        }
        return true;
      
      case 4: // Step 4 - Lead Management
        if (!data.leadInfo || data.leadInfo.length === 0) {
          alert("Please select what information you need to qualify leads.");
          return false;
        }
        if (data.leadInfo.includes("other") && !data.leadInfoCustom?.trim()) {
          alert("Please specify other lead information needed.");
          return false;
        }
        if (!data.appointmentBooking) {
          alert("Please indicate if you want to enable appointment booking.");
          return false;
        }
        if (data.appointmentBooking === "yes" && !data.calendarEmail?.trim()) {
          alert("Please enter the calendar email for appointments.");
          return false;
        }
        return true;
      
      case 5: // Step 5 - Escalation
        if (!data.escalationRules || data.escalationRules.length === 0) {
          alert("Please select when to escalate conversations.");
          return false;
        }
        if (data.escalationRules.includes("After a specific number of messages") && 
            !data.escalationMessages?.trim()) {
          alert("Please specify after how many messages to escalate.");
          return false;
        }
        if (!data.escalationType) {
          alert("Please select how we should notify you for escalations.");
          return false;
        }
        if (!data.escalationContact?.trim()) {
          alert("Please enter the escalation contact information.");
          return false;
        }
        return true;
      
      case 6: // Step 6 - Integrations
        if (!data.currentCRM) {
          alert("Please select your current CRM system.");
          return false;
        }
        if (data.currentCRM === "other" && !data.crmOther?.trim()) {
          alert("Please specify your CRM system.");
          return false;
        }
        return true;
      
      case 7: // Step 7 - Compliance
        if (!data.compliance || data.compliance.length === 0) {
          alert("Please select compliance requirements.");
          return false;
        }
        if (data.compliance.includes("other") && !data.complianceOther?.trim()) {
          alert("Please specify other compliance requirements.");
          return false;
        }
        if (!data.language) {
          alert("Please select your primary language.");
          return false;
        }
        if (data.language === "multi" && !data.languageOther?.trim()) {
          alert("Please specify the languages you need.");
          return false;
        }
        if (!data.dataStorage) {
          alert("Please select your data storage preference.");
          return false;
        }
        return true;
      
      case 8: // Step 8 - Launch Planning
        if (!data.goLiveDate) {
          alert("Please select your preferred go-live date.");
          return false;
        }
        if (!data.selectedPlan) {
          alert("Please select a plan.");
          return false;
        }
        if (data.trainingDate && !data.trainingAttendees) {
          alert("Please enter the number of training attendees.");
          return false;
        }
        if (data.trainingAttendees && !data.trainingDate) {
          alert("Please select a training date.");
          return false;
        }
        return true;
      
      case 9: // Step 9 - Final Details (already handled in handleSubmit)
        // This is handled in handleSubmit since it's the final step
        return true;
      
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");
    
    // Basic validation for required fields in the final step
    if (currentStep === TOTAL_STEPS - 1) {
      if (!formData.successLooks) {
        alert("Please describe what success looks like for your business.");
        return;
      }
      
      if (!formData.agreementAuthority || !formData.agreementTerms || 
          !formData.agreementWhatsApp || !formData.agreementAccuracy) {
        alert("Please agree to all terms and conditions.");
        return;
      }
      
      if (!formData.fullName) {
        alert("Please enter your full name for the signature.");
        return;
      }
      
      if (!formData.signatureDate) {
        alert("Please enter the date for the signature.");
        return;
      }
    }
    
    try {
      // Trigger confetti
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  
      console.log("Sending form data:", formData);
  
      // Send form data to backend
      const res = await fetch("/api/send-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      console.log("Fetch response received");
  
      const data = await res.json();
      console.log("Response data:", data);
  
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Email failed");
      }
  
      // Move to thank you step
      setDirection("forward");
      setCurrentStep(TOTAL_STEPS);
      console.log("Form submitted successfully, moving to Thank You step");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      alert(`Failed to submit form. Please try again. Error: ${err.message}`);
    }
  };
  
  const progress = ((currentStep) / TOTAL_STEPS) * 100;

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
    };
    
    const key = `step-${currentStep}-${direction}`;

    switch (currentStep) {
      case 0:
        return <Step0Welcome {...stepProps} key={key} />;
      case 1:
        return <Step1WhatsApp {...stepProps} key={key} />;
      case 2:
        return <Step2BusinessOps {...stepProps} key={key} />;
      case 3:
        return <Step3AITraining {...stepProps} key={key} />;
      case 4:
        return <Step4LeadManagement {...stepProps} key={key} />;
      case 5:
        return <Step5Escalation {...stepProps} key={key} />;
      case 6:
        return <Step6Integrations {...stepProps} key={key} />;
      case 7:
        return <Step7Compliance {...stepProps} key={key} />;
      case 8:
        return <Step8LaunchPlanning {...stepProps} key={key} />;
      case 9:
        return <Step9FinalDetails {...stepProps} key={key} />;
      case 10:
        return <ThankYouStep formData={formData} key={key} />;
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
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Step {currentStep + 1} of {TOTAL_STEPS}
                </h2>
                <ThemeToggle />
              </div>
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
