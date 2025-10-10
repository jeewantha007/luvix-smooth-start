import { Button } from "@/components/ui/button";
import { FormData } from "../OnboardingForm";
import { CheckCircle2, Mail, CreditCard } from "lucide-react";

interface ThankYouProps {
  formData: FormData;
}

export const ThankYouStep = ({ formData }: ThankYouProps) => {
  const handleCheckout = () => {
    // TODO: Implement Stripe/PayPal checkout
    console.log("Proceeding to checkout for $79 setup fee");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4 animate-scale-in">
          <CheckCircle2 className="h-12 w-12 text-white" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Thank You, {formData.contactName || formData.fullName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your LUVIX onboarding form has been successfully submitted.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-lg space-y-6">
          <div className="flex items-start gap-4 text-left">
            <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Confirmation Sent</h3>
              <p className="text-muted-foreground">
                We've sent a copy of your agreement to{" "}
                <span className="font-medium text-foreground">{formData.contactEmail}</span>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold text-lg mb-4">What Happens Next?</h3>
            <ul className="space-y-3 text-left text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                  1
                </span>
                <span>Our team will review your information and reach out within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                  2
                </span>
                <span>We'll schedule your training session for {formData.trainingDate ? new Date(formData.trainingDate).toLocaleDateString() : "a date of your choice"}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                  3
                </span>
                <span>Your LUVIX system will be ready to go live on {formData.goLiveDate ? new Date(formData.goLiveDate).toLocaleDateString() : "your preferred date"}</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-xl p-8 mb-6">
              <h4 className="font-semibold text-2xl mb-3 text-foreground">Initial Setup Fee</h4>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-primary">$79</span>
                <span className="text-muted-foreground text-lg">one-time</span>
              </div>
              {formData.selectedPlan && (
                <p className="text-sm text-muted-foreground mb-4">
                  Selected Plan: <span className="font-semibold text-primary capitalize">{formData.selectedPlan}</span>
                </p>
              )}
            </div>
            <Button
              variant="hero"
              size="lg"
              onClick={handleCheckout}
              className="w-full text-lg py-6"
            >
              <CreditCard className="mr-2 h-6 w-6" />
              Complete Setup - Pay $79
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Questions? Contact us at</p>
          <a
            href="mailto:support@luvix.com"
            className="text-primary hover:underline font-medium"
          >
            support@luvix.com
          </a>
          {" or "}
          <a
            href="tel:+15551234567"
            className="text-primary hover:underline font-medium"
          >
            +1 (555) 123-4567
          </a>
        </div>
      </div>
    </div>
  );
};
