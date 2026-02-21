"use client";

import { showToast } from "@/components/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import axios, { isAxiosError } from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { vendorAtom } from "@/store/vendorAtom";
import { useAtom } from "jotai";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [, setVendor] = useAtom(vendorAtom);
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      const res = await axios.post(
        "/api/auth/log-in",
        {
          identifier: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      console.log(res.data);
      if (!res || !res.data.ok) {
        const message = res.data?.message || "Login failed. Please try again.";
        showToast({
          message: "Login Failed",
          subtext: message,
          type: "error",
        });
        setError(message);
        return;
      }

      if (!res.data.data.vendor || !res.data.data.vendor.id) {
        const message = res.data?.message || "Login failed. Please try again.";
        showToast({
          message: "Login Failed",
          subtext: message,
          type: "error",
        });
        setError(message);
        return;
      }
      setVendor(res.data.data.vendor);

      toast.success("Login Successful");
      router.push("/dashboard");
    } catch (error) {
      let message = "Login Failed: An unexpected error occurred.";

      if (isAxiosError(error)) {
        const status = error.response?.status;

        // Handle 403 Forbidden - Account pending approval
        if (status === 403) {
          const errorMessage = error.response?.data?.message || "";

          // Check if it's specifically about pending approval
          if (
            errorMessage.toLowerCase().includes("pending") ||
            errorMessage.toLowerCase().includes("approval") ||
            errorMessage.toLowerCase().includes("not approved") ||
            errorMessage.toLowerCase().includes("Login failed".toLowerCase())
          ) {
            router.push("/pending-approval");
            return;
          }

          message = errorMessage || "Account pending admin approval";
        } else {
          message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.error("Login request failed:", error);
      setError(message);
      showToast({
        message: "Login Failed",
        subtext: message,
        type: "error",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<Mail className="w-4 h-4" />}
                  placeholder="e.g. johndoe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Use the email associated with your account
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Eye className="w-4 h-4 cursor-pointer" />
                      ) : (
                        <EyeOff className="w-4 h-4 cursor-pointer" />
                      )}
                    </button>
                  }
                  placeholder="***********"
                  type={showPassword ? "text" : "password"}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your password (6+ characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex max-sm:flex-col items-center justify-between max-sm:space-y-2">
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="text-primary font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging In..." : "Log In"}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

      {Object.keys(form.formState.errors).length > 0 && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-disc space-y-1 pl-5">
            {Object.values(form.formState.errors).map((error, index) => (
              <li key={index}>{error?.message as string}</li>
            ))}
          </ul>
        </div>
      )}
    </Form>
  );
};

export default LoginForm;
