
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const BookTable = () => {
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    bookingTime: '',
    partySize: '',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const partySizes = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitBooking = async () => {
    if (!bookingData.customerName || !bookingData.customerEmail || 
        !bookingData.bookingDate || !bookingData.bookingTime || !bookingData.partySize) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if booking date is not in the past
    const bookingDateTime = new Date(`${bookingData.bookingDate}T${bookingData.bookingTime}`);
    if (bookingDateTime < new Date()) {
      toast({
        title: "Invalid date",
        description: "Please select a future date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_name: bookingData.customerName,
          customer_email: bookingData.customerEmail,
          customer_phone: bookingData.customerPhone || null,
          booking_date: bookingData.bookingDate,
          booking_time: bookingData.bookingTime,
          party_size: parseInt(bookingData.partySize),
          special_requests: bookingData.specialRequests || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: `Your table for ${bookingData.partySize} on ${bookingData.bookingDate} at ${bookingData.bookingTime} has been booked.`,
      });

      // Reset form
      setBookingData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        bookingDate: '',
        bookingTime: '',
        partySize: '',
        specialRequests: ''
      });

    } catch (error) {
      console.error('Error booking table:', error);
      toast({
        title: "Booking failed",
        description: "There was an error booking your table. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book a Table</h1>
          <p className="text-xl text-gray-600">Reserve your dining experience at Addis Kitchen</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Table Reservation</CardTitle>
              <CardDescription>
                Please provide your details to reserve a table. We'll confirm your booking shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={bookingData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={bookingData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={bookingData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bookingDate" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date *
                  </Label>
                  <Input
                    id="bookingDate"
                    type="date"
                    min={today}
                    value={bookingData.bookingDate}
                    onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bookingTime" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Time *
                  </Label>
                  <Select value={bookingData.bookingTime} onValueChange={(value) => handleInputChange('bookingTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="partySize" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Party Size *
                  </Label>
                  <Select value={bookingData.partySize} onValueChange={(value) => handleInputChange('partySize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="# of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {partySizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'guest' : 'guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requests, dietary restrictions, or occasions we should know about?"
                />
              </div>

              <Button
                onClick={handleSubmitBooking}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Booking Table...' : 'Book Table'}
              </Button>

              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Restaurant Hours:</strong></p>
                <p>Mon-Thu: 5:00 PM - 10:00 PM</p>
                <p>Fri-Sat: 5:00 PM - 11:00 PM</p>
                <p>Sunday: 5:00 PM - 9:00 PM</p>
                <p className="mt-4">
                  <strong>Note:</strong> All bookings are subject to availability. 
                  We'll contact you within 24 hours to confirm your reservation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
