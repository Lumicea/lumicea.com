import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, RotateCcw, PackageCheck, MapPin, Globe } from 'lucide-react';

const deliveryMethods = [
  {
    name: 'Standard Shipping',
    price: 'Free on orders over £50',
    time: '3-5 business days',
    details: 'Standard Royal Mail service for UK addresses',
    icon: Truck,
    highlight: false,
  },
  {
    name: 'Express Shipping',
    price: '£4.99',
    time: '1-2 business days',
    details: '24-hour tracked service via DPD',
    icon: Clock,
    highlight: true,
  },
  {
    name: 'International Shipping',
    price: 'From £9.99',
    time: '5-10 business days',
    details: 'Available to most countries worldwide',
    icon: Globe,
    highlight: false,
  },
];

export function ShippingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Truck className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shipping & Returns
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Everything you need to know about our shipping options and return policy.
            </p>
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Delivery Options
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose the shipping method that best suits your needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {deliveryMethods.map((method, index) => (
                <Card key={index} className={`${method.highlight ? 'border-lumicea-navy shadow-xl' : 'shadow-md'} transition-all duration-300 hover:shadow-xl h-full`}>
                  <CardHeader className={method.highlight ? 'bg-lumicea-navy/5' : undefined}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                        <method.icon className="h-6 w-6 text-lumicea-navy" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center">
                          {method.name}
                          {method.highlight && (
                            <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy">
                              Popular
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-semibold text-lumicea-navy">{method.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="font-semibold text-lumicea-navy">{method.time}</span>
                    </div>
                    <p className="text-gray-700 mt-3">{method.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Shipping Policy */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Shipping Policy
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our commitment to ensuring your items arrive safely and on time.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PackageCheck className="h-5 w-5 text-lumicea-navy" />
                    <span>Order Processing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Most orders are processed within 1-2 business days. Custom orders may take 
                    5-7 business days to process before shipping.
                  </p>
                  <p className="text-gray-700">
                    You'll receive a shipping confirmation email with tracking information once 
                    your order has been dispatched.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Order processing time is separate from delivery time 
                      and begins from the moment your order is confirmed.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-lumicea-navy" />
                    <span>Shipping Destinations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    We currently ship to the United Kingdom, European Union, United States, 
                    Canada, Australia, and New Zealand.
                  </p>
                  <p className="text-gray-700">
                    For other countries, please contact our customer service team to arrange 
                    shipping options.
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>International Customers:</strong> Please note that customs duties, 
                      taxes, and import fees are the responsibility of the recipient and are not 
                      included in our shipping prices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Returns Policy */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Returns & Exchanges
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We want you to be completely satisfied with your purchase.
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                      <RotateCcw className="h-6 w-6 text-lumicea-navy" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">30-Day Returns</h3>
                    <p className="text-gray-700">
                      We offer a 30-day return policy for all standard items. Items must be unused, 
                      unworn, and in their original packaging.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-lumicea-navy" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Free Return Shipping</h3>
                    <p className="text-gray-700">
                      Return shipping is free for UK customers. For international returns, 
                      shipping costs will be deducted from your refund.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-lumicea-navy" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Fast Processing</h3>
                    <p className="text-gray-700">
                      Returns are typically processed within 3-5 business days of receipt. 
                      Refunds are issued to your original payment method.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Exceptions</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-lumicea-gold mr-2">•</span>
                      <span>Custom-made or personalized items cannot be returned unless there is a manufacturing defect.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-lumicea-gold mr-2">•</span>
                      <span>Items marked as final sale or clearance are not eligible for return.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-lumicea-gold mr-2">•</span>
                      <span>Gift cards are non-refundable.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Initiate a Return</h3>
                  <ol className="space-y-4 text-gray-700">
                    <li className="flex items-start">
                      <span className="bg-lumicea-navy text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                      <div>
                        <p className="font-medium">Login to your account</p>
                        <p className="text-sm text-gray-600">Access your order history and select the order containing the item(s) you wish to return.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lumicea-navy text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                      <div>
                        <p className="font-medium">Complete the return form</p>
                        <p className="text-sm text-gray-600">Select the items you wish to return and provide a reason for your return.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lumicea-navy text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                      <div>
                        <p className="font-medium">Print your return label</p>
                        <p className="text-sm text-gray-600">Pack your item(s) securely and attach the return label to your package.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lumicea-navy text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                      <div>
                        <p className="font-medium">Drop off your package</p>
                        <p className="text-sm text-gray-600">Take your package to any Post Office or drop-off location.</p>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Our Customer Service Team</h4>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about your return or need assistance, our customer service team is here to help.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-lumicea-navy" />
                      <a href="mailto:returns@lumicea.com" className="text-lumicea-navy hover:underline">returns@lumicea.com</a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-lumicea-navy" />
                      <a href="tel:+441234567890" className="text-lumicea-navy hover:underline">+44 (0) 123 456 7890</a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default ShippingPage;