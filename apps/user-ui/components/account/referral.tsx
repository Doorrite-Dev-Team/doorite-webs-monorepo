"use client";

import * as React from "react";
import { api } from "@/actions/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Copy, Gift, Users, Truck } from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

interface ApplyReferralResponse {
  success: boolean;
  message?: string;
  freeDeliveryOrders?: number;
  error?: string;
}

export const ReferralSection = () => {
  const [referralCode, setReferralCode] = React.useState<string | null>(null);
  const [freeDeliveryOrders, setFreeDeliveryOrders] = React.useState<number>(0);
  const [applyCode, setApplyCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isApplying, setIsApplying] = React.useState(false);

  React.useEffect(() => {
    const fetchReferralCode = async () => {
      const data = await api.fetchMyReferralCode();
      if (data?.ok && data.referralCode) {
        setReferralCode(data.referralCode);
        setFreeDeliveryOrders(data.freeDeliveryOrders || 0);
      }
      setIsLoading(false);
    };
    fetchReferralCode();
  }, []);

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!");
    }
  };

  const handleApplyCode = async () => {
    if (!applyCode.trim()) {
      toast.error("Please enter a referral code");
      return;
    }

    setIsApplying(true);
    const result = await api.applyReferralCode(applyCode.trim());
    setIsApplying(false);

    if (result.success) {
      const res = result as ApplyReferralResponse;
      toast.success(res.message || "Referral code applied!");
      setApplyCode("");
      setFreeDeliveryOrders(res.freeDeliveryOrders || 0);
    } else {
      toast.error(result.error || "Failed to apply referral code");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-gray-900">Your Referral Code</h3>
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={referralCode || ""}
              readOnly
              className="font-mono text-lg font-bold"
            />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            Share your code with friends. They get 2 free delivery orders, and
            you earn ₦1000 per successful referral!
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Truck className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-gray-900">
              Your Free Deliveries
            </h3>
          </div>

          <p className="text-2xl font-bold text-primary">
            {freeDeliveryOrders}
          </p>
          <p className="text-sm text-gray-600">
            Free delivery orders available
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Gift className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-gray-900">Have a Code?</h3>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter referral code"
              value={applyCode}
              onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
              className="font-mono"
            />
            <Button onClick={handleApplyCode} disabled={isApplying}>
              {isApplying ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
