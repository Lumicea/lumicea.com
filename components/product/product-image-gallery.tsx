'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Expand, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedIndex: number;
  onImageSelect: (index: number) => void;
}

export function ProductImageGallery({
  images,
  productName,
  selectedIndex,
  onImageSelect,
}: ProductImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const nextImage = () => {
    onImageSelect((selectedIndex + 1) % images.length);
  };

  const prevImage = () => {
    onImageSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={images[selectedIndex]}
            alt={`${productName} - View ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-white/80 hover:bg-white ${isInWishlist ? 'text-red-500' : 'text-gray-600'}`}
              onClick={() => setIsInWishlist(!isInWishlist)}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white text-gray-600"
                >
                  <Expand className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full">
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    {productName} - Enlarged Image View
                  </DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <img
                    src={images[selectedIndex]}
                    alt={`${productName} - Enlarged view`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <Badge className="absolute bottom-3 left-3 bg-black/60 text-white">
              {selectedIndex + 1} / {images.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-lumicea-navy'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-green-100 text-green-800">
          Handcrafted
        </Badge>
        <Badge className="bg-blue-100 text-blue-800">
          Hypoallergenic
        </Badge>
        <Badge className="bg-purple-100 text-purple-800">
          Premium Materials
        </Badge>
      </div>
    </div>
  );
}