'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay } from '@/components/ui/price-display';
import { CartItem, useCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

interface CartDrawerProps {
  children?: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, itemCount, subtotal, updateItemQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateItemQuantity(item.id, newQuantity);
    }
  };

  const shippingThreshold = 50;
  const qualifiesForFreeShipping = subtotal >= shippingThreshold;
  const amountToFreeShipping = shippingThreshold - subtotal;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-lumicea-gold text-lumicea-navy text-xs font-bold">
                {itemCount}
              </span>
            )}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="flex items-center justify-between">
          <div>
            <DrawerTitle className="text-xl">Your Cart</DrawerTitle>
            <DrawerDescription>
              {itemCount === 0 
                ? 'Your cart is empty' 
                : `${itemCount} item${itemCount === 1 ? '' : 's'} in your cart`}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="lumicea-button-primary">
              <Link href="/categories/nose-rings">
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 py-4 border-b">
                    {/* Product Image */}
                    <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      
                      {/* Attributes */}
                      <div className="mt-1 space-y-1">
                        {item.attributes.material && (
                          <p className="text-xs text-gray-500">
                            Material: {item.attributes.material}
                          </p>
                        )}
                        {item.attributes.gemstone && (
                          <p className="text-xs text-gray-500">
                            Gemstone: {item.attributes.gemstone}
                          </p>
                        )}
                        {item.attributes.size && (
                          <p className="text-xs text-gray-500">
                            Size: {item.attributes.size}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <PriceDisplay price={item.price} size="sm" />
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Free Shipping Progress */}
              {!qualifiesForFreeShipping && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Add <span className="font-semibold">{formatCurrency(amountToFreeShipping)}</span> more to qualify for free shipping
                    </p>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-gray-600">SSL encrypted payment</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">Fast Shipping</p>
                    <p className="text-gray-600">2-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
            
            <DrawerFooter className="border-t pt-4">
              {/* Cart Summary */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <PriceDisplay price={subtotal} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm text-gray-900">
                    {qualifiesForFreeShipping ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-900">Estimated Total</span>
                  <PriceDisplay price={subtotal} size="lg" />
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <Button asChild className="w-full lumicea-button-primary">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-gray-500 hover:text-red-600"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
