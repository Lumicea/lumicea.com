import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-lumicea-navy text-white p-4 sm:p-6 shadow-lg animate-fade-in-up">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">We Value Your Privacy</h3>
          <p className="text-sm text-gray-300">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies. Read our{' '}
            <Link to="/legal/cookies" className="text-lumicea-gold hover:underline">
              Cookie Policy
            </Link>{' '}
            for more information.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={acceptNecessary}
          >
            Necessary Only
          </Button>
          <Button 
            className="bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light"
            onClick={acceptAll}
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}