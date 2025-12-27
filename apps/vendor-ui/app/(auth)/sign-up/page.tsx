"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui/components/sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

import { Form } from "@repo/ui/components/form";
import { NavigationButtons } from "./components/NavigationButtons";
import { ProgressSteps } from "./components/ProgressSteps";
import { StepOne } from "./components/StepOne";
import { StepTwo } from "./components/StepTwo";
import { StepThree } from "./components/StepThree";
import { FormValues, Step } from "./components/types";
import apiClient from "@/libs/api/client";

const formSchema = z
  .object({
    businessName: z
      .string()
      .min(4, "Business name must be at least 4 characters")
      .max(30, "Business name must be less than 30 characters"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: z.tuple([
      z.string().min(1, "Country is required"),
      z.string().min(1, "State is required"),
    ]),
    category: z
      .array(z.string())
      .min(1, "Please select at least one business category"),
    logo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const steps: Step[] = [
  {
    id: 1,
    title: "Account Details",
    description: "Set up your business account credentials",
  },
  {
    id: 2,
    title: "Business Information",
    description: "Tell us about your business",
  },
  {
    id: 3,
    title: "Email Verification",
    description: "Verify your email address",
  },
];

export default function MultistepSignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormValues | null>(
    null,
  );
  const [error, setError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      businessName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: ["nigeria", ""],
      category: [],
      logo: "",
    },
  });

  const getFieldsToValidate = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 1:
        return [
          "businessName",
          "phoneNumber",
          "email",
          "password",
          "confirmPassword",
        ];
      case 2:
        return ["address", "category"];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const isStepValid = await form.trigger(fieldsToValidate);

    if (isStepValid) {
      // If moving from step 2 to step 3, send OTP
      if (currentStep === 2) {
        await handleSendOTP();
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      }
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSendOTP = async () => {
    const email = form.getValues("email");
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiClient.post("/api/auth/send-otp", {
        email,
        purpose: "verify",
      });
      const data = response.data;

      if (!data.ok) {
        toast.error(data.message || "Failed to send verification code");
        return;
      }

      toast.success("Verification code sent to your email!");
      setCurrentStep(3);
    } catch (error) {
      console.error("Error sending OTP:", error);
      const message = (error as Error).message;
      toast.error("Failed to send verification code.", {
        description: `${message} Please try again.`,
      });
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async (): Promise<boolean> => {
    const email = form.getValues("email");
    setError("");

    try {
      const response = await apiClient.post("/api/auth/send-otp", {
        email,
        purpose: "verify",
      });

      const data = response.data;

      if (!data.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error resending OTP:", error);
      const message = (error as Error).message;
      toast.error("Unable to Resend OTP", {
        description: `Error: ${message}`,
      });
      setError(message);
      return false;
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setPendingFormData(values);
    setError("");

    try {
      // Create the vendor account
      const response = await apiClient.post("/api/auth/vendor-signup", values);

      const data = response.data;

      if (!data.ok) {
        toast.error(data.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");

      // Redirect to dashboard or login
      router.push("/dashboard");
    } catch (error) {
      console.error("Form submission error", error);
      const message = (error as Error).message;
      toast.error("Failed to create account", {
        description: `Error: ${message}, Please try again.`,
      });
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySuccess = () => {
    // After successful OTP verification, submit the form
    if (pendingFormData) {
      onSubmit(pendingFormData);
    } else {
      // If no pending data, get current form values
      const values = form.getValues();
      onSubmit(values);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    setError("");
    if (isValid) {
      // Move to OTP verification step
      await handleSendOTP();
    } else {
      const message = "Please fix the errors before proceeding";
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Business Account
          </h1>
          <p className="text-gray-600 mt-2">
            Join thousands of businesses already using our platform
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <ProgressSteps steps={steps} currentStep={currentStep} />

          <Form {...form}>
            <div className="mt-8">
              {currentStep === 1 && <StepOne />}
              {currentStep === 2 && <StepTwo />}
              {currentStep === 3 && (
                <StepThree
                  email={form.getValues("email")}
                  onVerifySuccess={handleVerifySuccess}
                  onResendOTP={handleResendOTP}
                />
              )}
            </div>

            {/* Only show navigation buttons for steps 1 and 2 */}
            {currentStep < 3 && (
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={steps.length - 1} // Exclude OTP step from normal navigation
                onPrevious={prevStep}
                onNext={nextStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </Form>
        </div>

        {/* Error Indicator */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {Object.values(form.formState.errors).map((error, index) => (
                <li key={index}>{error?.message as string}</li>
              ))}
            </ul>
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Footer */}
        {currentStep < 3 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
