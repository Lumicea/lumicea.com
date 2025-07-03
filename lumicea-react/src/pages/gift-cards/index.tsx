import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Mail, Calendar, Heart, Star, Sparkles } from 'lucide-react';

const giftCardAmounts = [25, 50, 75, 100, 150, 200];

export function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientName, setRecipientName] = useState('Recipient Name');
  const [senderName, setSenderName] = useState('Your Name');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    senderEmail: '',
    message: '',
  });

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and ensure it's between 10 and 1000
    if ((!value || /^\d+$/.test(value)) && (!value || parseInt(value) <= 1000)) {
      setCustomAmount(value);
      if (value) {
        setSelectedAmount(parseInt(value));
      } else {
        setSelectedAmount(50); // Default back to £50 if custom amount is cleared
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update preview
    if (name === 'recipientName') {
      setRecipientName(value || 'Recipient Name');
    } else if (name === 'senderName') {
      setSenderName(value || 'Your Name');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the gift card data to the server
    alert(`Gift card purchase successful! A £${selectedAmount} gift card has been sent to ${formData.recipientEmail}.`);
    
    // Add to cart
    const cartItem = {
      id: `gift-card-${Date.now()}`,
      productId: 'gift-card',
      name: `Lumicea Gift Card - £${selectedAmount}`,
      price: selectedAmount,
      quantity: 1,
      image: 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=500',
      attributes: {
        type: 'Gift Card',
        recipientName: formData.recipientName,
        senderName: formData.senderName,
      }
    };
    
    // Use local storage to simulate cart
    const cart = JSON.parse(localStorage.getItem('lumicea-cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('lumicea-cart', JSON.stringify(cart));
  };

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
                      <div className="text-4xl font-bold mb-2">£{selectedAmount.toFixed(2)}</div>
                      <p className="text-blue-100">Gift Card Value</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-blue-100 mb-2">To: {recipientName}</p>
                      <p className="text-sm text-blue-100">From: {senderName}</p>
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
                    <form onSubmit={handleSubmit}>
                      {/* Amount Selection */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Select Amount *</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {giftCardAmounts.map((amount) => (
                            <Button
                              key={amount}
                              type="button"
                              variant={amount === selectedAmount && !customAmount ? "default" : "outline"}
                              className={`h-12 text-lg font-semibold ${
                                amount === selectedAmount && !customAmount
                                  ? 'bg-lumicea-navy text-white'
                                  : 'hover:bg-lumicea-navy hover:text-white'
                              }`}
                              onClick={() => handleAmountSelect(amount)}
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
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            min="10"
                            max="1000"
                          />
                          <span className="text-sm text-gray-500">(£10-£1000)</span>
                        </div>
                      </div>

                      {/* Recipient Information */}
                      <div className="space-y-4 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recipient Information</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="recipientName">Recipient Name *</Label>
                          <Input
                            id="recipientName"
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleInputChange}
                            placeholder="Who is this gift for?"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="recipientEmail">Recipient Email *</Label>
                          <Input
                            id="recipientEmail"
                            name="recipientEmail"
                            type="email"
                            value={formData.recipientEmail}
                            onChange={handleInputChange}
                            placeholder="recipient@email.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Sender Information */}
                      <div className="space-y-4 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="senderName">Your Name *</Label>
                          <Input
                            id="senderName"
                            name="senderName"
                            value={formData.senderName}
                            onChange={handleInputChange}
                            placeholder="Your name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="senderEmail">Your Email *</Label>
                          <Input
                            id="senderEmail"
                            name="senderEmail"
                            type="email"
                            value={formData.senderEmail}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Personal Message */}
                      <div className="space-y-2 mt-6">
                        <Label htmlFor="message">Personal Message (Optional)</Label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Add a personal message to make this gift extra special..."
                          rows={4}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <Button type="submit" className="w-full lumicea-button-primary text-lg py-3 mt-6">
                        <Gift className="h-5 w-5 mr-2" />
                        Purchase Gift Card - £{selectedAmount.toFixed(2)}
                      </Button>
                    </form>
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