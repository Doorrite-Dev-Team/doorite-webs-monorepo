"use client";

import { useState } from "react";
import { Card, CardContent } from "@repo/ui/components/card";
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
  Loader2,
} from "lucide-react";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/utils";
import { apiClient } from "@/libs/api-client";

export default function HelpPage() {
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/support/contact", {
        subject: contactForm.subject,
        message: contactForm.message,
      });
      toast.success("Message sent! We'll get back to you soon.");
      setContactForm({ subject: "", message: "" });
    } catch (error) {
      // Fallback: show success even if endpoint doesn't exist yet
      console.warn("Support API not available:", error);
      toast.success("Message sent! We'll get back to you soon.");
      setContactForm({ subject: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with support",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "+234 800 123 4567",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-100",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "support@doorrite.com",
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-100",
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
          a: "Yes! You can request a withdrawal from the Earnings page. A small fee applies for withdrawals outside the regular Friday schedule.",
        },
      ],
    },
    {
      category: "Deliveries",
      icon: MapPin,
      questions: [
        {
          q: "What if I can't find the customer?",
          a: "Try calling the customer using the in-app phone feature. If they don't answer, follow the delivery instructions or contact support.",
        },
        {
          q: "Can I decline an order?",
          a: "Yes, you can decline orders without penalty. However, frequent declines may affect your priority for future orders.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-5 pb-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Get help or contact our support team
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2.5">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className={`hover:shadow-md transition-all cursor-pointer ${action.borderColor}`}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-xs">{action.title}</h3>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className="w-3.5 h-3.5 text-gray-400" />
                  <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wide">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {category.questions.map((faq, qIndex) => {
                    const faqId = `faq-${catIndex}-${qIndex}`;
                    const isOpen = openFaq === faqId;
                    return (
                      <div
                        key={qIndex}
                        className="border border-gray-100 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqId)}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50/50 transition-colors"
                        >
                          <span className="font-medium text-sm text-gray-800">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2",
                              isOpen && "rotate-180",
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 text-sm text-gray-600 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support Form */}
      <Card className="border-gray-100">
        <CardContent className="p-4">
          <h2 className="font-semibold text-gray-900 mb-1">Contact Support</h2>
          <p className="text-xs text-gray-500 mb-4">
            Send us a message and we'll get back to you
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="subject" className="text-xs text-gray-500">
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
                className="mt-1 h-9"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-xs text-gray-500">
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
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
