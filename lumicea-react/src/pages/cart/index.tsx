import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <ShoppingBag className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Cart
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your shopping cart is currently empty.
            </p>
          </div>
        </section>

        {/* Empty Cart */}
        <div className="lumicea-container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. 
              Explore our collections to find beautiful handcrafted jewelry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="lumicea-button-primary" as={Link} to="/categories/nose-rings">
                Browse Nose Rings
              </Button>
              <Button variant="outline" as={Link} to="/categories/earrings">
                Explore Earrings
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}