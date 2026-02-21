"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Clock,
  Package,
  Star,
  ArrowUpRight
} from "lucide-react";

export default function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data - replace with actual API calls
  const earningsData = {
    today: 45.50,
    week: 312.75,
    month: 1248.90,
    total: 12450.00,
  };

  const recentDeliveries = [
    { id: "1", date: "Today, 2:30 PM", restaurant: "Pizza Palace", amount: 12.50, distance: "2.3 km" },
    { id: "2", date: "Today, 1:15 PM", restaurant: "Burger Bros", amount: 15.00, distance: "3.1 km" },
    { id: "3", date: "Today, 11:45 AM", restaurant: "Sushi Express", amount: 18.00, distance: "1.8 km" },
    { id: "4", date: "Yesterday, 6:20 PM", restaurant: "Taco Time", amount: 10.25, distance: "2.7 km" },
    { id: "5", date: "Yesterday, 4:50 PM", restaurant: "Coffee Corner", amount: 8.50, distance: "1.2 km" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600 mt-1">Track your income and performance</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${earningsData.today.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${earningsData.week.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${earningsData.month.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">All Time</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${earningsData.total.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Your delivery statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-gray-600">Total Deliveries</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">18 min</p>
                  <p className="text-sm text-gray-600">Avg. Delivery Time</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Your latest completed orders</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{delivery.restaurant}</p>
                      <p className="text-sm text-gray-600">{delivery.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {delivery.distance}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${delivery.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Information</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Next Payout</p>
                  <p className="text-sm text-gray-600">Friday, Feb 21, 2026</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  ${earningsData.week.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Available Balance</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Manage Payment Methods
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
