"use client"

import { Button } from '@repo/ui/components/button';
import { ChevronRight, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function FoodDeliveryCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Spicy Chicken Sandwich', quantity: 1, price: 8.99 },
    { id: 2, name: 'Fries', quantity: 2, price: 3.98 },
    { id: 3, name: 'Coke', quantity: 1, price: 2.49 }
  ]);

  const [selectedPayment, setSelectedPayment] = useState('credit');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = 2.00;
  const taxes = 1.55;
  const total = subtotal + deliveryFee + taxes;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity, price: (item.price / item.quantity) * newQuantity }
          : item
      ));
    }
  };

  const paymentMethods = [
    { id: 'credit', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'campus', name: 'Campus Card', icon: CreditCard },
    { id: 'mobile', name: 'Mobile Payment', icon: CreditCard }
  ];

  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      <div className="p-4 space-y-6">
        {/* Items Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <div className="flex items-center mt-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="mx-3 text-primary font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h2>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Campus Address</div>
              <div className="text-primary text-sm">Dormitory A, Room 201</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  selectedPayment === method.id 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-7 rounded flex items-center justify-center mr-3 ${
                    selectedPayment === method.id ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <CreditCard className={`w-4 h-4 ${
                      selectedPayment === method.id ? 'text-primary' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className="font-medium text-gray-900">{method.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary">Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary">Delivery Fee</span>
              <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary">Taxes</span>
              <span className="font-semibold text-gray-900">${taxes.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between">
                <span className="text-primary font-medium">Total</span>
                <span className="font-bold text-gray-900 text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <Button 
          className="w-full "
          onClick={() => alert('Order placed successfully!')}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}