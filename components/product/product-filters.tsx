'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Filter } from 'lucide-react';

const filterOptions = {
  materials: [
    { id: 'silver', name: '940 Argentium Silver', count: 45 },
    { id: 'gold-14k', name: '14k Gold Filled', count: 32 },
    { id: 'rose-gold', name: '14k Rose Gold Filled', count: 28 },
    { id: 'titanium', name: 'Titanium', count: 15 },
  ],
  gemstones: [
    { id: 'amethyst', name: 'Amethyst', count: 23 },
    { id: 'sapphire', name: 'Sapphire', count: 18 },
    { id: 'opal', name: 'Opal', count: 16 },
    { id: 'moonstone', name: 'Moonstone', count: 14 },
    { id: 'turquoise', name: 'Turquoise', count: 12 },
  ],
  sizes: [
    { id: '6mm', name: '6mm', count: 25 },
    { id: '7mm', name: '7mm', count: 35 },
    { id: '8mm', name: '8mm', count: 42 },
    { id: '9mm', name: '9mm', count: 18 },
    { id: '10mm', name: '10mm', count: 12 },
  ],
  gauges: [
    { id: '20g', name: '20G', count: 28 },
    { id: '18g', name: '18G', count: 45 },
    { id: '16g', name: '16G', count: 38 },
    { id: '14g', name: '14G', count: 22 },
    { id: '12g', name: '12G', count: 15 },
  ],
};

export function ProductFilters() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    materials: [],
    gemstones: [],
    sizes: [],
    gauges: [],
  });
  const [priceRange, setPriceRange] = useState([0, 200]);

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      materials: [],
      gemstones: [],
      sizes: [],
      gauges: [],
    });
    setPriceRange([0, 200]);
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).flat().length + (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFilterCount()}
            </Badge>
          )}
        </h3>
        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filterOptions.materials.map((material) => (
            <div key={material.id} className="flex items-center space-x-2">
              <Checkbox
                id={material.id}
                checked={selectedFilters.materials.includes(material.id)}
                onCheckedChange={(checked) => 
                  handleFilterChange('materials', material.id, checked as boolean)
                }
              />
              <label
                htmlFor={material.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {material.name}
              </label>
              <span className="text-xs text-gray-500">({material.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gemstones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gemstones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filterOptions.gemstones.map((gemstone) => (
            <div key={gemstone.id} className="flex items-center space-x-2">
              <Checkbox
                id={gemstone.id}
                checked={selectedFilters.gemstones.includes(gemstone.id)}
                onCheckedChange={(checked) => 
                  handleFilterChange('gemstones', gemstone.id, checked as boolean)
                }
              />
              <label
                htmlFor={gemstone.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {gemstone.name}
              </label>
              <span className="text-xs text-gray-500">({gemstone.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filterOptions.sizes.map((size) => (
            <div key={size.id} className="flex items-center space-x-2">
              <Checkbox
                id={size.id}
                checked={selectedFilters.sizes.includes(size.id)}
                onCheckedChange={(checked) => 
                  handleFilterChange('sizes', size.id, checked as boolean)
                }
              />
              <label
                htmlFor={size.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {size.name}
              </label>
              <span className="text-xs text-gray-500">({size.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gauges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gauges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filterOptions.gauges.map((gauge) => (
            <div key={gauge.id} className="flex items-center space-x-2">
              <Checkbox
                id={gauge.id}
                checked={selectedFilters.gauges.includes(gauge.id)}
                onCheckedChange={(checked) => 
                  handleFilterChange('gauges', gauge.id, checked as boolean)
                }
              />
              <label
                htmlFor={gauge.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {gauge.name}
              </label>
              <span className="text-xs text-gray-500">({gauge.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Apply Filters Button */}
      <Button className="w-full lumicea-button-primary">
        Apply Filters ({getActiveFilterCount()})
      </Button>
    </div>
  );
}