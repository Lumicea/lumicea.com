import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <div className="lumicea-container py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Order Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Thank you for your order!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been confirmed and will be processed shortly.
              </p>
              <Button className="lumicea-button-primary" as={Link} to="/">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}