
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BookTable = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book a Table</h1>
          <p className="text-xl text-gray-600">Reserve your perfect dining experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Table Reservations</CardTitle>
            <CardDescription>Booking system coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our table booking system is currently under development. 
              Please call us at +1 (555) 123-4567 to make a reservation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookTable;
