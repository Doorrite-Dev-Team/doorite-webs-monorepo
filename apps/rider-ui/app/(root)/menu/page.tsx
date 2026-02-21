"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Label } from "@repo/ui/components/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  DollarSign,
  MapPin,
  Settings,
  Send
} from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

export default function HelpPage() {
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll get back to you soon.");
    setContactForm({ subject: "", message: "" });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "+1 (800) 123-4567",
      action: "Call Now",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "support@doorite.com",
      action: "Send Email",
      color: "bg-purple-100 text-purple-600"
    },
  ];

  const faqs = [
    {
      category: "Getting Started",
      icon: FileText,
      questions: [
        {
          q: "How do I start accepting deliveries?",
          a: "Toggle your availability to 'Available' in the Account page. You'll start receiving delivery requests immediately. Make sure your location services are enabled for the best experience."
        },
        {
          q: "What are the requirements to become a rider?",
          a: "You need to be at least 18 years old, have a valid driver's license or ID, own a vehicle (bike, scooter, or car), and pass a background check. You'll also need a smartphone with GPS capabilities."
        },
        {
          q: "How do I update my vehicle information?",
          a: "Go to your Account page and click 'Edit Profile'. You can update your vehicle type and other details there. Changes may require verification."
        },
      ]
    },
    {
      category: "Earnings & Payments",
      icon: DollarSign,
      questions: [
        {
          q: "When do I get paid?",
          a: "Payouts are processed weekly every Friday for the previous week's earnings. You can view your next payout date and amount in the Earnings section."
        },
        {
          q: "How are delivery fees calculated?",
          a: "Delivery fees are based on distance, demand, and time of day. You'll see the exact amount before accepting each order. Peak hours and bad weather may offer higher rates."
        },
        {
          q: "Can I cash out early?",
          a: "Yes! We offer instant cashout for a small fee. Go to Earnings > Manage Payment Methods to set up instant payout."
        },
      ]
    },
    {
      category: "Deliveries",
      icon: MapPin,
      questions: [
        {
          q: "What if I can't find the customer?",
          a: "First, try calling the customer using the in-app phone feature. If they don't answer, follow the delivery instructions. You can also mark the delivery as 'Unable to Complete' and contact support."
        },
        {
          q: "Can I decline an order?",
          a: "Yes, you can decline orders without penalty. However, maintaining a high acceptance rate helps you receive more orders and may qualify you for bonuses."
        },
        {
          q: "What if the restaurant is closed?",
          a: "Mark the order as 'Restaurant Closed' in the app. You'll still receive compensation for your time, and the customer will be refunded."
        },
      ]
    },
    {
      category: "Technical Issues",
      icon: Settings,
      questions: [
        {
          q: "The app won't let me go online",
          a: "Make sure you have a stable internet connection and location services enabled. Try restarting the app. If the problem persists, contact support."
        },
        {
          q: "I'm not receiving order notifications",
          a: "Check your notification settings in both the app and your phone's system settings. Make sure DoorRite has permission to send notifications."
        },
        {
          q: "The map isn't working properly",
          a: "Ensure you've granted location permissions to the app. Try refreshing the map or restarting the app. Check that you have a stable GPS signal."
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600 text-lg">We're here to help you succeed</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center`}>
                    <action.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                  <Button className="w-full mt-2">
                    {action.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((category, catIndex) => (
                <div key={catIndex}>
                  <div className="flex items-center gap-2 mb-3">
                    <category.icon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-lg text-gray-900">{category.category}</h3>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, qIndex) => (
                      <AccordionItem key={qIndex} value={`item-${catIndex}-${qIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support Form */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>Send us a message and we'll get back to you</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What do you need help with?"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  className="mt-2 min-h-[150px]"
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 justify-start">
                <FileText className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Rider Guide</p>
                  <p className="text-xs text-gray-600">Complete guide for riders</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start">
                <Settings className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Safety Tips</p>
                  <p className="text-xs text-gray-600">Stay safe while delivering</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
