import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gem, Heart, Award, Star, Sparkles, Calendar, Globe } from 'lucide-react';

const timelineEvents = [
  {
    year: '2018',
    title: 'The Beginning',
    description: 'Lumicea was born from a passion for artisanal jewelry making. Starting with just a small workbench and a handful of tools, our founder began crafting unique pieces for friends and family.',
    icon: Heart,
  },
  {
    year: '2019',
    title: 'First Collection Launch',
    description: 'After overwhelming positive feedback, we launched our first official collection, featuring 12 handcrafted nose rings and earrings that quickly gained popularity in local artisan markets.',
    icon: Star,
  },
  {
    year: '2020',
    title: 'Going Digital',
    description: 'Amid global challenges, we pivoted to focus on our online presence, reaching jewelry enthusiasts across the UK with our expanding collection of premium handcrafted pieces.',
    icon: Gem,
  },
  {
    year: '2021',
    title: 'Sustainability Commitment',
    description: 'We formalized our commitment to ethical sourcing and sustainable practices, ensuring all materials met our rigorous standards for both quality and environmental responsibility.',
    icon: Sparkles,
  },
  {
    year: '2022',
    title: 'International Expansion',
    description: 'Lumicea expanded to serve customers internationally, bringing our unique jewelry designs to discerning customers across Europe, North America, and beyond.',
    icon: Globe,
  },
  {
    year: '2023',
    title: 'Award-Winning Designs',
    description: 'Our Celestial Dreams collection received recognition for excellence in craftsmanship at the UK Artisan Jewelry Awards, establishing Lumicea as a leader in handcrafted jewelry.',
    icon: Award,
  },
  {
    year: 'Today',
    title: 'Continuing the Legacy',
    description: 'Today, Lumicea continues to grow while staying true to our founding principles: exceptional quality, personal service, and designs that help our customers express their unique style.',
    icon: Calendar,
  },
];

export function StoryPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Gem className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Story
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              From humble beginnings to a beloved jewelry brand. The journey of Lumicea.
            </p>
          </div>
        </section>
        
        {/* Founder's Message */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-lumicea-navy/10 text-lumicea-navy">Our Beginnings</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  A Note From Our Founder
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    "I've always been fascinated by the way jewelry can transform not just an outfit, but how we feel about ourselves. 
                    My journey began with a simple bead and a piece of wire, crafting small trinkets at my kitchen table."
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    "What started as a creative outlet during a challenging time in my life quickly became a passion. 
                    Each piece I created was infused with intention and care, and the joy I saw when someone wore my 
                    jewelry became the foundation of what Lumicea is today."
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    "Our name 'Lumicea' comes from 'lumen' (light) and 'cea' (of the earth) – representing our mission 
                    to create jewelry that brings light and beauty while respecting our planet and communities. 
                    Every piece we craft is a small work of art, designed to be worn and loved for generations."
                  </p>
                  <p className="text-right text-lg font-medium text-lumicea-navy mt-6">
                    — Sarah Mitchell, Founder
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Lumicea Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-lumicea-navy/5 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-lumicea-gold/5 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Timeline */}
        <section className="py-16 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#10105A_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>
          </div>
          <div className="lumicea-container relative">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-gold/10 text-lumicea-gold">Our Journey</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Lumicea Timeline
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From a small workshop to an international brand, follow our growth and evolution.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-lumicea-navy/10 z-0 hidden md:block"></div>
              
              {/* Timeline events */}
              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="relative z-10">
                    <div className={`flex flex-col md:flex-row items-center md:items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      {/* Year and Icon */}
                      <div className="mb-6 md:mb-0 md:mx-8 flex-shrink-0 text-center">
                        <div className="w-20 h-20 rounded-full bg-lumicea-navy text-white flex items-center justify-center mx-auto shadow-lg">
                          <event.icon className="h-8 w-8" />
                        </div>
                        <div className="mt-3 text-2xl font-bold text-lumicea-navy">{event.year}</div>
                      </div>
                      
                      {/* Content */}
                      <Card className={`w-full max-w-lg ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                          <p className="text-gray-700">{event.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Artisans */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-navy/10 text-lumicea-navy">The Craftsmanship</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Artisans
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Meet the skilled craftspeople who bring our designs to life with their exceptional talents.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((artisan) => (
                <Card key={artisan} className="overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={`https://images.pexels.com/photos/119153${artisan}/pexels-photo-119153${artisan}.jpeg?auto=compress&cs=tinysrgb&w=800`}
                      alt={`Artisan ${artisan}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-xl font-bold mb-1">Emma Thompson</h3>
                        <p className="text-sm text-gray-200">Master Jeweler • 8 years at Lumicea</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Artistry</h3>
                    <p className="text-gray-700">
                      Each piece passes through the hands of our skilled artisans who combine traditional 
                      techniques with innovative approaches to create jewelry that's both timeless and contemporary.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Vision for the Future */}
        <section className="py-16 bg-lumicea-gradient text-white">
          <div className="lumicea-container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-white/10 text-white border-white/20">Looking Forward</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Our Vision for the Future
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                As we continue to grow, our commitment to quality, sustainability, and artisanal craftsmanship 
                remains unwavering. We're excited to expand our collections, reach new customers globally, 
                and continue innovating while honoring traditional jewelry-making techniques.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-lg font-bold text-lumicea-gold mb-3">Sustainability</h3>
                  <p className="text-sm text-blue-100">
                    Expanding our commitment to ethical materials and eco-friendly practices.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-lg font-bold text-lumicea-gold mb-3">Innovation</h3>
                  <p className="text-sm text-blue-100">
                    Exploring new techniques while preserving traditional craftsmanship.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-lg font-bold text-lumicea-gold mb-3">Community</h3>
                  <p className="text-sm text-blue-100">
                    Building stronger connections with our customers and artisan partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default StoryPage;
