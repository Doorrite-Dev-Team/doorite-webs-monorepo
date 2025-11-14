"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { showToast } from "@/components/Toast";
import { loginUser } from "@/actions/auth";
import type { ApiResponse, User } from "@/actions/auth";

// ✅ Validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Enhanced Submit Handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("🟢 Attempting login with:", values);

      const res = (await loginUser(
        values.email,
        values.password
      )) as ApiResponse<User>;

      console.log("📨 Login response:", res);

      // Handle backend-side errors
      if (!res.ok) {
        const backendError =
          (res as any).error ||
          (res as any).message ||
          "Login failed. Please try again.";

        showToast({
          message: "Login Failed",
          subtext: backendError,
          type: "error",
        });

        console.error("❌ Backend error:", backendError);
        return;
      }

      // Handle missing user data
      const user = res.data;
      if (!user) {
        showToast({
          message: "Invalid Response",
          subtext: "Server did not return user data.",
          type: "error",
        });
        return;
      }

      // ✅ Save user locally
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        console.log("💾 Saved user to localStorage:", user);
      }

      // ✅ Success toast
      showToast({
        message: "Login Successful!",
        subtext: `Welcome back, ${user.email}`,
        type: "success",
      });

      // ✅ Redirect
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Login request failed:", error);

      // ✅ Try to extract backend error from Axios or Fetch
      const backendError =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";

      showToast({
        message: "Login Failed",
        subtext: backendError,
        type: "error",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. johndoe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter your account email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="***********" type="password" {...field} />
              </FormControl>
              <FormDescription>
                Choose a secure password (8+ characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging In..." : "Log In"}
        </Button>
      </form>
    </Form>
  );
}
