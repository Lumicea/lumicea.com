import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ruler, Info, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';

// General Piercing Thickness Guide - Gauge to MM conversion
const gaugeThicknessData = [
  { gauge: '22G', thickness: '0.6mm' },
  { gauge: '20G', thickness: '0.8mm' },
  { gauge: '18G', thickness: '1.0mm' },
  { gauge: '16G', thickness: '1.2mm' },
  { gauge: '14G', thickness: '1.6mm' },
];

// General Inside Diameter Guide
const insideDiameterData = [
  { 
    size: '6mm', 
    inches: '15/64"', 
    comfort: 'Snug', 
    bestFor: 'Petite features, first piercing, minimal look' 
  },
  { 
    size: '7mm', 
    inches: '9/32"', 
    comfort: 'Standard', 
    bestFor: 'Most common size, everyday wear' 
  },
  { 
    size: '8mm', 
    inches: '5/16"', 
    comfort: 'Comfortable', 
    bestFor: 'Standard comfort fit, versatile styling' 
  },
  { 
    size: '9mm', 
    inches: '23/64"', 
    comfort: 'Roomy', 
    bestFor: 'Larger features, statement piece' 
  },
  { 
    size: '10mm', 
    inches: '25/64"', 
    comfort: 'Very Roomy', 
    bestFor: 'Bold, dramatic look, maximum comfort' 
  },
  { 
    size: '12mm', 
    inches: '15/32"', 
    comfort: 'Extra Roomy', 
    bestFor: 'Large statement pieces, spacious fit' 
  },
];

const sizingTips = [
  {
    title: 'Measure Existing Jewelry',
    description: 'Use a ruler to measure the inner diameter of jewelry that fits you well.',
    icon: Ruler,
  },
  {
    title: 'Consider Your Anatomy',
    description: 'Nose shape and piercing placement affect the ideal size for comfort and appearance.',
    icon: Info,
  },
  {
    title: 'Start Conservative',
    description: 'If unsure, choose a smaller size first. You can always size up later.',
    icon: HelpCircle,
  },
  {
    title: 'Ask for Help',
    description: 'Our customer service team is always available to help with sizing questions.',
    icon: Sparkles,
  },
];

export function SizeGuidePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Ruler className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Size Guide
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive sizing guide for all jewelry types.
            </p>
          </div>
        </section>

        {/* Sizing Tips */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sizing Tips
              </h2>
              <p className="text-lg text-gray-600">
                Essential tips for finding your perfect fit
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sizingTips.map((tip, index) => (
                <Card key={index} className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-lumicea-navy text-white rounded-full mb-4">
                      <tip.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* General Piercing Thickness Guide */}
        <section className="py-16">
          <div className="lumicea-container">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <span>General Piercing Thickness Guide</span>
                </CardTitle>
                <p className="text-gray-600">
                  Understanding gauge measurements and their corresponding thickness in millimeters
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Gauge</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Thickness (MM)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gaugeThicknessData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 font-medium text-lumicea-navy text-lg">{item.gauge}</td>
                          <td className="py-4 px-6 text-gray-700 text-lg">{item.thickness}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">About Gauge Measurements</h4>
                      <p className="text-sm text-blue-800">
                        Gauge (G) refers to the thickness of the jewelry post or wire. The higher the gauge number, 
                        the thinner the jewelry. Our shop offers gauges from 22G (thinnest) to 14G (thickest).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* General Inside Diameter Guide */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <span>General Inside Diameter Guide</span>
                </CardTitle>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Inside diameter measurements for comfortable fit and styling
                  </p>
                  <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> These measurements refer to the <strong>inside diameter</strong> of the jewelry piece, 
                      not the outside. The outside diameter will be larger due to the thickness of the metal.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Size (MM)</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Size (Inches)</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Comfort Level</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insideDiameterData.map((size, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-lumicea-navy text-lg">{size.size}</td>
                          <td className="py-4 px-4 text-gray-700 text-lg">{size.inches}</td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant="outline" 
                              className={`${
                                size.comfort === 'Snug' 
                                  ? 'border-orange-500 text-orange-700'
                                  : size.comfort === 'Standard'
                                  ? 'border-blue-500 text-blue-700'
                                  : size.comfort === 'Comfortable'
                                  ? 'border-green-500 text-green-700'
                                  : size.comfort === 'Roomy'
                                  ? 'border-purple-500 text-purple-700'
                                  : size.comfort === 'Very Roomy'
                                  ? 'border-indigo-500 text-indigo-700'
                                  : 'border-pink-500 text-pink-700'
                              }`}
                            >
                              {size.comfort}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{size.bestFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our customer service team is here to help you find the perfect fit. 
                We're happy to answer any sizing questions you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="lumicea-button-primary">
                  Contact Customer Service
                </Button>
                <Button variant="outline" className="lumicea-button-secondary">
                  Live Chat Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}