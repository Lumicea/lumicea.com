import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, Droplets, Info } from 'lucide-react';

const materialCareGuides = [
  {
    material: 'Sterling Silver & Argentium Silver',
    instructions: [
      'Clean with a soft, lint-free cloth to remove tarnish and restore shine',
      'For deeper cleaning, use a silver polishing cloth or mild silver cleaner',
      'Store in an airtight container or anti-tarnish bag when not wearing',
      'Remove before swimming, bathing, or exposure to chemicals like perfume or hairspray',
    ],
    tips: 'Regular wear actually helps prevent tarnishing as the natural oils in your skin keep the silver clean.',
    doNot: 'Never use toothpaste, baking soda, or other abrasive cleaners that can scratch the surface.',
  },
  {
    material: 'Gold & Rose Gold Filled',
    instructions: [
      'Clean with mild soap and warm water using a soft cloth',
      'Gently pat dry with a clean, soft cloth',
      'Store in a jewelry box or pouch to prevent scratches',
      'Remove before swimming in chlorinated pools or hot tubs',
    ],
    tips: 'Gold filled jewelry has a much thicker layer of gold than plated jewelry, making it more durable and tarnish-resistant.',
    doNot: 'Avoid ultrasonic cleaners which can damage the bond between the gold layer and base metal.',
  },
  {
    material: 'Titanium',
    instructions: [
      'Clean with mild soap and warm water',
      'Dry thoroughly after cleaning',
      'Polish with a soft cloth to maintain shine',
      'Safe to wear during most activities due to high corrosion resistance',
    ],
    tips: 'Titanium is hypoallergenic, lightweight, and extremely durable, making it perfect for everyday wear.',
    doNot: 'While very durable, avoid exposure to harsh chemicals that could potentially discolor the metal.',
  },
];

const gemstoneGuides = [
  {
    gemstone: 'Amethyst',
    hardness: '7',
    care: 'Avoid prolonged sunlight exposure and heat which can fade color. Clean with mild soap and lukewarm water.',
  },
  {
    gemstone: 'Moonstone',
    hardness: '6-6.5',
    care: 'Fairly soft, so avoid impacts. Clean with a damp cloth only. Never use ultrasonic cleaners.',
  },
  {
    gemstone: 'Turquoise',
    hardness: '5-6',
    care: 'Porous stone - avoid water, oils, and chemicals. Clean with a dry or slightly damp soft cloth only.',
  },
  {
    gemstone: 'Opal',
    hardness: '5.5-6.5',
    care: 'Contains water, so avoid heat and dry conditions. Clean with a soft damp cloth. Store with a small water source.',
  },
  {
    gemstone: 'Sapphire',
    hardness: '9',
    care: 'Very durable. Can be cleaned with mild soap and water or commercial jewelry cleaner.',
  },
];

export function CarePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Sparkles className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Jewelry Care Instructions
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Learn how to care for your Lumicea jewelry to keep it looking beautiful for years to come.
            </p>
          </div>
        </section>

        {/* General Care Guidelines */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                General Care Guidelines
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Following these simple practices will help maintain the beauty and longevity of your handcrafted jewelry.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-lumicea-navy text-white rounded-full mb-4">
                    <Droplets className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Wearing Your Jewelry
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>• Put your jewelry on last after applying cosmetics, perfume, and hairspray</p>
                    <p>• Remove jewelry before swimming, showering, or exercising</p>
                    <p>• Avoid contact with household chemicals or chlorinated water</p>
                    <p>• Remove jewelry before sleeping to prevent damage</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-lumicea-gold text-lumicea-navy rounded-full mb-4">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Cleaning Your Jewelry
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>• Clean regularly with a soft, lint-free cloth to remove oils and dirt</p>
                    <p>• For most pieces, use mild soap and warm water for deeper cleaning</p>
                    <p>• Gently pat dry with a clean cloth – never rub aggressively</p>
                    <p>• Always follow specific care instructions for your jewelry material</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-lumicea-navy text-white rounded-full mb-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Storing Your Jewelry
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>• Store pieces individually in the pouches provided with your purchase</p>
                    <p>• Keep in a cool, dry place away from direct sunlight</p>
                    <p>• Use anti-tarnish strips for silver jewelry</p>
                    <p>• Store delicate pieces flat to prevent bending or warping</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Material-Specific Care */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Material-Specific Care
            </h2>

            <div className="space-y-8">
              {materialCareGuides.map((guide, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-lumicea-navy/5 border-b">
                    <CardTitle>{guide.material}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-3">Care Instructions</h4>
                        <ul className="space-y-2">
                          {guide.instructions.map((instruction, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-lumicea-gold mr-2">•</span>
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-green-600" />
                            Helpful Tip
                          </h4>
                          <p className="text-sm text-green-700">{guide.tips}</p>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                            <Info className="h-4 w-4 mr-2 text-red-600" />
                            What to Avoid
                          </h4>
                          <p className="text-sm text-red-700">{guide.doNot}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gemstone Care */}
        <section className="py-16">
          <div className="lumicea-container">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Gemstone Care Guide
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-lumicea-navy text-white">
                    <th className="px-6 py-4 text-left">Gemstone</th>
                    <th className="px-6 py-4 text-left">Hardness (Mohs Scale)</th>
                    <th className="px-6 py-4 text-left">Care Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {gemstoneGuides.map((gemstone, index) => (
                    <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-lumicea-navy">{gemstone.gemstone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{gemstone.hardness}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{gemstone.care}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Understanding Gemstone Hardness</h3>
              <p className="text-blue-800 mb-3">
                The Mohs scale ranks mineral hardness from 1 (softest) to 10 (hardest). Higher hardness 
                means the stone is more resistant to scratches.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Soft Gemstones (1-6)</h4>
                  <p className="text-sm text-blue-800">
                    These stones require extra care. Avoid impacts, chemicals, and extreme temperature changes.
                    Examples include turquoise, opal, and moonstone.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Hard Gemstones (7-10)</h4>
                  <p className="text-sm text-blue-800">
                    These are more durable for everyday wear. Examples include sapphire (9), amethyst (7),
                    and diamond (10).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Cleaning */}
        <section className="py-16 bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light text-white">
          <div className="lumicea-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Professional Cleaning Service</h2>
              <p className="text-lg text-blue-100 mb-8">
                For pieces that need special attention or a refresh, we offer a professional cleaning 
                service to restore your Lumicea jewelry to its original brilliance.
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">How It Works</h3>
                <ol className="text-left space-y-4 text-blue-100">
                  <li className="flex items-start">
                    <span className="bg-lumicea-gold text-lumicea-navy rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <span>Contact our customer service team to arrange the return of your jewelry</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-lumicea-gold text-lumicea-navy rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    <span>Our artisans will professionally clean and inspect your pieces</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-lumicea-gold text-lumicea-navy rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <span>We'll return your refreshed jewelry within 7-10 business days</span>
                  </li>
                </ol>
                <p className="text-blue-100 mt-6">
                  This service is complimentary for purchases over £75 and carries a small fee for other items.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16">
          <div className="lumicea-container">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How often should I clean my jewelry?</h3>
                  <p className="text-gray-700">
                    For pieces you wear regularly, a gentle cleaning every 2-4 weeks helps maintain their beauty. 
                    Items worn occasionally may only need cleaning a few times a year.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I wear my jewelry while swimming?</h3>
                  <p className="text-gray-700">
                    We recommend removing all jewelry before swimming, especially in chlorinated pools or salt water, 
                    as these can damage metals and gemstones over time.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">My silver jewelry has tarnished. How can I clean it?</h3>
                  <p className="text-gray-700">
                    Use a silver polishing cloth for light tarnish. For heavier tarnish, soak in warm water with a 
                    mild dishwashing liquid, gently scrub with a soft toothbrush, rinse thoroughly and pat dry.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Is it normal for my skin to turn green?</h3>
                  <p className="text-gray-700">
                    This reaction occurs when copper in the metal oxidizes and reacts with the acids in your skin. 
                    It's not harmful but can be prevented by applying a clear nail polish barrier to the metal 
                    or choosing higher quality metals like our premium 940 Argentium Silver.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How should I pack my jewelry when traveling?</h3>
                  <p className="text-gray-700">
                    Store each piece separately in a soft pouch or wrapped in a soft cloth. For added protection, 
                    use a travel jewelry case with individual compartments to prevent tangling and scratching.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's covered under your lifetime warranty?</h3>
                  <p className="text-gray-700">
                    Our lifetime warranty covers manufacturing defects in materials and workmanship. It includes 
                    repairs for issues like broken clasps, loose settings, or structural integrity problems. 
                    Normal wear and tear, loss, or accidental damage are not covered.
                  </p>
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

export default CarePage;