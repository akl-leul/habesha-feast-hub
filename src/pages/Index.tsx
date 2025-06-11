
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Phone, Utensils, Heart, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Authentic Cuisine",
      description: "Traditional Ethiopian dishes made with authentic spices and techniques"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Family Recipes",
      description: "Passed down through generations, our recipes tell the story of Ethiopia"
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Coffee Ceremony",
      description: "Experience the traditional Ethiopian coffee ceremony"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing authentic Ethiopian food! The Doro Wot was incredible and the service was excellent."
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "Best Ethiopian restaurant in the city. The vegetarian combo is perfect for sharing."
    },
    {
      name: "Emma Davis",
      rating: 5,
      text: "The coffee ceremony was a beautiful experience. Highly recommend this place!"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white ">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="relative bg-cover bg-center bg-no-repeat min-h-[650px] flex items-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to Addis Kitchen
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Experience the authentic flavors of Ethiopia in the heart of the city
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/menu">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                    View Menu
                  </Button>
                </Link>
                <Link to="/book">
                  <Button size="lg" variant="outline" className="text-white border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                    Book Table
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Addis Kitchen?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes our Ethiopian restaurant special
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 text-orange-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Dishes
            </h2>
            <p className="text-xl text-gray-600">
              Taste the best of Ethiopian cuisine
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&q=80"
                  alt="Doro Wot"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Doro Wot
                  <Badge variant="destructive">Spicy</Badge>
                </CardTitle>
                <CardDescription>
                  Traditional Ethiopian chicken stew with berbere spice and hard-boiled eggs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">$18.99</div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=500&q=80"
                  alt="Vegetarian Combo"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Vegetarian Combo
                  <Badge variant="secondary">Vegetarian</Badge>
                </CardTitle>
                <CardDescription>
                  Assorted vegetarian dishes including lentils, collard greens, and split peas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">$15.99</div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
                  alt="Ethiopian Coffee"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Ethiopian Coffee</CardTitle>
                <CardDescription>
                  Traditionally roasted and brewed Ethiopian coffee served with popcorn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">$4.99</div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link to="/menu">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">
                123 Ethiopian Street<br />
                Cultural District<br />
                City, State 12345
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-gray-600">
                Mon-Thu: 11AM - 10PM<br />
                Fri-Sat: 11AM - 11PM<br />
                Sunday: 12PM - 9PM
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <p className="text-gray-600">
                Phone: +1 (555) 123-4567<br />
                Email: info@addiskitchen.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Ethiopian Cuisine?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your table today or place an order for pickup
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" variant="outline" className="text-orange-600 border-white bg-white hover:bg-gray-100">
                Book a Table
              </Button>
            </Link>
            <Link to="/order">
              <Button size="lg" className="bg-orange-700 hover:bg-orange-800 text-white">
                Order Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
