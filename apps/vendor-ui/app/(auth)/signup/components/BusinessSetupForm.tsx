"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { StepOne } from "./stepOne";
import { StepTwo } from "./steptwo";
import { signUpUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import VerifyOTP from "./verify-otp";
import { io } from "socket.io-client";

// ✅ Initialize socket connection
const socket = io("ws://localhost:4000", {
  transports: ["websocket"],
});

// ✅ Validation schema
const formSchema = z
  .object({
    businessName: z
      .string()
      .min(4, "Business name must be at least 4 characters"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    address: z.tuple([z.string(), z.string().optional()]),
    category: z
      .array(z.string())
      .nonempty("Please select at least one category"),
    logo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;

export default function BusinessSetupForm() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: ["", ""],
      category: [],
      logo: "",
    },
  });

  const [step, setStep] = useState(1);
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [files, setFiles] = useState<File[] | null>(null);
  const [showOTP, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // ✅ Auto-send vendor’s geolocation when form mounts
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("📍 Current Location:", latitude, longitude);

        socket.emit("vendor:location", {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        });

        console.log("📤 Location sent to backend via WebSocket");
      },
      (error) => {
        console.error("❌ Error getting location:", error);
      }
    );
  }, []);

  // ✅ Final submit handler
  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        businessName: values.businessName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        address: values.address.filter(Boolean).join(", "),
        categoryIds: values.category,
        logoUrl: values.logo || "",
      };

      console.log("📦 Sending payload:", payload);

      const res = await signUpUser(payload);

      if (!res?.ok) {
        toast.error(res?.message || "Failed to register vendor");
        return;
      }

      // ✅ Emit vendor address & info to backend after successful signup
      socket.emit("vendor:address", {
        businessName: payload.businessName,
        email: payload.email,
        address: payload.address,
        timestamp: new Date().toISOString(),
      });

      console.log("📤 Address sent via WebSocket:", payload.address);

      // ✅ Continue OTP flow
      setUserEmail(values.email);
      setShowOtp(true);

      toast.success("Verification code sent to your email", {
        description: `Check your inbox for the OTP`,
      });
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  // ✅ Show OTP verification screen after registration
  if (showOTP)
    return (
      <VerifyOTP
        email={userEmail}
        verificationType="email"
        onVerifySuccess={() => router.push("/login")}
        setToSignUp={setShowOtp}
      />
    );

  // ✅ Default business setup form view
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-6 space-y-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          {step === 1 ? "Business Information" : "Additional Details"}
        </h2>

        {step === 1 && <StepOne control={control} />}
        {step === 2 && (
          <StepTwo
            control={control}
            setValue={setValue}
            getValues={getValues}
            countryName={countryName}
            setCountryName={setCountryName}
            stateName={stateName}
            setStateName={setStateName}
            files={files}
            setFiles={setFiles}
          />
        )}

        {/* Step Navigation */}
        <div className="flex justify-between items-center pt-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <Button type="button" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
