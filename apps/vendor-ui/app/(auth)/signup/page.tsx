"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/form";
import { toast } from "@repo/ui/components/sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Import our custom components
import Link from "next/link";
import { NavigationButtons } from "./components/NavigationButtons";
import { ProgressSteps } from "./components/progressSteps";
import { FormValues, StepOne } from "./components/stepOne";
import { StepTwo } from "./components/steptwo";
import BusinessSetupForm from "./components/BusinessSetupForm";

const formSchema = z
  .object({
    businessName: z
      .string()
      .min(4, "Business name must be at least 4 characters")
      .max(30, "Business name must be less than 30 characters"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: z.tuple([
      z.string().min(1, "Country is required"),
      z.string().optional(),
    ]),
    category: z.array(z.string()).min(1, "Please select at least one business category"), // ✅ fixed
    logo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


const steps = [
  {
    id: 1,
    title: "Account Details",
    description: "Set up your business account",
  },
  {
    id: 2,
    title: "Business Information",
    description: "Tell us about your business",
  },
];

export default function MultistepSignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [files, setFiles] = useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

 const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  mode: "onChange",
  defaultValues: {
    businessName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: ["", ""],
    category: [], // ✅ fixed
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
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", values);
      console.log("Uploaded files:", files);

      toast.success("Account created successfully!");
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ProgressSteps steps={steps} currentStep={currentStep} />

      <Form {...form}>
        <BusinessSetupForm />
        
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Form>
      <div className="mt-10">
        <span className="text-sm font-light text-center flex items-center justify-center gap-3">
          Already Have an account?{" "}
          <Link className="text-primary font-normal" href="/login">
            Log In
          </Link>{" "}
        </span>
      </div>
    </div>
  );
}
