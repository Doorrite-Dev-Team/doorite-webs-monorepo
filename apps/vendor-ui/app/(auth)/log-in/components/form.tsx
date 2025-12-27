"use client";

import { showToast } from "@/components/Toast";
import apiClient from "@/libs/api/client";
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
import { Link, Lock, Mail } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [error, setError] = React.useState<string | null>(null);
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
      // Attempt login (replace with your actual login action)
      const res = await apiClient.post("/login", {
        email: values.email,
        password: values.password,
      });

      if (!res || !res.data.ok) {
        const message = "Login failed. Please try again.";
        showToast({
          message: "Login Failed",
          subtext: message,
          type: "error",
        });
        setError(message);
        return;
      }

      toast.success("Login Successful");

      router.push("/dashboard");
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
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
                <div className="relative">
                  <Input
                    placeholder="e.g. johndoe@example.com"
                    type="email"
                    {...field}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 w-4 h-4" />
                </div>
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
                <div className="relative">
                  <Input placeholder="***********" type="password" {...field} />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 w-4 h-4" />
                </div>
              </FormControl>
              <FormDescription>
                Enter your password (6+ characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
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
              href="/signup"
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
