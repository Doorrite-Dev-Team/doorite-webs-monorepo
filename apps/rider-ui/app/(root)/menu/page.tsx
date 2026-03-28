"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Label } from "@repo/ui/components/label";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  DollarSign,
  MapPin,
  Send,
  ChevronDown,
} from "lucide-react";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/utils";

export default function HelpPage() {
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll get back to you soon.");
    setContactForm({ subject: "", message: "" });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with support",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "+1 (800) 123-4567",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "support@doorite.com",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const faqs = [
    {
      category: "Getting Started",
      icon: FileText,
      questions: [
        {
          q: "How do I start accepting deliveries?",
          a: "Toggle your availability to 'Available' in the Account page. You'll start receiving delivery requests immediately.",
        },
        {
          q: "What are the requirements to become a rider?",
          a: "You need to be at least 18 years old, have a valid driver's license or ID, own a vehicle, and pass a background check.",
        },
      ],
    },
    {
      category: "Earnings & Payments",
      icon: DollarSign,
      questions: [
        {
          q: "When do I get paid?",
          a: "Payouts are processed weekly every Friday for the previous week's earnings.",
        },
        {
          q: "Can I cash out early?",
          a: "Yes! We offer instant cashout for a small fee.",
        },
      ],
    },
    {
      category: "Deliveries",
      icon: MapPin,
      questions: [
        {
          q: "What if I can't find the customer?",
          a: "Try calling the customer using the in-app phone feature. If they don't answer, follow the delivery instructions.",
        },
        {
          q: "Can I decline an order?",
          a: "Yes, you can decline orders without penalty.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="pt-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="flex items-center gap-2 mb-2">
                <category.icon className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-sm text-gray-900">
                  {category.category}
                </h3>
              </div>
              <div className="space-y-2">
                {category.questions.map((faq, qIndex) => {
                  const faqId = `faq-${catIndex}-${qIndex}`;
                  const isOpen = openFaq === faqId;
                  return (
                    <div
                      key={qIndex}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : faqId)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-sm">{faq.q}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-gray-500 transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-sm text-gray-600">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Support Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Send us a message and we'll get back to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-sm">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="What do you need help with?"
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-sm">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Describe your issue..."
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                required
                className="mt-1 min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
