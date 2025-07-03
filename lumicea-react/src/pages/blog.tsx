import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Handcrafted Jewelry',
    excerpt: 'Discover the intricate process behind creating each unique piece of jewelry in our workshop.',
    author: 'Sarah Mitchell',
    date: '2024-01-15',
    category: 'Craftsmanship',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: 2,
    title: 'Caring for Your Precious Jewelry',
    excerpt: 'Essential tips and tricks to keep your handcrafted jewelry looking beautiful for years to come.',
    author: 'Emma Rodriguez',
    date: '2024-01-10',
    category: 'Care Guide',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: 3,
    title: 'Sustainable Jewelry Making',
    excerpt: 'Learn about our commitment to ethical sourcing and environmentally responsible practices.',
    author: 'James Thompson',
    date: '2024-01-05',
    category: 'Sustainability',
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
];

export function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Stories, insights, and inspiration from the world of handcrafted jewelry.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
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