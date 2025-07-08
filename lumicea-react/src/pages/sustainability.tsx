import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Recycle, PackageCheck, Users, Compass, Check, Gem, Hammer } from 'lucide-react';

const commitments = [
  {
    title: 'Ethical Sourcing',
    description: 'We carefully source all our materials from suppliers who share our commitment to ethical and sustainable practices.',
    icon: Compass,
    points: [
      'Traceable supply chain for metals and gemstones',
      'Regular audits of supplier practices and standards',
      'Partnership with responsible mining initiatives',
      'Support for artisanal miners with fair wages'
    ]
  },
  {
    title: 'Eco-Friendly Materials',
    description: 'Our jewelry is crafted using sustainable materials that minimize environmental impact without compromising on quality.',
    icon: Leaf,
    points: [
      'Recycled metals used whenever possible',
      'Lab-grown gemstone options for reduced mining impact',
      'Non-toxic materials safe for both wearer and environment',
      'Biodegradable alternatives for traditional packaging materials'
    ]
  },
  {
    title: 'Sustainable Packaging',
    description: 'From production to delivery, we ensure our packaging solutions are environmentally responsible and minimize waste.',
    icon: PackageCheck,
    points: [
      'Plastic-free packaging made from recycled materials',
      'Boxes and pouches designed for reuse',
      'Biodegradable shipping materials',
      'Digital receipts and documentation to reduce paper waste'
    ]
  },
  {
    title: 'Community Impact',
    description: 'We believe in giving back to communities and supporting initiatives that align with our values of sustainability and responsibility.',
    icon: Users,
    points: [
      'Jewelry making workshops for underserved communities',
      'Annual donations to environmental conservation efforts',
      'Apprenticeship programs for aspiring jewelers',
      'Partnerships with local artisans and small businesses'
    ]
  },
];

export function SustainabilityPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Leaf className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Commitment to Sustainability
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              At Lumicea, we believe beautiful jewelry should not come at the expense of our planet or communities.
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-800">Our Vision</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Crafting a Better Future
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Lumicea was founded on the principle that exquisite jewelry and environmental responsibility 
                    can go hand in hand. We're committed to minimizing our ecological footprint while maximizing 
                    our positive impact on communities.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Our sustainability journey is ongoing. We continuously evaluate our practices, seeking innovative 
                    ways to reduce waste, conserve resources, and support ethical labor practices throughout our 
                    supply chain.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We believe transparency is key to sustainability. That's why we openly share our practices, 
                    challenges, and progress as we work toward creating jewelry that not only looks beautiful 
                    but is made beautifully.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Sustainable Jewelry Making"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-green-500/5 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-lumicea-gold/5 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Commitments */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-navy/10 text-lumicea-navy">Our Commitments</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Sustainability Pillars
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our approach to sustainability is built on four key pillars that guide everything we do.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {commitments.map((commitment, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-lumicea-navy/10 rounded-lg flex items-center justify-center">
                        <commitment.icon className="h-6 w-6 text-lumicea-navy" />
                      </div>
                      <CardTitle>{commitment.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">{commitment.description}</p>
                    <ul className="space-y-3">
                      {commitment.points.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Product Lifecycle */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-gold/10 text-lumicea-gold">Circular Economy</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Lifecycle of Our Jewelry
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We consider the environmental impact of our products at every stage of their lifecycle.
              </p>
            </div>
            
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-lumicea-navy/10 transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {/* Stage 1: Design & Material Selection */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-lumicea-navy flex items-center justify-center text-white mb-4 shadow-lg">
                    <Gem className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Design & Materials</h3>
                    <p className="text-gray-600 text-sm">
                      Designs optimize material use and select responsibly sourced metals and gemstones.
                    </p>
                  </div>
                </div>
                
                {/* Stage 2: Production */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-lumicea-navy flex items-center justify-center text-white mb-4 shadow-lg">
                    <Hammer className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Production</h3>
                    <p className="text-gray-600 text-sm">
                      Handcrafted with energy-efficient processes and waste minimization practices.
                    </p>
                  </div>
                </div>
                
                {/* Stage 3: Packaging & Shipping */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-lumicea-navy flex items-center justify-center text-white mb-4 shadow-lg">
                    <PackageCheck className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Packaging & Shipping</h3>
                    <p className="text-gray-600 text-sm">
                      Eco-friendly packaging made from recycled and biodegradable materials.
                    </p>
                  </div>
                </div>
                
                {/* Stage 4: End of Life & Recycling */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-lumicea-navy flex items-center justify-center text-white mb-4 shadow-lg">
                    <Recycle className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Recycling Program</h3>
                    <p className="text-gray-600 text-sm">
                      Take-back program for old jewelry to be recycled into new pieces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 bg-green-50 rounded-lg p-8">
              <div className="flex items-start space-x-4">
                <Recycle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Recycling Program</h3>
                  <p className="text-gray-700 mb-4">
                    We invite customers to return their old Lumicea jewelry when they're ready for something new. 
                    In exchange, we offer a discount on your next purchase. Your returned pieces are carefully 
                    dismantled, and the materials are recycled into new creations, completing the circle.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-1">How It Works</h4>
                      <p className="text-sm text-gray-600">
                        Request a free recycling package, return your items, and receive a 15% discount code.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-1">Eligible Items</h4>
                      <p className="text-sm text-gray-600">
                        All Lumicea pieces plus any silver, gold, or gemstone jewelry from other brands.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-1">Environmental Impact</h4>
                      <p className="text-sm text-gray-600">
                        Recycling one ounce of gold prevents 20 tons of mine waste.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Certifications */}
        <section className="py-16 bg-lumicea-gradient text-white">
          <div className="lumicea-container text-center">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Recognized Excellence</Badge>
            <h2 className="text-3xl font-bold mb-8">
              Our Certifications & Partnerships
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((cert) => (
                <div key={cert} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-lumicea-navy" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Responsible Jewelry Council</h3>
                  <p className="text-sm text-blue-100">Certified Member Since 2020</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Progress & Goals */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-navy/10 text-lumicea-navy">Looking Forward</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Sustainability Goals
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're committed to continuous improvement in our sustainability journey. Here are some of the goals we're working toward.
              </p>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Carbon Neutral by 2025</h3>
                      <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                    </div>
                    <div className="md:w-3/4">
                      <p className="text-gray-700 mb-4">
                        We're working to offset our carbon emissions through renewable energy investments 
                        and carbon capture projects, with the goal of becoming completely carbon neutral by 2025.
                      </p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>65% Complete</span>
                        <span>Target: 2025</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">100% Recycled Metals</h3>
                      <Badge className="bg-green-100 text-green-800">Achieved</Badge>
                    </div>
                    <div className="md:w-3/4">
                      <p className="text-gray-700 mb-4">
                        We've successfully transitioned to using 100% recycled silver and gold in our jewelry 
                        production, reducing the environmental impact of mining while maintaining our high quality standards.
                      </p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>100% Complete</span>
                        <span>Achieved in 2023</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Zero Waste Packaging</h3>
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    </div>
                    <div className="md:w-3/4">
                      <p className="text-gray-700 mb-4">
                        We're redesigning all our packaging to be plastic-free, compostable, and made from 
                        recycled materials, with the goal of achieving zero waste packaging across our entire product line.
                      </p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>80% Complete</span>
                        <span>Target: 2024</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default SustainabilityPage;
