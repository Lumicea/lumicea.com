import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Moon, Sun, Star } from 'lucide-react';

const collections = [
  {
    id: 'celestial-dreams',
    name: 'Celestial Dreams',
    description: 'Inspired by the night sky, featuring moonstone, star motifs, and ethereal designs.',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 24,
    icon: Moon,
    featured: true,
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm gold tones and amber gemstones that capture the magic of sunset.',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 18,
    icon: Sun,
    featured: false,
  },
  {
    id: 'mystic-amethyst',
    name: 'Mystic Amethyst',
    description: 'Deep purple amethyst pieces that promote clarity and spiritual growth.',
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 32,
    icon: Sparkles,
    featured: true,
  },
  {
    id: 'vintage-elegance',
    name: 'Vintage Elegance',
    description: 'Timeless designs with antique finishes and classic gemstone settings.',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 15,
    icon: Star,
    featured: false,
  },
];

export function CollectionsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Collections
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover curated collections that tell a story through handcrafted jewelry, each piece designed with intention and artistry.
            </p>
          </div>
        </section>

        {/* Collections Grid */}
        <div className="lumicea-container pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Card key={collection.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  
                  {collection.featured && (
                    <Badge className="absolute top-4 left-4 bg-lumicea-gold text-lumicea-navy">
                      Featured
                    </Badge>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <collection.icon className="h-16 w-16 text-white opacity-80" />
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">{collection.name}</span>
                    <Badge variant="outline">{collection.productCount} pieces</Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <Button className="w-full lumicea-button-primary">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}