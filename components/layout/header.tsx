'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Gem,
  Star,
  Sparkles,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { useCart } from '@/lib/cart';

const navigationItems = [
  {
    title: 'Nose Rings',
    href: '/categories/nose-rings',
    description: 'Elegant nose rings in various styles and materials',
    featured: true,
  },
  {
    title: 'Earrings',
    href: '/categories/earrings',
    description: 'Handcrafted earrings for every occasion',
    featured: true,
  },
  {
    title: 'Collections',
    href: '/collections',
    description: 'Curated collections of our finest pieces',
    featured: false,
  },
  {
    title: 'Custom Orders',
    href: '/custom',
    description: 'Bespoke jewelry made to your specifications',
    featured: false,
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Top Banner - Only show when not scrolled */}
      <div className={cn(
        'transition-all duration-500 overflow-hidden bg-gradient-to-r from-lumicea-navy via-lumicea-navy-light to-lumicea-navy text-white',
        isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'
      )}>
        <div className="lumicea-container py-3">
          <p className="text-center text-sm font-medium flex items-center justify-center gap-2 animate-fade-in-down">
            <Sparkles className="h-4 w-4 text-lumicea-gold animate-pulse" />
            Free UK shipping on orders over £50 • Lifetime warranty on all pieces
            <Sparkles className="h-4 w-4 text-lumicea-gold animate-pulse" />
          </p>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-500',
          isScrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50'
            : 'bg-transparent',
          // Ensure proper spacing from top when banner is hidden
          isScrolled ? 'mt-0' : 'mt-12'
        )}
      >
        <div className="lumicea-container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-lumicea-gold to-lumicea-gold-light rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Gem className="h-8 w-8 text-lumicea-gold" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-3xl font-bold transition-colors duration-300",
                  isScrolled ? "lumicea-text-gradient" : "text-white drop-shadow-lg"
                )}>
                  Lumicea
                </span>
                <span className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isScrolled ? "text-gray-600" : "text-white/90 drop-shadow-sm"
                )}>
                  Handcrafted Excellence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "text-base font-medium transition-colors duration-300 hover:text-lumicea-navy bg-transparent",
                      isScrolled ? "text-gray-700" : "text-white hover:text-lumicea-gold drop-shadow-sm"
                    )}>
                      Shop
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[500px] p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                            <ul className="space-y-3">
                              {navigationItems.map((item) => (
                                <ListItem
                                  key={item.title}
                                  title={item.title}
                                  href={item.href}
                                  featured={item.featured}
                                >
                                  {item.description}
                                </ListItem>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light rounded-xl p-6 text-white">
                            <h3 className="text-lg font-semibold mb-3">Featured Collection</h3>
                            <p className="text-sm text-blue-100 mb-4">
                              Discover our latest Celestial Dreams collection featuring moonstone and star motifs.
                            </p>
                            <Button size="sm" className="bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light">
                              Explore Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  {['About', 'Blog', 'Contact'].map((item) => (
                    <NavigationMenuItem key={item}>
                      <Link href={`/${item.toLowerCase()}`} legacyBehavior passHref>
                        <NavigationMenuLink className={cn(
                          "text-base font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10",
                          isScrolled 
                            ? "text-gray-700 hover:text-lumicea-navy hover:bg-lumicea-navy/5" 
                            : "text-white hover:text-lumicea-gold drop-shadow-sm"
                        )}>
                          {item}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-300 rounded-xl",
                  isScrolled 
                    ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10" 
                    : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                )}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Account Dropdown or Login Button */}
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "transition-colors duration-300 rounded-xl",
                          isScrolled 
                            ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10" 
                            : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                        )}
                      >
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.email}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            Welcome back!
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>My Account</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      {user.email === 'swyatt@lumicea.com' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="flex items-center">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="hidden sm:flex items-center space-x-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "transition-colors duration-300",
                        isScrolled 
                          ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10" 
                          : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                      )}
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        "transition-colors duration-300",
                        isScrolled 
                          ? "lumicea-button-primary" 
                          : "bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light shadow-lg"
                      )}
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )
              )}

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-300 rounded-xl",
                  isScrolled 
                    ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10" 
                    : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                )}
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>

              {/* Cart */}
              <CartDrawer>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative transition-colors duration-300 rounded-xl",
                    isScrolled 
                      ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10" 
                      : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                  )}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light animate-pulse"
                    >
                      {itemCount}
                    </Badge>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </CartDrawer>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "lg:hidden transition-colors duration-300 rounded-xl",
                      isScrolled 
                        ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10" 
                        : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                    )}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[350px] bg-white">
                  <SheetHeader className="text-left">
                    <SheetTitle className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light p-2 rounded-lg">
                        <Gem className="h-6 w-6 text-lumicea-gold" />
                      </div>
                      <div>
                        <span className="lumicea-text-gradient text-xl">Lumicea</span>
                        <p className="text-sm text-gray-600 font-normal">Handcrafted Excellence</p>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* Auth Section */}
                    {!loading && (
                      <div className="space-y-4">
                        {user ? (
                          <div className="p-4 bg-lumicea-navy/5 rounded-lg">
                            <p className="font-medium text-gray-900">Welcome back!</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex space-x-2 mt-3">
                              <Button asChild size="sm" variant="outline" className="flex-1">
                                <Link href="/account">Account</Link>
                              </Button>
                              <Button onClick={handleSignOut} size="sm" variant="outline" className="flex-1">
                                Sign Out
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button asChild className="flex-1 lumicea-button-secondary">
                              <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild className="flex-1 lumicea-button-primary">
                              <Link href="/signup">Sign Up</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group"
                        >
                          <div>
                            <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
                              {item.title}
                            </span>
                            {item.featured && (
                              <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
                                Popular
                              </Badge>
                            )}
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                      {['About', 'Blog', 'Contact'].map((item) => (
                        <Link
                          key={item}
                          href={`/${item.toLowerCase()}`}
                          className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string; featured?: boolean }
>(({ className, title, children, featured, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-lumicea-navy/5 hover:text-lumicea-navy focus:bg-lumicea-navy/5 focus:text-lumicea-navy group',
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2">
            <div className="text-base font-semibold leading-none">{title}</div>
            {featured && (
              <Star className="h-3 w-3 text-lumicea-gold fill-current" />
            )}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-gray-600">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
