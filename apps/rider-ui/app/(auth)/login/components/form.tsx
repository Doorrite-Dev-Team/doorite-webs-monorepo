"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "@repo/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { loginUser } from "@/actions/auth";

// ✅ Validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("🟢 Attempting login with:", values);

      const res = await loginUser(values.email, values.password);
      console.log("🔵 Login response:", res);

      // ✅ Always show exact backend response
      toast(res?.ok ? "✅ Success" : "❌ Error", {
        description: res?.message || "No response message from server.",
      });

      if (!res || !res.ok) {
        return;
      }

      const user = res.data;
      if (!user) {
        toast("⚠️ Error", { description: "Invalid response from server." });
        return;
      }

      // ✅ Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      console.log("💾 Saved user to localStorage:", user);

      // ✅ Extra detail toast for debugging
      toast("✅ Login Successful", {
        description: (
          <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white">{JSON.stringify(user, null, 2)}</code>
          </pre>
        ),
      });

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Login failed:", error);

      // ✅ Show backend/network error via toast
      toast("⚠️ Error", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
      });
    }
  };

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
