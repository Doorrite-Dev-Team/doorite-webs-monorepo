import { Button } from "@repo/ui/components/button";
import {
  MessageCircle,
  Phone,
} from "lucide-react";
import { order, orders } from "../../../../libs/contant";
import { formatTime } from '../../../../libs/helper';

interface OrderPageProps {
  params: { id: string };
}

const OrderPage = ({ params }: OrderPageProps) => {
  const id = params.id;
  const selectedOrder: order | undefined = orders.find((order) => order.id === id);

  if (!selectedOrder) {
    return <div>Order not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      <div className="p-4">
        {/* Estimated Delivery */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Estimated delivery
          </h2>
          <div className="text-3xl font-bold text-gray-900">
            {formatTime(selectedOrder.estimatedDelivery)}
          </div>
        </div>

        {/* Tracking Steps */}
        <div className="mb-8">
          <div className="space-y-6">
            {selectedOrder.tracking.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      step.completed
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {step.completed && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  {index < selectedOrder.tracking.length - 1 && (
                    <div
                      className={`w-0.5 h-8 mt-2 ${
                        step.completed ? "bg-primary" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{step.step}</div>
                  <div className="text-primary text-sm">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Details
          </h3>
          <div className="space-y-3">
            {selectedOrder.orderDetails.map((item, index) => (
              <div key={index}>
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-primary text-sm">x{item.quantity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delivery Address
          </h3>
          <p className="text-gray-700">{selectedOrder.deliveryAddress}</p>
        </div>

        {/* Support Buttons */}
        <div className="flex space-x-4 mb-8">
          <Button className="rounded-full flex items-center justify-center px-5 text-center w-50">
            <Phone className="w-4 h-4 mr-2" />
            Call Support
          </Button>
          <Button className="flex-1 rounded-full flex items-center justify-center px-5">
            <MessageCircle className="w-4 h-4 mr-2" />
            Live Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage