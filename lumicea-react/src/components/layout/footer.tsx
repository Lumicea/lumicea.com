import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Gem,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Heart,
  Sparkles,
  Award,
  Shield,
  Clock,
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Nose Rings', href: '/categories/nose-rings' },
    { name: 'Earrings', href: '/categories/earrings' },
    { name: 'Collections', href: '/collections' },
    { name: 'Custom Orders', href: '/custom' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  support: [
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Care Instructions', href: '/care' },
    { name: 'Shipping & Returns', href: '/shipping' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

const trustIndicators = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Handcrafted excellence since 2018',
  },
  {
    icon: Shield,
    title: 'Lifetime Warranty',
    description: 'We stand behind our craftsmanship',
  },
  {
    icon: Clock,
    title: 'Fast Shipping',
    description: 'Free UK delivery on orders over £50',
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-lumicea-navy to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-lumicea-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lumicea-gold rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lumicea-gold rounded-full blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="lumicea-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-lumicea-gold to-lumicea-gold-light rounded-2xl mb-6">
              <Sparkles className="h-10 w-10 text-lumicea-navy" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 luxury-heading">
              Stay Connected with <span className="text-lumicea-gold">Lumicea</span>
            </h3>
            <p className="text-xl text-gray-300 mb-8 luxury-body">
              Be the first to know about new collections, exclusive offers, and jewelry care tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 transition-colors"
              />
              <Button className="lumicea-button-primary px-8">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="relative border-b border-white/10">
        <div className="lumicea-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-lumicea-gold/20 rounded-xl flex items-center justify-center group-hover:bg-lumicea-gold/30 transition-colors">
                  <indicator.icon className="h-6 w-6 text-lumicea-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{indicator.title}</h4>
                  <p className="text-sm text-gray-400">{indicator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative">
        <div className="lumicea-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-lumicea-gold rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-lumicea-gold to-lumicea-gold-light p-3 rounded-xl">
                    <Gem className="h-8 w-8 text-lumicea-navy" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">
                    Lumicea
                  </span>
                  <p className="text-sm text-lumicea-gold">Handcrafted Excellence</p>
                </div>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md luxury-body leading-relaxed">
                Crafting exquisite handmade beaded jewelry with passion and precision. 
                Each piece tells a story of artistry, quality, and individual expression.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 bg-lumicea-gold/20 rounded-lg flex items-center justify-center group-hover:bg-lumicea-gold/30 transition-colors">
                    <Mail className="h-4 w-4 text-lumicea-gold" />
                  </div>
                  <a href="mailto:hello@lumicea.com" className="hover:text-lumicea-gold transition-colors">
                    hello@lumicea.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 bg-lumicea-gold/20 rounded-lg flex items-center justify-center group-hover:bg-lumicea-gold/30 transition-colors">
                    <Phone className="h-4 w-4 text-lumicea-gold" />
                  </div>
                  <a href="tel:+44123456789" className="hover:text-lumicea-gold transition-colors">
                    +44 (0) 123 456 789
                  </a>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-lumicea-gold/20 rounded-lg flex items-center justify-center group-hover:bg-lumicea-gold/30 transition-colors">
                    <MapPin className="h-4 w-4 text-lumicea-gold" />
                  </div>
                  <span>London, United Kingdom</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-8">
                {[
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                ].map((social, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    size="icon" 
                    className="w-12 h-12 bg-white/10 hover:bg-lumicea-gold hover:text-lumicea-navy transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label}>
                      <social.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Shop</h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-lumicea-gold transition-colors text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-lumicea-gold transition-colors text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-lumicea-gold transition-colors text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-lumicea-gold transition-colors text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Bottom Footer */}
      <div className="relative">
        <div className="lumicea-container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} Lumicea. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-2">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
                <span>in the UK</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Crafted by artisans</span>
              <span>•</span>
              <span>Loved by customers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}