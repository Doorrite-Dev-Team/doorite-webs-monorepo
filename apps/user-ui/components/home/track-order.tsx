import { formatTime } from "@/libs/helper";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge, Clock, MapPin, Navigation, Phone, Truck } from "lucide-react";

// Track your order small component
export function TrackYourOrder({ order }: { order: Order }) {
  return (
    <div className="px-6 py-6 bg-white">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Track Your Order</h2>

      <Card className="border-0 shadow-sm mb-4 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 h-52 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-100/30 to-transparent"></div>

          <div className="absolute top-8 left-6 flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-lg"></div>
            <span className="text-xs font-medium text-blue-800 bg-white/90 px-2 py-1 rounded-full shadow">
              Restaurant
            </span>
          </div>

          <div className="absolute bottom-16 right-8 flex items-center space-x-2">
            <span className="text-xs font-medium text-blue-800 bg-white/90 px-2 py-1 rounded-full shadow">
              Your Location
            </span>
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-blue-600 rounded-full animate-bounce shadow-lg flex items-center justify-center">
              <Truck size={12} className="text-white" />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <Navigation size={16} className="text-blue-600" />
                <span className="font-medium text-blue-800">San Francisco</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-6 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Truck size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Out for Delivery</h3>
                <p className="text-sm text-primary/70">Driver is on the way</p>
              </div>
            </div>
            <Badge className="bg-primary text-white">Order #{order.id}</Badge>
          </div>

          <div className="w-full bg-primary/20 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full w-4/5 animate-pulse"></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-primary">
              <Clock size={16} />
              <span className="font-medium">
                ETA: {formatTime(order.estimatedDelivery ?? "N/A")}
              </span>
            </div>
            <div className="text-primary/70">Progress</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-12 border-2 border-gray-200 hover:border-primary hover:text-primary transition-colors"
        >
          <MapPin size={18} className="mr-2" />
          Update Location
        </Button>
        <Button className="h-12 bg-primary hover:bg-primary/90 shadow-md">
          <Phone size={18} className="mr-2" />
          Contact Driver
        </Button>
      </div>
    </div>
  );
}
