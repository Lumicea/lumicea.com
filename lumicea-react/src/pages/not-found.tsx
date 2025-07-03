import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Gem, Search, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="lumicea-container py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-lumicea-navy/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-lumicea-navy" />
            </div>
            
            <h1 className="text-6xl font-bold text-lumicea-navy mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Page Not Found</h2>
            
            <p className="text-xl text-gray-600 mb-8">
              We couldn't find the page you're looking for. It might have been moved, 
              deleted, or perhaps never existed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as={Link} to="/" className="lumicea-button-primary">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Homepage
              </Button>
              <Button as={Link} to="/categories/nose-rings" variant="outline" className="lumicea-button-secondary">
                <Gem className="mr-2 h-5 w-5" />
                Browse Collections
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}