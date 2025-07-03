import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Mail, Calendar, Heart, Star, Sparkles } from 'lucide-react';

const giftCardAmounts = [25, 50, 75, 100, 150, 200];

export function GiftCardsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Gift className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Digital Gift Cards
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Give the gift of handcrafted beauty. Perfect for any occasion, delivered instantly.
            </p>
          </div>
        </section>

        {/* Gift Card Purchase */}
        <section className="py-16">
          <div className="lumicea-container max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Gift Card Preview */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Digital Gift Card
                </h2>
                
                <Card className="relative overflow-hidden bg-lumicea-gradient text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <Sparkles className="h-full w-full" />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-6 w-6 text-lumicea-gold" />
                        <span className="text-lg font-semibold">Lumicea</span>
                      </div>
                      <Badge className="bg-lumicea-gold text-lumicea-navy">
                        Gift Card
                      </Badge>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold mb-2">£50.00</div>
                      <p className="text-blue-100">Gift Card Value</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-blue-100 mb-2">To: Recipient Name</p>
                      <p className="text-sm text-blue-100">From: Your Name</p>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-xs text-blue-100 text-center">
                        Valid for 12 months from purchase date
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-lumicea-navy" />
                    <span className="text-gray-700">Delivered instantly via email</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-lumicea-navy" />
                    <span className="text-gray-700">Valid for 12 months</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-lumicea-navy" />
                    <span className="text-gray-700">Perfect for any occasion</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-lumicea-navy" />
                    <span className="text-gray-700">No additional processing fees</span>
                  </div>
                </div>
              </div>

              {/* Purchase Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Purchase Gift Card
                </h2>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    {/* Amount Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Select Amount *</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {giftCardAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            className="h-12 text-lg font-semibold hover:bg-lumicea-navy hover:text-white"
                          >
                            £{amount}
                          </Button>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="custom-amount" className="text-sm">Custom Amount:</Label>
                        <Input
                          id="custom-amount"
                          placeholder="£"
                          className="w-24"
                        />
                      </div>
                    </div>

                    {/* Recipient Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recipient Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipient-name">Recipient Name *</Label>
                        <Input id="recipient-name" placeholder="Who is this gift for?" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipient-email">Recipient Email *</Label>
                        <Input id="recipient-email" type="email" placeholder="recipient@email.com" />
                      </div>
                    </div>

                    {/* Sender Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sender-name">Your Name *</Label>
                        <Input id="sender-name" placeholder="Your name" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sender-email">Your Email *</Label>
                        <Input id="sender-email" type="email" placeholder="your@email.com" />
                      </div>
                    </div>

                    {/* Personal Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <textarea
                        id="message"
                        placeholder="Add a personal message to make this gift extra special..."
                        rows={4}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <Button className="w-full lumicea-button-primary text-lg py-3">
                      <Gift className="h-5 w-5 mr-2" />
                      Purchase Gift Card - £50.00
                    </Button>
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