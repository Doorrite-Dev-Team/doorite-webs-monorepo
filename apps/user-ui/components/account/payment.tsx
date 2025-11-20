"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/card";
import { CreditCard, Phone, Plus } from "lucide-react";
import MenuItem from "./menu-item";

// Payment Options Section
const PaymentSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} />
          Payment Options
        </CardTitle>
        <CardDescription>Manage your payment methods securely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <MenuItem
          icon={CreditCard}
          title="Card Information"
          subtitle="**** **** **** 1234"
          isSecure={true}
          href="/account/payment/cards"
        />
        <MenuItem
          icon={Phone}
          title="Mobile Payment"
          subtitle="Apple Pay, Google Pay"
          href="/account/payment/mobile"
        />
        <MenuItem
          icon={Plus}
          title="Add Payment Method"
          href="/account/payment/add"
        />
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
