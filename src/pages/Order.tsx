
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Order = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Place Your Order</h1>
          <p className="text-xl text-gray-600">Choose your favorite dishes and we'll prepare them fresh</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Online Ordering</CardTitle>
            <CardDescription>Order functionality coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our online ordering system is currently under development. 
              Please call us at +1 (555) 123-4567 to place your order.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
