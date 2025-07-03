import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get in touch via email for general inquiries',
    contact: 'hello@lumicea.com',
    action: 'mailto:hello@lumicea.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak directly with our customer service team',
    contact: '+44 (0) 123 456 789',
    action: 'tel:+441234567890',
  },
  {
    icon: MapPin,
    title: 'Visit Our Studio',
    description: 'Book an appointment to see our workshop',
    contact: 'London, United Kingdom',
    action: '#',
  },
];

export function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch with our team for any questions or support.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600">
                Choose the best way to reach us
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-lumicea-navy text-white rounded-full mb-4">
                      <method.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {method.description}
                    </p>
                    <Button variant="outline" className="lumicea-button-secondary">
                      <a href={method.action}>
                        {method.contact}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="lumicea-container max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="Your first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Your last name" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+44 123 456 7890" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" placeholder="How can we help you?" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <textarea 
                        id="message" 
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <Button className="w-full lumicea-button-primary">
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Business Hours */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Business Hours
                </h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-lumicea-navy" />
                      <span>When We're Available</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-medium">Closed</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      We typically respond to emails within 24 hours during business days.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}