import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/ui/price-display';
import {
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Truck,
  Star,
  Clock,
  Award,
  Gem,
  Play,
  ChevronDown,
  CheckCircle,
  Users,
  Zap,
  Globe,
} from 'lucide-react';

// Product data
const featuredProducts = [
  {
    id: 1,
    name: 'Amethyst Luna Nose Ring',
    price: 45.00,
    originalPrice: null,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    badge: 'New',
    rating: 4.9,
    reviews: 127,
  },
  {
    id: 2,
    name: 'Rose Gold Celestial Hoops',
    price: 65.00,
    originalPrice: 85.00,
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=500',
    badge: 'Sale',
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: 'Opal Dreams Threader Earrings',
    price: 55.00,
    originalPrice: null,
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=500',
    badge: 'Bestseller',
    rating: 5.0,
    reviews: 203,
  },
  {
    id: 4,
    name: 'Vintage Brass Mandala Ring',
    price: 38.00,
    originalPrice: null,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    badge: null,
    rating: 4.7,
    reviews: 156,
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    text: 'Absolutely stunning quality! My nose ring arrived beautifully packaged and fits perfectly. The craftsmanship is exceptional.',
    location: 'London, UK',
    avatar: 'SM',
  },
  {
    id: 2,
    name: 'Emma L.',
    rating: 5,
    text: 'I\'ve been wearing Lumicea jewelry for over a year now. The pieces are durable, comfortable, and I always get compliments!',
    location: 'Manchester, UK',
    avatar: 'EL',
  },
  {
    id: 3,
    name: 'Jessica R.',
    rating: 5,
    text: 'The custom piece I ordered exceeded my expectations. The attention to detail and personal touch made it truly special.',
    location: 'Edinburgh, UK',
    avatar: 'JR',
  },
];

const features = [
  {
    icon: Gem,
    title: 'Handcrafted Excellence',
    description: 'Each piece is meticulously handcrafted by skilled artisans using premium materials.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Hypoallergenic Materials',
    description: 'Safe for sensitive skin with surgical steel, sterling silver, and gold options.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Truck,
    title: 'Free UK Shipping',
    description: 'Complimentary shipping on all orders over £50 within the United Kingdom.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Quick 1-3 business day processing for most items, with express options available.',
    gradient: 'from-orange-500 to-red-500',
  },
];

const collections = [
  {
    name: 'Celestial Dreams',
    description: 'Inspired by the night sky',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 24,
  },
  {
    name: 'Golden Hour',
    description: 'Warm tones and elegance',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 18,
  },
  {
    name: 'Mystic Amethyst',
    description: 'Deep purple sophistication',
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 32,
  },
];

const stats = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '50,000+', label: 'Pieces Crafted' },
  { number: '6+', label: 'Years of Excellence' },
  { number: '4.9/5', label: 'Customer Rating' },
];

// Component functions
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with improved overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-lumicea-navy/95 via-lumicea-navy/85 to-lumicea-navy/95" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-lumicea-gold rounded-full animate-pulse opacity-60" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-lumicea-gold rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-lumicea-gold rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-lumicea-gold rounded-full animate-pulse opacity-30" />
      </div>
      
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 pt-32">
        <div className="mb-8">
          <Badge className="bg-lumicea-gold/20 text-lumicea-gold border-lumicea-gold/30 backdrop-blur-sm text-lg px-8 py-3 rounded-full">
            <Sparkles className="h-5 w-5 mr-2" />
            Handcrafted with Love Since 2018
          </Badge>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-8">
          <span className="block mb-2">Exquisite</span>
          <span className="block bg-gradient-to-r from-white via-lumicea-gold to-white bg-clip-text text-transparent mb-2">
            Handmade
          </span>
          <span className="block">Jewelry</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed">
          Discover our unique collection of nose rings, earrings, and artisan jewelry crafted with precision, passion, and premium materials.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button size="lg" className="lumicea-button-primary text-lg px-12 py-4 group shadow-2xl">
            <Link to="/categories/nose-rings" className="flex items-center">
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 text-lg px-12 py-4 group shadow-xl"
          >
            <Link to="/about" className="flex items-center">
              <Play className="mr-3 h-5 w-5" />
              <span>Our Story</span>
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-lumicea-gold mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="lumicea-container relative">
        <div className="text-center mb-16">
          <Badge className="bg-lumicea-navy/10 text-lumicea-navy mb-4">
            Why Choose Lumicea
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Crafted for <span className="bg-gradient-to-r from-lumicea-navy to-lumicea-gold bg-clip-text text-transparent">Perfection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference that comes with true craftsmanship and attention to detail.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-lumicea-navy/5 to-lumicea-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 text-center h-full flex flex-col relative z-10">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} text-white rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 flex-grow leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="lumicea-container relative">
        <div className="text-center mb-16">
          <Badge className="bg-lumicea-gold/10 text-lumicea-gold mb-4">
            Signature Collections
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Curated <span className="text-lumicea-gold">Collections</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each collection tells a unique story through handcrafted artistry and thoughtful design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden border-0">
              <div className="relative overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-gray-200 mb-3">{collection.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-lumicea-gold text-lumicea-navy">
                      {collection.count} pieces
                    </Badge>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button as={Link} to="/collections" size="lg" className="lumicea-button-primary shadow-xl">
            View All Collections
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="lumicea-container">
        <div className="text-center mb-16">
          <Badge className="bg-lumicea-navy/10 text-lumicea-navy mb-4">
            Featured Masterpieces
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Handpicked <span className="bg-gradient-to-r from-lumicea-navy to-lumicea-gold bg-clip-text text-transparent">Favorites</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most beloved pieces that showcase exceptional craftsmanship and timeless design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <Badge 
                    className={`absolute top-4 left-4 ${
                      product.badge === 'Sale' 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : product.badge === 'New'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light'
                    } shadow-lg`}
                  >
                    {product.badge}
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3 group-hover:text-lumicea-navy transition-colors text-lg">
                  {product.name}
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-lumicea-gold fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <PriceDisplay 
                    price={product.price} 
                    originalPrice={product.originalPrice || undefined}
                    size="lg"
                    className="font-bold"
                  />
                  <Button size="sm" className="lumicea-button-primary px-6">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button size="lg" variant="outline" className="lumicea-button-secondary shadow-lg">
            <Link to="/categories/nose-rings" className="flex items-center">
              View All Products
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-lumicea-gold rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lumicea-gold rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="lumicea-container relative">
        <div className="text-center mb-16">
          <Badge className="bg-lumicea-gold/20 text-lumicea-gold mb-4">
            Customer Love
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our <span className="text-lumicea-gold">Customers Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers who love their Lumicea jewelry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white/10 backdrop-blur-md border-white/20 p-8 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-lumicea-gold fill-current"
                    />
                  ))}
                </div>
                <p className="text-white mb-6 italic text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-lumicea-gold text-lumicea-navy rounded-full flex items-center justify-center font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-lumicea-navy via-lumicea-navy-light to-lumicea-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="lumicea-container text-center relative">
        <Badge className="bg-lumicea-gold/20 text-lumicea-gold mb-6">
          Ready to Begin?
        </Badge>
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your
          <br />
          <span className="text-lumicea-gold">Perfect Piece</span>
        </h2>
        <p className="text-xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Explore our complete collection of handcrafted jewelry or create something uniquely yours with our custom design service.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-lumicea-navy hover:bg-gray-100 text-lg px-12 py-4 group shadow-2xl"
          >
            <Link to="/categories/nose-rings" className="flex items-center">
              <span className="relative z-10">Browse Collection</span>
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-lumicea-navy text-lg px-12 py-4 group shadow-xl"
          >
            <Link to="/custom" className="flex items-center">
              <Gem className="mr-3 h-5 w-5" />
              <span>Custom Design</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <CollectionsSection />
        <FeaturedProductsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}