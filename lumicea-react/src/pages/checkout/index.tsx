import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <div className="lumicea-container py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Checkout</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Checkout Coming Soon</h2>
              <p className="text-gray-600">
                Our secure checkout process is currently being developed.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}