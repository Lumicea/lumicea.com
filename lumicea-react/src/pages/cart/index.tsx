import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

export function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <ShoppingBag className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Cart
            </h1>
            {items.length === 0 ? (
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Your shopping cart is currently empty.
              </p>
            ) : (
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                You have {items.length} {items.length === 1 ? 'item' : 'items'} in your cart.
              </p>
            )}
          </div>
        </section>

        <div className="lumicea-container py-16">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. 
              Explore our collections to find beautiful handcrafted jewelry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="lumicea-button-primary" asChild>
                <Link to="/categories/nose-rings">
                Browse Nose Rings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/categories/earrings">
                  Explore Earrings
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Cart with items */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-start border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {Object.entries(item.attributes).map(([key, value]) => 
                        value && (
                          <p key={key} className="text-sm text-gray-600 capitalize">
                            {key}: {value}
                          </p>
                        )
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button 
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <Button asChild variant="outline">
                  <Link to="/categories/nose-rings">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-xs text-gray-500">
                      Free shipping on orders over £50
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button
                  className="w-full lumicea-button-primary"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>Secure checkout with SSL encryption</p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Items: {items.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}