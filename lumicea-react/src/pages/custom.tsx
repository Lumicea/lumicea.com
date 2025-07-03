import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gem, Clock, Shield, Star, Palette, MessageCircle } from 'lucide-react';

const customizationSteps = [
  {
    step: 1,
    title: 'Share Your Vision',
    description: 'Tell us about your dream piece - style, materials, gemstones, and inspiration.',
    icon: Palette,
  },
  {
    step: 2,
    title: 'Design Consultation',
    description: 'Our artisans will create initial sketches and discuss options with you.',
    icon: MessageCircle,
  },
  {
    step: 3,
    title: 'Handcrafted Creation',
    description: 'Your unique piece is carefully handcrafted using premium materials.',
    icon: Gem,
  },
  {
    step: 4,
    title: 'Quality Assurance',
    description: 'Each piece undergoes rigorous quality checks before delivery.',
    icon: Shield,
  },
];

export function CustomPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Custom Jewelry Design
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Create a one-of-a-kind piece that tells your unique story. Our master artisans bring your vision to life.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How Custom Orders Work
              </h2>
              <p className="text-lg text-gray-600">
                From concept to creation, we guide you through every step
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {customizationSteps.map((step) => (
                <Card key={step.step} className="text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-lumicea-navy text-white rounded-full mb-4">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <Badge className="mb-3 bg-lumicea-gold text-lumicea-navy">
                      Step {step.step}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Order Form */}
        <section className="py-16">
          <div className="lumicea-container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Start Your Custom Design
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gem className="h-5 w-5 text-lumicea-navy" />
                  <span>Custom Design Request</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+44 123 456 7890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Input id="budget" placeholder="£100 - £500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jewelry-type">Type of Jewelry *</Label>
                  <Input id="jewelry-type" placeholder="e.g., Nose ring, Earrings, Necklace" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">Preferred Materials</Label>
                  <Input id="materials" placeholder="e.g., 14k Gold, Sterling Silver, Titanium" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gemstones">Gemstone Preferences</Label>
                  <Input id="gemstones" placeholder="e.g., Amethyst, Sapphire, Opal" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Design Description *</Label>
                  <textarea 
                    id="description" 
                    placeholder="Describe your vision in detail - style, inspiration, special meaning, size requirements, etc."
                    rows={6}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Desired Timeline</Label>
                  <Input id="timeline" placeholder="e.g., 2 weeks, 1 month, no rush" />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Timeline Information</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Custom pieces typically take 2-4 weeks to complete, depending on complexity. 
                        Rush orders may be available for an additional fee.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full lumicea-button-primary text-lg py-3">
                  Submit Custom Design Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Star className="h-12 w-12 text-lumicea-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Master Craftsmanship
                </h3>
                <p className="text-gray-600">
                  Over 15 years of experience creating bespoke jewelry pieces
                </p>
              </div>
              <div>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Lifetime Warranty
                </h3>
                <p className="text-gray-600">
                  All custom pieces come with our comprehensive lifetime warranty
                </p>
              </div>
              <div>
                <Gem className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Premium Materials
                </h3>
                <p className="text-gray-600">
                  Only the finest metals and ethically sourced gemstones
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}