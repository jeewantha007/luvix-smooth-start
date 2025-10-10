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

// Define validation errors type
interface ValidationErrors {
  [key: string]: string;
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

  // State for validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    
    // Clear errors for fields that are being updated
    const errorKeys = Object.keys(data);
    if (errorKeys.length > 0) {
      const newErrors = { ...errors };
      errorKeys.forEach(key => {
        delete newErrors[key];
      });
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    console.log("handleNext called, currentStep:", currentStep);
    
    // Validate required fields before proceeding to next step
    const validationErrors = validateStep(currentStep, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear errors when moving to next step
    setErrors({});
    
    // Fix the condition: use TOTAL_STEPS - 1 instead of TOTAL_STEPS
    if (currentStep < TOTAL_STEPS - 1) {
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
  const validateStep = (step: number, data: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    switch (step) {
      case 0: // Step 0 - Welcome
        if (!data.businessName?.trim()) {
          errors.businessName = "Business name is required";
        }
        if (!data.industry) {
          errors.industry = "Industry is required";
        }
        if (data.industry === "other" && !data.industryOther?.trim()) {
          errors.industryOther = "Please specify your industry";
        }
        if (!data.contactName?.trim()) {
          errors.contactName = "Contact name is required";
        }
        if (!data.contactEmail?.trim()) {
          errors.contactEmail = "Contact email is required";
        }
        if (!data.contactPhone?.trim()) {
          errors.contactPhone = "Contact phone is required";
        }
        return errors;
      
      case 1: // Step 1 - WhatsApp
        if (!data.whatsappNumber?.trim()) {
          errors.whatsappNumber = "WhatsApp number is required";
        }
        if (!data.whatsappStatus) {
          errors.whatsappStatus = "WhatsApp status is required";
        }
        if (!data.metaBusinessManager) {
          errors.metaBusinessManager = "Meta Business Manager status is required";
        }
        if (data.metaBusinessManager === "have" && !data.metaBusinessManagerId?.trim()) {
          errors.metaBusinessManagerId = "Business Manager ID is required";
        }
        return errors;
      
      case 2: // Step 2 - Business Operations
        if (!data.businessHoursStart) {
          errors.businessHoursStart = "Opening time is required";
        }
        if (!data.businessHoursEnd) {
          errors.businessHoursEnd = "Closing time is required";
        }
        if (!data.timezone) {
          errors.timezone = "Timezone is required";
        }
        if (!data.messageVolume) {
          errors.messageVolume = "Message volume is required";
        }
        return errors;
      
      case 3: // Step 3 - AI Training
        const filledQuestions = data.topQuestions?.filter(q => q.trim() !== "") || [];
        if (filledQuestions.length < 3) {
          errors.topQuestions = "Please enter at least 3 top questions your customers ask";
        }
        if (!data.businessDescription?.trim()) {
          errors.businessDescription = "Business description is required";
        }
        if (!data.communicationStyle) {
          errors.communicationStyle = "Communication style is required";
        }
        if (!data.sharePricing) {
          errors.sharePricing = "Pricing sharing preference is required";
        }
        if ((data.sharePricing === "yes-full" || data.sharePricing === "yes-starting") && 
            !data.pricingDetails?.trim()) {
          errors.pricingDetails = "Pricing details are required";
        }
        return errors;
      
      case 4: // Step 4 - Lead Management
        if (!data.leadInfo || data.leadInfo.length === 0) {
          errors.leadInfo = "Please select at least one lead information type";
        }
        if (data.leadInfo.includes("other") && !data.leadInfoCustom?.trim()) {
          errors.leadInfoCustom = "Please specify other lead information";
        }
        if (!data.appointmentBooking) {
          errors.appointmentBooking = "Appointment booking preference is required";
        }
        if (data.appointmentBooking === "yes" && !data.calendarEmail?.trim()) {
          errors.calendarEmail = "Calendar email is required for appointment booking";
        }
        return errors;
      
      case 5: // Step 5 - Escalation
        if (!data.escalationRules || data.escalationRules.length === 0) {
          errors.escalationRules = "Please select at least one escalation trigger";
        }
        if (data.escalationRules.includes("After a specific number of messages") && 
            !data.escalationMessages?.trim()) {
          errors.escalationMessages = "Please specify the number of messages";
        }
        if (!data.escalationType) {
          errors.escalationType = "Escalation notification type is required";
        }
        if (!data.escalationContact?.trim()) {
          errors.escalationContact = "Escalation contact information is required";
        }
        return errors;
      
      case 6: // Step 6 - Integrations
        if (!data.currentCRM) {
          errors.currentCRM = "Current CRM selection is required";
        }
        if (data.currentCRM === "other" && !data.crmOther?.trim()) {
          errors.crmOther = "Please specify your CRM system";
        }
        return errors;
      
      case 7: // Step 7 - Compliance
        if (!data.compliance || data.compliance.length === 0) {
          errors.compliance = "Please select at least one compliance requirement";
        }
        if (data.compliance.includes("other") && !data.complianceOther?.trim()) {
          errors.complianceOther = "Please specify other compliance requirements";
        }
        if (!data.language) {
          errors.language = "Language selection is required";
        }
        if (data.language === "multi" && !data.languageOther?.trim()) {
          errors.languageOther = "Please specify the languages you need";
        }
        if (!data.dataStorage) {
          errors.dataStorage = "Data storage preference is required";
        }
        return errors;
      
      case 8: // Step 8 - Launch Planning
        if (!data.goLiveDate) {
          errors.goLiveDate = "Go-live date is required";
        }
        if (!data.selectedPlan) {
          errors.selectedPlan = "Plan selection is required";
        }
        if (data.trainingDate && !data.trainingAttendees) {
          errors.trainingAttendees = "Number of attendees is required when training date is set";
        }
        if (data.trainingAttendees && !data.trainingDate) {
          errors.trainingDate = "Training date is required when number of attendees is set";
        }
        return errors;
      
      case 9: // Step 9 - Final Details (handled in handleSubmit)
        // This is handled in handleSubmit since it's the final step
        return errors;
      
      default:
        return errors;
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");
    
    // Basic validation for required fields in the final step
    const finalStepErrors: ValidationErrors = {};
    if (!formData.successLooks?.trim()) {
      finalStepErrors.successLooks = "Please describe what success looks like for your business";
    }
    
    if (!formData.agreementAuthority || !formData.agreementTerms || 
        !formData.agreementWhatsApp || !formData.agreementAccuracy) {
      finalStepErrors.agreements = "Please agree to all terms and conditions";
    }
    
    if (!formData.fullName?.trim()) {
      finalStepErrors.fullName = "Full name is required for signature";
    }
    
    if (!formData.signatureDate) {
      finalStepErrors.signatureDate = "Signature date is required";
    }
    
    if (Object.keys(finalStepErrors).length > 0) {
      setErrors(finalStepErrors);
      return;
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
    // Pass common props to step components
    const stepProps = {
      formData,
      updateFormData,
      errors,
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
        // Pass only the required props to Step9FinalDetails
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