import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, Users, Gem, Leaf, Shield } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Handcrafted with Love',
    description: 'Every piece is meticulously crafted by hand, ensuring unique character and exceptional quality.',
  },
  {
    icon: Gem,
    title: 'Premium Materials',
    description: 'We use only the finest metals and ethically sourced gemstones in all our creations.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Practices',
    description: 'Committed to environmentally responsible sourcing and sustainable jewelry making.',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Each piece comes with our lifetime warranty, reflecting our confidence in our craftsmanship.',
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Lumicea
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Crafting meaningful jewelry that celebrates individuality and artistry since 2018.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Lumicea was born from a passion for creating jewelry that tells a story. Founded in 2018, 
                    we began with a simple belief: that every piece of jewelry should be as unique as the 
                    person wearing it.
                  </p>
                  <p>
                    What started as a small workshop has grown into a beloved brand known for exceptional 
                    handcrafted beaded jewelry. Our artisans combine traditional techniques with contemporary 
                    design, creating pieces that are both timeless and modern.
                  </p>
                  <p>
                    Today, we're proud to serve customers across the UK and beyond, each piece carrying 
                    our commitment to quality, sustainability, and the celebration of individual expression.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Artisan crafting jewelry"
                  className="rounded-lg shadow-lg"
                />
                <Badge className="absolute top-4 left-4 bg-lumicea-gold text-lumicea-navy">
                  Handcrafted Since 2018
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do, from design to delivery.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-lumicea-navy text-white rounded-full mb-4">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}