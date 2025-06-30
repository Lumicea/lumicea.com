import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Gem, Shield, Award, Clock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  subcategory: string;
  sku: string;
}

interface ProductInformationProps {
  product: Product;
}

export function ProductInformation({ product }: ProductInformationProps) {
  return (
    <div className="space-y-6">
      {/* Detailed Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gem className="h-5 w-5 text-lumicea-navy" />
            <span>Craftsmanship & Design</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Each {product.name} is meticulously handcrafted by our skilled artisans using traditional 
            techniques passed down through generations. The design draws inspiration from celestial 
            themes, creating a piece that's both timeless and contemporary.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            Our commitment to quality means every piece undergoes rigorous quality control checks 
            before reaching you. The smooth finish and precise detailing ensure comfortable wear 
            while maintaining the elegant aesthetic that defines the Lumicea brand.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Design Features</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Celestial-inspired motifs</li>
                <li>• Smooth, comfortable finish</li>
                <li>• Precision-set gemstones</li>
                <li>• Ergonomic design for daily wear</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Craftsmanship</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Hand-forged construction</li>
                <li>• Traditional metalworking techniques</li>
                <li>• Individual quality inspection</li>
                <li>• Artisan signature on packaging</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials & Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-lumicea-navy" />
            <span>Materials & Quality</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We source only the finest materials for our jewelry. Our default 940 Argentium Silver 
            offers superior tarnish resistance and hypoallergenic properties, making it perfect 
            for sensitive skin and daily wear.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Hypoallergenic</h4>
              <p className="text-sm text-gray-600">Safe for sensitive skin</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Premium Grade</h4>
              <p className="text-sm text-gray-600">Highest quality materials</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Gem className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Ethically Sourced</h4>
              <p className="text-sm text-gray-600">Responsible sourcing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sizing & Fit */}
      <Card>
        <CardHeader>
          <CardTitle>Sizing & Fit Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Proper sizing is crucial for comfort and appearance. Our nose rings are measured by 
            inner diameter, and we offer comprehensive sizing options to ensure the perfect fit.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Size (mm)</th>
                  <th className="text-left py-2">Size (inches)</th>
                  <th className="text-left py-2">Gauge</th>
                  <th className="text-left py-2">Best For</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b">
                  <td className="py-2">6mm</td>
                  <td className="py-2">0.236"</td>
                  <td className="py-2">20G</td>
                  <td className="py-2">Petite features, first piercing</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">7mm</td>
                  <td className="py-2">0.276"</td>
                  <td className="py-2">18G</td>
                  <td className="py-2">Most common size</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">8mm</td>
                  <td className="py-2">0.315"</td>
                  <td className="py-2">16G</td>
                  <td className="py-2">Standard comfort fit</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">9mm</td>
                  <td className="py-2">0.354"</td>
                  <td className="py-2">14G</td>
                  <td className="py-2">Larger features, statement piece</td>
                </tr>
                <tr>
                  <td className="py-2">10mm</td>
                  <td className="py-2">0.394"</td>
                  <td className="py-2">12G</td>
                  <td className="py-2">Bold, dramatic look</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Sizing Tip</h4>
            <p className="text-sm text-blue-800">
              If you're unsure about sizing, we recommend starting with 7mm or 8mm as these 
              are the most universally comfortable sizes. Our customer service team is always 
              available to help with sizing questions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Processing & Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-lumicea-navy" />
            <span>Processing & Shipping</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Processing Time</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• In-stock items: 1-2 business days</li>
                <li>• Custom variations: 2-3 business days</li>
                <li>• Special orders: 5-7 business days</li>
                <li>• Rush orders available upon request</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Shipping Options</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Standard UK delivery: 2-3 business days</li>
                <li>• Express delivery: Next business day</li>
                <li>• International shipping available</li>
                <li>• Free shipping on orders over £50</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Our Promise</h4>
            <p className="text-sm text-green-800">
              Every piece is carefully packaged in our signature jewelry box with care instructions 
              and a certificate of authenticity. We stand behind our craftsmanship with a lifetime 
              warranty on materials and construction.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}