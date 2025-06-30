'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay } from '@/components/ui/price-display';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Info,
  Sparkles,
  Shield,
  Clock,
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
} from 'lucide-react';

interface MaterialOption {
  id: string;
  name: string;
  priceAdjustment: number;
  description: string;
  properties: string[];
  image?: string;
}

interface GemstoneOption {
  id: string;
  name: string;
  priceAdjustment: number;
  description: string;
  meaning: string;
  properties: string[];
  image?: string;
  color: string;
}

interface SizeOption {
  id: string;
  name: string;
  diameter: number; // in mm
  gauge?: string;
  priceAdjustment: number;
}

interface ProductCustomizationProps {
  basePrice: number;
  productId: string;
  productName: string;
  onVariantChange?: (variant: any) => void;
  onPriceChange?: (price: number) => void;
  onImageChange?: (imageUrl: string) => void;
  onAddToCart?: () => void;
}

const materialOptions: MaterialOption[] = [
  {
    id: 'silver-940',
    name: '940 Argentium Silver',
    priceAdjustment: 0,
    description: 'Premium tarnish-resistant silver alloy with superior brightness and durability.',
    properties: ['Hypoallergenic', 'Tarnish Resistant', 'Durable', 'Bright Finish'],
  },
  {
    id: 'gold-14k',
    name: '14k Gold Filled',
    priceAdjustment: 25,
    description: 'Luxurious gold layer mechanically bonded to a brass core for lasting beauty.',
    properties: ['Long-lasting', 'Waterproof', 'Hypoallergenic', 'Premium Quality'],
  },
  {
    id: 'rose-gold-14k',
    name: '14k Rose Gold Filled',
    priceAdjustment: 28,
    description: 'Romantic rose gold with warm pink tones that complement all skin types.',
    properties: ['Trendy', 'Warm Tones', 'Hypoallergenic', 'Durable'],
  },
  {
    id: 'titanium',
    name: 'Titanium',
    priceAdjustment: 15,
    description: 'Ultra-lightweight and biocompatible metal perfect for sensitive skin.',
    properties: ['Lightweight', 'Biocompatible', 'Corrosion Resistant', 'Strong'],
  },
];

const gemstoneOptions: GemstoneOption[] = [
  {
    id: 'amethyst',
    name: 'Amethyst',
    priceAdjustment: 8,
    description: 'Beautiful purple quartz crystal known for its calming properties.',
    meaning: 'Promotes clarity, peace, and spiritual growth',
    properties: ['Calming', 'Spiritual', 'Protective'],
    color: '#9966CC',
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    priceAdjustment: 35,
    description: 'Precious gemstone symbolizing wisdom, virtue, and good fortune.',
    meaning: 'Represents wisdom, loyalty, and nobility',
    properties: ['Precious', 'Durable', 'Symbolic'],
    color: '#0F52BA',
  },
  {
    id: 'opal',
    name: 'Opal',
    priceAdjustment: 18,
    description: 'Mesmerizing stone with play-of-color that shifts with light.',
    meaning: 'Enhances creativity and emotional expression',
    properties: ['Unique', 'Color-changing', 'Creative'],
    color: '#FFFFFF',
  },
  {
    id: 'moonstone',
    name: 'Moonstone',
    priceAdjustment: 12,
    description: 'Ethereal stone with a mysterious blue sheen reminiscent of moonlight.',
    meaning: 'Promotes intuition and emotional balance',
    properties: ['Mystical', 'Balancing', 'Intuitive'],
    color: '#E6E6FA',
  },
  {
    id: 'turquoise',
    name: 'Turquoise',
    priceAdjustment: 10,
    description: 'Vibrant blue-green stone prized for its protective qualities.',
    meaning: 'Offers protection and promotes communication',
    properties: ['Protective', 'Healing', 'Communication'],
    color: '#40E0D0',
  },
];

const sizeOptions: SizeOption[] = [
  { id: 'size-6mm', name: '6mm', diameter: 6, gauge: '20G', priceAdjustment: 0 },
  { id: 'size-7mm', name: '7mm', diameter: 7, gauge: '18G', priceAdjustment: 2 },
  { id: 'size-8mm', name: '8mm', diameter: 8, gauge: '16G', priceAdjustment: 3 },
  { id: 'size-9mm', name: '9mm', diameter: 9, gauge: '14G', priceAdjustment: 5 },
  { id: 'size-10mm', name: '10mm', diameter: 10, gauge: '12G', priceAdjustment: 7 },
];

export function ProductCustomization({
  basePrice,
  productId,
  productName,
  onVariantChange,
  onPriceChange,
  onImageChange,
  onAddToCart,
}: ProductCustomizationProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(materialOptions[0]);
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(sizeOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [unitPreference, setUnitPreference] = useState<'metric' | 'imperial'>('metric');
  const [isInWishlist, setIsInWishlist] = useState(false);

  const calculateTotalPrice = () => {
    let total = basePrice;
    total += selectedMaterial.priceAdjustment;
    if (selectedGemstone) total += selectedGemstone.priceAdjustment;
    total += selectedSize.priceAdjustment;
    return total;
  };

  const formatSize = (size: SizeOption) => {
    if (unitPreference === 'metric') {
      return `${size.diameter}mm`;
    } else {
      const inches = (size.diameter / 25.4).toFixed(3);
      return `${inches}"`;
    }
  };

  const formatGauge = (size: SizeOption) => {
    if (unitPreference === 'metric') {
      return size.gauge ? `${size.gauge} (${size.diameter}mm)` : `${size.diameter}mm`;
    } else {
      const inches = (size.diameter / 25.4).toFixed(3);
      return size.gauge ? `${size.gauge} (${inches}")` : `${inches}"`;
    }
  };

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    onPriceChange?.(totalPrice);
    
    const variant = {
      material: selectedMaterial,
      gemstone: selectedGemstone,
      size: selectedSize,
      quantity,
      totalPrice,
    };
    onVariantChange?.(variant);
  }, [selectedMaterial, selectedGemstone, selectedSize, quantity]);

  const handleAddToCart = () => {
    onAddToCart?.();
  };

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    // This will be connected to wishlist state management
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Price Display */}
        <div className="flex items-center justify-between">
          <div>
            <PriceDisplay 
              price={calculateTotalPrice()} 
              originalPrice={calculateTotalPrice() !== basePrice ? basePrice : undefined}
              size="xl"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Clock className="h-3 w-3 mr-1" />
              1-3 business days
            </Badge>
          </div>
        </div>

        {/* Unit Preference Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Size units:</span>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setUnitPreference('metric')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                unitPreference === 'metric'
                  ? 'bg-white text-lumicea-navy shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              MM
            </button>
            <button
              onClick={() => setUnitPreference('imperial')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                unitPreference === 'imperial'
                  ? 'bg-white text-lumicea-navy shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inches
            </button>
          </div>
        </div>

        {/* Material Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Material</h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose the metal that best suits your style and skin sensitivity</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {materialOptions.map((material) => (
              <Card
                key={material.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedMaterial.id === material.id
                    ? 'ring-2 ring-lumicea-navy bg-lumicea-navy/5'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMaterial(material)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{material.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {material.properties.map((property) => (
                          <Badge key={property} variant="outline" className="text-xs">
                            {property}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      {material.priceAdjustment > 0 ? (
                        <PriceDisplay 
                          price={material.priceAdjustment} 
                          size="sm"
                          className="text-lumicea-navy"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">Included</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gemstone Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Gemstone</h3>
            <Badge variant="outline" className="text-xs">Optional</Badge>
            <Tooltip>
              <TooltipTrigger>
                <Sparkles className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a beautiful gemstone to personalize your piece</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                !selectedGemstone
                  ? 'ring-2 ring-lumicea-navy bg-lumicea-navy/5'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedGemstone(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">No Gemstone</h4>
                    <p className="text-sm text-gray-600">Classic metal finish</p>
                  </div>
                  <span className="text-sm text-gray-500">Included</span>
                </div>
              </CardContent>
            </Card>

            {gemstoneOptions.map((gemstone) => (
              <Card
                key={gemstone.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedGemstone?.id === gemstone.id
                    ? 'ring-2 ring-lumicea-navy bg-lumicea-navy/5'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedGemstone(gemstone)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-gray-300 mt-1"
                        style={{ backgroundColor: gemstone.color }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{gemstone.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{gemstone.description}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xs text-lumicea-navy mt-1 cursor-help">
                              {gemstone.meaning}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="max-w-xs">
                              <p className="font-medium">{gemstone.name} Properties:</p>
                              <ul className="list-disc list-inside mt-1">
                                {gemstone.properties.map((property) => (
                                  <li key={property} className="text-sm">{property}</li>
                                ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <PriceDisplay 
                      price={gemstone.priceAdjustment} 
                      size="sm"
                      className="text-lumicea-navy"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Size</h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Inner diameter measurement. See our sizing guide for help.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Select
            value={selectedSize.id}
            onValueChange={(value) => {
              const size = sizeOptions.find(s => s.id === value);
              if (size) setSelectedSize(size);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{formatSize(size)} ({formatGauge(size)})</span>
                    {size.priceAdjustment > 0 && (
                      <PriceDisplay 
                        price={size.priceAdjustment} 
                        size="sm"
                        className="text-lumicea-navy ml-2"
                      />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Quantity and Actions */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-900">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleAddToCart}
              className="flex-1 lumicea-button-primary text-lg py-3"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlistToggle}
              className={`px-4 ${isInWishlist ? 'text-red-500 border-red-500' : ''}`}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Hypoallergenic Materials</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 text-lumicea-gold" />
              <span className="text-sm text-gray-700">Handcrafted Quality</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-700">Fast Processing</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}