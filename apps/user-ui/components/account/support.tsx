"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/card";
import { HelpCircle, Phone } from "lucide-react";
import MenuItem from "./menu-item";

// Support Section
const SupportSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle size={20} />
          Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <MenuItem
          icon={HelpCircle}
          title="FAQ"
          subtitle="Find answers to common questions"
          href="/support/faq"
        />
        <MenuItem
          icon={Phone}
          title="Contact Us"
          subtitle="Get help from our support team"
          href="/support/contact"
        />
      </CardContent>
    </Card>
  );
};

export default SupportSection;
