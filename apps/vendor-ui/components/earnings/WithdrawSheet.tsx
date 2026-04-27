"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/libs/api/client";
import { toast } from "@repo/ui/components/sonner";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@repo/ui/components/sheet";
import { Loader2, Wallet, CheckCircle2, CreditCard } from "lucide-react";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { deriveError } from "@/libs/utils/errorHandler";

const WithdrawSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z
    .string()
    .min(10, "Valid account number is required")
    .max(10, "Account number must be 10 digits"),
  accountName: z.string().min(2, "Account name is required"),
  amount: z.number().min(2000, "Minimum withdrawal is ₦2,000"),
});

type WithdrawFormValues = z.infer<typeof WithdrawSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
  disabled?: boolean;
};

export default function WithdrawSheet({ open, onOpenChange, balance, disabled = false }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(WithdrawSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountName: "",
      amount: 0,
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      const bankData = await form.trigger([
        "bankName",
        "accountNumber",
        "accountName",
      ]);
      if (bankData) setStep(2);
    } else if (step === 2) {
      const amountData = await form.trigger(["amount"]);
      if (amountData) setStep(3);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: WithdrawFormValues) => {
    if (data.amount > balance) {
      toast.error("Insufficient balance", {
        description: `Your available balance is ₦${balance.toLocaleString()}`,
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/vendors/earnings/withdraw", data);
      toast.success("Withdrawal request submitted successfully", {
        description: `₦${data.amount.toLocaleString()} will be transferred to your account`,
      });
      setStep(1);
      form.reset();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = deriveError(err) || "Failed to process withdrawal";
      toast.error("Withdrawal failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" />
            Withdraw Funds
          </SheetTitle>
          <SheetDescription>
            Transfer your earnings to your bank account
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1">
              <ScrollArea className="h-[calc(100%-8rem)] px-6">
                <div className="py-4 space-y-6">
                  {/* Step Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-2 w-8 rounded-full transition-colors ${
                          step >= s ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Bank Details
                      </h3>
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. First Bank" {...field} disabled={disabled} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="10 digits" {...field} disabled={disabled} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Full account name"
                                {...field}
                                disabled={disabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="font-semibold text-sm text-gray-900">
                        Withdrawal Amount
                      </h3>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
                        <p className="text-xs text-green-600 font-medium">
                          Available Balance
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          ₦{balance.toLocaleString()}
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount to Withdraw (₦)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="2000"
                                {...field}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  field.onChange(value);
                                }}
                                min={0}
                                max={balance}
                                disabled={disabled}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum withdrawal is ₦2,000. Maximum: ₦
                              {balance.toLocaleString()}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                          Confirm Withdrawal
                        </h3>
                        <p className="text-sm text-gray-500">
                          Please review your details before submitting
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border text-left space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Bank:</span>
                          <span className="font-medium">
                            {form.getValues("bankName")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Account:</span>
                          <span className="font-medium">
                            {form.getValues("accountNumber")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium">
                            {form.getValues("accountName")}
                          </span>
                        </div>
                        <div className="h-px bg-gray-200 my-2" />
                        <div className="flex justify-between text-base font-bold">
                          <span className="text-gray-900">Amount:</span>
                          <span className="text-green-600">
                            ₦{form.getValues("amount").toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <SheetFooter className="px-6 py-4 border-t bg-gray-50/50">
              <div className="flex gap-3 w-full">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleNext}
                    disabled={disabled || loading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={loading || disabled}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm & Withdraw"
                    )}
                  </Button>
                )}
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
