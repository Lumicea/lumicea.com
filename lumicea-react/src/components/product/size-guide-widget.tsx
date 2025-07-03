import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Ruler, Info, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Quick reference data for the widget
const quickSizeReference = [
  { size: '6mm', inches: '15/64"', comfort: 'Snug', popular: false },
  { size: '7mm', inches: '9/32"', comfort: 'Standard', popular: true },
  { size: '8mm', inches: '5/16"', comfort: 'Comfortable', popular: true },
  { size: '9mm', inches: '23/64"', comfort: 'Roomy', popular: false },
  { size: '10mm', inches: '25/64"', comfort: 'Very Roomy', popular: false },
];

const gaugeReference = [
  { gauge: '22G', thickness: '0.6mm' },
  { gauge: '20G', thickness: '0.8mm' },
  { gauge: '18G', thickness: '1.0mm' },
  { gauge: '16G', thickness: '1.2mm' },
  { gauge: '14G', thickness: '1.6mm' },
];

export function SizeGuideWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compact Size Guide Access Button */}
      <div className="bg-gradient-to-r from-lumicea-navy/5 to-lumicea-gold/5 rounded-lg p-4 border border-lumicea-navy/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-lumicea-navy/10 rounded-full flex items-center justify-center">
              <Ruler className="h-5 w-5 text-lumicea-navy" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Need help with sizing?</h4>
              <p className="text-xs text-gray-600">Quick reference & full guide available</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Quick Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Ruler className="h-5 w-5 text-lumicea-navy" />
                    <span>Quick Size Reference</span>
                  </DialogTitle>
                  <DialogDescription>
                    Essential sizing information to help you choose the perfect fit
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Inside Diameter Quick Reference */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Inside Diameter Sizes</CardTitle>
                      <div className="flex items-start space-x-2 p-2 bg-amber-50 rounded-md">
                        <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          These measurements refer to the <strong>inside diameter</strong> - the space inside the jewelry piece.
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {quickSizeReference.map((size, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg border-2 transition-colors ${
                              size.popular 
                                ? 'border-lumicea-gold bg-lumicea-gold/5' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-lumicea-navy">{size.size}</span>
                              {size.popular && (
                                <Badge className="bg-lumicea-gold text-lumicea-navy text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>{size.inches}</p>
                              <p className="font-medium">{size.comfort} fit</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gauge Quick Reference */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Gauge (Thickness) Reference</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {gaugeReference.map((gauge, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="font-semibold text-lumicea-navy">{gauge.gauge}</div>
                            <div className="text-sm text-gray-600">{gauge.thickness}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Higher gauge numbers = thinner jewelry. Most nose piercings start at 20G or 18G.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Quick Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Sizing Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">First Time Buyers</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Start with 7mm or 8mm diameter</li>
                            <li>• Choose 20G or 18G thickness</li>
                            <li>• Consider your nose size and shape</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">Existing Jewelry</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Measure inside diameter of current jewelry</li>
                            <li>• Check gauge with your piercer</li>
                            <li>• Consider comfort vs. style preferences</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button asChild className="lumicea-button-primary flex-1">
                      <Link to="/size-guide">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Complete Size Guide
                      </Link>
                    </Button>
                    <Button variant="outline" className="lumicea-button-secondary flex-1">
                      Contact for Sizing Help
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/size-guide">
                <ExternalLink className="h-3 w-3 mr-1" />
                Full Guide
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}