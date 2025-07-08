import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Search, Plus, Minus, Mail, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const faqItems: FAQItem[] = [
  // Shopping & Ordering
  {
    question: "How do I know what size to order?",
    answer: (
      <div className="space-y-2">
        <p>Our detailed size guide provides measurements for all our jewelry items. For nose rings and earrings, we recommend:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Measuring any existing jewelry you find comfortable</li>
          <li>Considering your anatomy and personal preference</li>
          <li>When in doubt, choose the standard size (7mm for nose rings, 8mm for hoops)</li>
        </ul>
        <p>Visit our <a href="/size-guide" className="text-lumicea-navy hover:underline">size guide</a> for comprehensive information.</p>
      </div>
    ),
    category: "Shopping & Ordering"
  },
  {
    question: "Can I modify or cancel my order after placing it?",
    answer: (
      <p>
        You can modify or cancel your order within 2 hours of placing it by contacting our customer service team. 
        Once your order enters the processing stage, we cannot guarantee changes or cancellations as our artisans begin 
        crafting your pieces immediately.
      </p>
    ),
    category: "Shopping & Ordering"
  },
  {
    question: "Do you offer gift wrapping?",
    answer: (
      <p>
        Yes! All our jewelry comes in our signature Lumicea gift box at no additional charge. 
        During checkout, you can add a personalized gift message which will be printed on a card and 
        included with your order.
      </p>
    ),
    category: "Shopping & Ordering"
  },
  
  // Materials & Care
  {
    question: "What metals do you use in your jewelry?",
    answer: (
      <div className="space-y-2">
        <p>We use high-quality metals that are hypoallergenic and safe for sensitive skin:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>940 Argentium Silver</strong>: A premium silver alloy with superior tarnish resistance</li>
          <li><strong>14k Gold Filled</strong>: A thick layer of gold bonded to a brass core</li>
          <li><strong>14k Rose Gold Filled</strong>: Same durability as gold filled with a romantic pink hue</li>
          <li><strong>Titanium</strong>: Lightweight, hypoallergenic, and extremely durable</li>
        </ul>
        <p>All our metals are nickel-free and suitable for daily wear.</p>
      </div>
    ),
    category: "Materials & Care"
  },
  {
    question: "How should I care for my Lumicea jewelry?",
    answer: (
      <div className="space-y-2">
        <p>To keep your jewelry looking beautiful:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Remove before swimming, showering, or exercising</li>
          <li>Avoid contact with perfumes, lotions, and chemicals</li>
          <li>Clean gently with a soft cloth and mild soap</li>
          <li>Store in a cool, dry place (ideally in the pouch provided)</li>
        </ul>
        <p>Find detailed care instructions in our <a href="/care" className="text-lumicea-navy hover:underline">Care Guide</a>.</p>
      </div>
    ),
    category: "Materials & Care"
  },
  {
    question: "Will my silver jewelry tarnish?",
    answer: (
      <p>
        Our 940 Argentium Silver is more tarnish-resistant than standard sterling silver, but all silver 
        can tarnish over time. Regular wear actually helps prevent tarnishing due to the natural oils on your skin. 
        If tarnishing does occur, a gentle polish with a silver polishing cloth will quickly restore the shine.
      </p>
    ),
    category: "Materials & Care"
  },
  
  // Shipping & Delivery
  {
    question: "How long will it take to receive my order?",
    answer: (
      <div className="space-y-2">
        <p>Delivery times depend on your location and chosen shipping method:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>UK Standard</strong>: 3-5 business days</li>
          <li><strong>UK Express</strong>: 1-2 business days</li>
          <li><strong>International Standard</strong>: 5-10 business days</li>
          <li><strong>International Express</strong>: 3-5 business days</li>
        </ul>
        <p>Order processing takes 1-3 business days before shipping.</p>
      </div>
    ),
    category: "Shipping & Delivery"
  },
  {
    question: "Do you offer free shipping?",
    answer: (
      <p>
        Yes! We offer free standard shipping on all UK orders over £50. For international orders, 
        free shipping is available on orders over £100. Shipping fees for orders below these thresholds 
        are calculated at checkout based on weight and destination.
      </p>
    ),
    category: "Shipping & Delivery"
  },
  {
    question: "Can I track my order?",
    answer: (
      <p>
        Absolutely! Once your order is dispatched, you'll receive a shipping confirmation email 
        with your tracking number. You can also view the status of your order by logging into your 
        account and visiting the 'Order History' section.
      </p>
    ),
    category: "Shipping & Delivery"
  },
  
  // Returns & Refunds
  {
    question: "What is your return policy?",
    answer: (
      <p>
        We offer a 30-day return policy on most items. To be eligible for a return, your item must be 
        unused, unworn, and in the original packaging. Custom orders and personalized items cannot be 
        returned unless they arrive damaged or defective. Please visit our <a href="/shipping" className="text-lumicea-navy hover:underline">Shipping & Returns</a> page for full details.
      </p>
    ),
    category: "Returns & Refunds"
  },
  {
    question: "How do I initiate a return?",
    answer: (
      <div className="space-y-2">
        <p>To initiate a return:</p>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Log in to your account and go to 'Order History'</li>
          <li>Select the order containing the item(s) you wish to return</li>
          <li>Click 'Return Items' and follow the prompts</li>
          <li>Print your return label and return authorization form</li>
          <li>Pack your item(s) in the original packaging if possible</li>
          <li>Attach the return label and drop off at your nearest post office</li>
        </ol>
      </div>
    ),
    category: "Returns & Refunds"
  },
  {
    question: "How long will it take to process my refund?",
    answer: (
      <p>
        Once we receive your return, we'll inspect the item and process your refund within 3-5 business days. 
        The refund will be issued to your original payment method and may take an additional 5-10 business days 
        to appear, depending on your bank or credit card company.
      </p>
    ),
    category: "Returns & Refunds"
  },
  
  // Custom Orders
  {
    question: "Can I request a custom piece of jewelry?",
    answer: (
      <p>
        Yes! We love creating custom pieces. You can request a custom design through our <a href="/custom" className="text-lumicea-navy hover:underline">Custom Orders</a> page. 
        Our designers will work with you to create a unique piece that matches your vision, from initial sketches to the finished product.
      </p>
    ),
    category: "Custom Orders"
  },
  {
    question: "What information do I need to provide for a custom order?",
    answer: (
      <div className="space-y-2">
        <p>To help us create your perfect piece, please provide:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Type of jewelry you're interested in</li>
          <li>Preferred metals and gemstones</li>
          <li>Size requirements</li>
          <li>Design inspiration (images welcome)</li>
          <li>Budget range</li>
          <li>Timeframe (if for a special occasion)</li>
        </ul>
      </div>
    ),
    category: "Custom Orders"
  },
  {
    question: "How much do custom orders cost?",
    answer: (
      <p>
        Custom order pricing varies based on materials, complexity of design, and time required. 
        After receiving your request, we'll provide a detailed quote for approval before starting work. 
        A 50% deposit is required to begin the design process, with the remaining balance due before shipping.
      </p>
    ),
    category: "Custom Orders"
  },
];

// Unique categories from FAQ items
const categories = Array.from(new Set(faqItems.map(item => item.category)));

export function FAQPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  
  const toggleItem = (question: string) => {
    setExpandedItems(prev => 
      prev.includes(question) 
        ? prev.filter(item => item !== question) 
        : [...prev, question]
    );
  };
  
  // Filter FAQ items based on search query and active category
  const filteredItems = faqItems.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <HelpCircle className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find answers to common questions about our products, services, and policies.
            </p>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-12 bg-gray-50">
          <div className="lumicea-container">
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    &times;
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                <Badge
                  className={`cursor-pointer ${activeCategory === 'All' ? 'bg-lumicea-navy text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  onClick={() => setActiveCategory('All')}
                >
                  All Questions
                </Badge>
                {categories.map(category => (
                  <Badge
                    key={category}
                    className={`cursor-pointer ${activeCategory === category ? 'bg-lumicea-navy text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="lumicea-container max-w-3xl mx-auto">
            {filteredItems.length > 0 ? (
              <div className="space-y-6">
                {activeCategory !== 'All' && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {activeCategory}
                  </h2>
                )}
                
                {filteredItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <button
                      className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                      onClick={() => toggleItem(item.question)}
                    >
                      <h3 className="font-semibold text-lg text-gray-900">{item.question}</h3>
                      {expandedItems.includes(item.question) ? (
                        <Minus className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedItems.includes(item.question) && (
                      <CardContent className="pt-2 pb-6">
                        <div className="text-gray-700">
                          {item.answer}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any questions matching your search criteria.
                </p>
                <Button onClick={() => {setSearchQuery(''); setActiveCategory('All');}}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Still Need Help Section */}
        <section className="py-16 bg-lumicea-gradient text-white">
          <div className="lumicea-container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Our customer service team is here to help with any questions not covered in our FAQ.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-lumicea-navy hover:bg-gray-100">
                <Mail className="h-5 w-5 mr-2" />
                Email Support
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageSquare className="h-5 w-5 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default FAQPage;
