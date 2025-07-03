import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Gem, ArrowLeft, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gem className="h-12 w-12 text-lumicea-gold" />
            </div>
            <h1 className="text-7xl font-bold mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-lg text-blue-100 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-lumicea-navy hover:bg-gray-100">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/categories/nose-rings">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/categories/nose-rings" className="text-blue-100 hover:text-lumicea-gold transition-colors">
                Nose Rings
              </Link>
              <Link to="/categories/earrings" className="text-blue-100 hover:text-lumicea-gold transition-colors">
                Earrings
              </Link>
              <Link to="/collections" className="text-blue-100 hover:text-lumicea-gold transition-colors">
                Collections
              </Link>
              <Link to="/custom" className="text-blue-100 hover:text-lumicea-gold transition-colors">
                Custom Designs
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-sm text-blue-100/70">
        <p>© {new Date().getFullYear()} Lumicea. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default NotFoundPage;