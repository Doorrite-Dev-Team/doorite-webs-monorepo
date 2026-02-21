"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui/components/sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import axios, { isAxiosError } from "axios";

import { Form } from "@repo/ui/components/form";
import { NavigationButtons } from "./components/NavigationButtons";
import { ProgressSteps } from "./components/ProgressSteps";
import { StepOne } from "./components/StepOne";
import { StepTwo } from "./components/StepTwo";
import { StepThree } from "./components/StepThree";
import { FormValues, Step } from "./components/types";

const STORAGE_KEY = "doorrite-vendor-signup-form-v1";

/**
 * Validation schema
 */
const formSchema = z
  .object({
    businessName: z
      .string()
      .min(4, "Business name must be at least 4 characters")
      .max(30, "Business name must be less than 30 characters"),
    phoneNumber: z.string().min(7, "Phone number must be at least 7 digits"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: z.object({
      country: z.string().min(1, "Country is required"),
      state: z.string().min(1, "State is required"),
      address: z.string().min(3, "Address is required"),
    }),
    category: z
      .array(z.string())
      .min(1, "Please select at least one business category"),
    logo: z.string().optional().nullable(),
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URI;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const saveTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      businessName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: {
        country: "nigeria",
        state: "",
        address: "",
      },
      category: [],
      logo: "",
    },
  });

  // Load persisted state on mount
  useEffect(() => {
    mountedRef.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          values?: Partial<FormValues>;
          step?: number;
        };

        if (parsed?.values) {
          form.reset({
            ...form.getValues(),
            ...(parsed.values as Partial<FormValues>),
          } as FormValues);
        }

        if (parsed?.step && typeof parsed.step === "number") {
          setCurrentStep(parsed.step);
        }
      }
    } catch (err) {
      console.warn("Failed to restore signup form from sessionStorage", err);
    }

    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [form]);

  // Save to sessionStorage (debounced)
  const persistFormState = useCallback(() => {
    if (!mountedRef.current) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      try {
        const toSave = {
          values: form.getValues(),
          step: currentStep,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (err) {
        console.warn("Failed to persist signup form to sessionStorage", err);
      } finally {
        saveTimerRef.current = null;
      }
    }, 500);
  }, [form, currentStep]);

  // Subscribe to form changes and step changes
  useEffect(() => {
    persistFormState();
  }, [currentStep, persistFormState]);

  useEffect(() => {
    const subscription = form.watch(() => {
      persistFormState();
    });
    return () => subscription.unsubscribe();
  }, [form, persistFormState]);

  // Helper: fields to validate per step
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

    if (!isStepValid) {
      toast.error("Please fix the errors before proceeding");
      return;
    }

    // Step 1 → Step 2: Just move forward
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    // Step 2 → Step 3: Create vendor account first, then send OTP
    if (currentStep === 2) {
      await handleCreateVendorAndSendOTP();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /**
   * Create vendor account, then send OTP
   */
  const handleCreateVendorAndSendOTP = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const values = form.getValues();

      // 1. Create vendor account
      const payload = {
        businessName: values.businessName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        address: values.address,
        categoryIds: values.category,
        logoUrl: values.logo || undefined,
      };

      const createResponse = await axios.post(
        `${baseUrl}/auth/create-vendor`,
        payload,
      );

      const createData = createResponse.data;

      if (!createData.ok) {
        toast.error(createData.message || "Failed to create account");
        setError(createData.message || "Failed to create account");
        return;
      }

      toast.success(createData?.message ?? "Account created successfully");

      toast.success("Verification code sent to your email!");
      setCurrentStep(3);
    } catch (err) {
      // console.error("Error in vendor creation/OTP:", err);
      // const message =
      //   err?.response?.data?.message || err?.message || "Unknown error";
      // toast.error("Failed to proceed", {
      //   description: message,
      // });
      let message;
      if (isAxiosError(err)) {
        message = err.response?.data.error || err.message || "Unknown error";
      } else if (err instanceof Error) {
        message = err.message;
      }
      message = message || err;
      console.error("Account creation failed", err);
      toast.error("Account creation failed", {
        description: message,
      });
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resend OTP
   */
  const handleResendOTP = async (): Promise<boolean> => {
    const email = form.getValues("email");
    setError("");

    try {
      const response = await axios.post(`${baseUrl}/auth/create-vendor-otp`, {
        email,
      });

      const data = response.data;

      if (!data.ok) {
        toast.error(data.message || "Failed to resend verification code");
        return false;
      }

      toast.success("Verification code resent!");
      return true;
    } catch (err) {
      let message;

      if (isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      message = message || err;
      console.error("Error resending OTP:", err);
      toast.error("Unable to resend OTP", {
        description: message,
      });
      setError(message);
      return false;
    }
  };

  const handleVerifySuccess = () => {
    // Handle successful verification
    // Redirect to the next step or perform any other action
    router.push("/log-in");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg">
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

            {/* Navigation buttons for steps 1 and 2 */}
            {currentStep < 3 && (
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={2}
                onPrevious={prevStep}
                onNext={nextStep}
                onSubmit={nextStep}
                isSubmitting={isSubmitting}
              />
            )}
          </Form>
        </div>

        {/* Error Indicator */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {Object.values(form.formState.errors).map((errItem, index) => (
                <li key={index}>{errItem?.message as string}</li>
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
                href="/log-in"
                className="font-semibold text-green-600 hover:text-green-700 transition-colors"
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
