"use client"

import { imageStudyCafe } from '@repo/ui/assets';
import { Button } from '@repo/ui/components/button';
import { Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type menuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function VendorDetails() {
  const [cart, setCart] = useState<menuItem[]>([]);

  const menuItems = {
    popular: [
      { id: 1, name: 'Cheeseburger', description: 'Classic burger with cheese', price: 7.99 },
      { id: 2, name: 'Chicken Sandwich', description: 'Crispy chicken sandwich', price: 8.49 },
      { id: 3, name: 'French Fries', description: 'Fries with dipping sauce', price: 3.99 }
    ],
    breakfast: [
      { id: 4, name: 'Breakfast Bagel', description: 'Egg and cheese on a bagel', price: 5.49 },
      { id: 5, name: 'Pancakes', description: 'Pancakes with syrup', price: 6.99 }
    ],
    lunch: [
      { id: 6, name: 'Chicken Salad', description: 'Grilled chicken salad', price: 9.99 },
      { id: 7, name: 'Veggie Wrap', description: 'Vegetarian wrap', price: 8.49 }
    ]
  };

  const reviews = [
    {
      id: 1,
      name: 'Liam',
      time: '2 weeks ago',
      rating: 5,
      comment: 'Great food and fast delivery!',
      likes: 10,
      dislikes: 2,
      avatar: '👨'
    },
    {
      id: 2,
      name: 'Chloe',
      time: '1 month ago',
      rating: 4,
      comment: 'Good value for money, but delivery was a bit late.',
      likes: 5,
      dislikes: 1,
      avatar: '👩'
    }
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 40 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 5 }
  ];

  const addToCart = (item: menuItem) => {
    setCart([...cart, item]);
    // Show feedback that item was added
    alert(`${item.name} added to cart!`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-primary/80 fill-primary/80' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderMenuItem = (item: menuItem) => (
    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
        <p className="text-primary text-sm">{item.description}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-gray-900">${item.price}</span>
        <Button
          onClick={() => addToCart(item)}
          className="rounded-full text-sm"
        >
          Add
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto min-h-screen mt-10">
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent">
          <Image
            src={imageStudyCafe}
            alt="Image Study Cafe"
            className='w-full h-full object-cover'
          />
        </div>
        <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
          THIS FRUITS & JUICE
        </div>
      </div>

      <div className="p-4">
        {/* Restaurant Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campus Eats</h2>
          <p className="text-gray-600">Fast food restaurant</p>
        </div>

        {/* Popular Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items</h3>
          <div className="space-y-1">
            {menuItems.popular.map(renderMenuItem)}
          </div>
        </div>

        {/* Breakfast */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Breakfast</h3>
          <div className="space-y-1">
            {menuItems.breakfast.map(renderMenuItem)}
          </div>
        </div>

        {/* Lunch */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lunch</h3>
          <div className="space-y-1">
            {menuItems.lunch.map(renderMenuItem)}
          </div>
        </div>

        {/* Ratings & Reviews */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings & Reviews</h3>
          
          {/* Overall Rating */}
          <div className="flex items-center mb-6">
            <div className="mr-6">
              <div className="text-4xl font-bold text-gray-900 mb-1">4.5</div>
              <div className="flex items-center mb-1">
                {renderStars(4)}
              </div>
              <div className="text-gray-600 text-sm">120 reviews</div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center mb-1">
                  <span className="text-sm text-gray-600 w-3">{rating.stars}</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${rating.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{rating.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{review.name}</h4>
                      <span className="text-primary text-sm">{review.time}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-primary text-sm">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-400 text-sm">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{review.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary (if items in cart) */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
            <div className="bg-primary text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{cart.length} item(s) in cart</span>
                <button className="bg-white text-primary px-4 py-2 rounded-full font-medium text-sm">
                  View Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}