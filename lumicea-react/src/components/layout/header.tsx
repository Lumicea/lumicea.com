// lumicea-react/src/components/layout/header.tsx
'use client';

import { NavCategories } from './nav-categories.tsx';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Gem,
  Star,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

// Define props for the Header component
interface HeaderProps {
  showTopBanner?: boolean;
}

export function Header({ showTopBanner = true }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { user, userRole, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <div
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-500',
          isScrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50'
            : 'bg-transparent'
        )}
      >
        {showTopBanner && (
          <div
            className={cn(
              'transition-all duration-500 overflow-hidden bg-gradient-to-r from-lumicea-navy via-lumicea-navy-light to-lumicea-navy text-white',
              isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'
            )}
          >
            <div className="lumicea-container py-3">
              <p className="text-center text-sm font-medium flex items-center justify-center gap-2 animate-fade-in-down">
                <Sparkles className="h-4 w-4 text-lumicea-gold animate-pulse" />
                Free UK shipping on orders over £25
                <Sparkles className="h-4 w-4 text-lumicea-gold animate-pulse" />
              </p>
            </div>
          </div>
        )}

        <header>
          <div className="lumicea-container flex items-center justify-between h-20">
            <Link
              to="/"
              className="flex items-center space-x-2 md:space-x-3 group z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-lumicea-gold to-lumicea-gold-light rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Gem className="h-8 w-8 text-lumicea-gold" />
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-2xl md:text-3xl font-bold transition-colors duration-300',
                    isScrolled ? 'lumicea-text-gradient' : 'text-white drop-shadow-lg'
                  )}
                >
                  Lumicea
                </span>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors duration-300',
                    isScrolled ? 'text-gray-600' : 'text-white/90 drop-shadow-sm'
                  )}
                >
                  Handcrafted Excellence
                </span>
              </div>
            </Link>

            {/* Use the new dynamic navigation component for desktop */}
            <div className="hidden lg:flex items-center space-x-8">
                <NavCategories isScrolled={isScrolled} />
                <Link
                    to="/collections"
                    className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        isScrolled
                            ? 'text-gray-600 hover:text-lumicea-navy'
                            : 'text-white/90 hover:text-lumicea-gold drop-shadow-sm'
                    )}
                >
                    Collections
                </Link>
                <Link
                    to="/custom"
                    className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        isScrolled
                            ? 'text-gray-600 hover:text-lumicea-navy'
                            : 'text-white/90 hover:text-lumicea-gold drop-shadow-sm'
                    )}
                >
                    Custom Orders
                </Link>
                <Link
                    to="/size-guide"
                    className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        isScrolled
                            ? 'text-gray-600 hover:text-lumicea-navy'
                            : 'text-white/90 hover:text-lumicea-gold drop-shadow-sm'
                    )}
                >
                    Size Guide
                </Link>
                <Link
                    to="/care"
                    className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        isScrolled
                            ? 'text-gray-600 hover:text-lumicea-navy'
                            : 'text-white/90 hover:text-lumicea-gold drop-shadow-sm'
                    )}
                >
                    Care Instructions
                </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Link to="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'transition-colors duration-300 rounded-xl',
                    isScrolled
                      ? 'text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10'
                      : 'text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm'
                  )}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </Link>

              {/* User Menu */}
              {!loading && (
                <div className="hidden lg:block">
                  {user ? (
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'transition-colors duration-300 rounded-xl',
                          isScrolled
                            ? 'text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10'
                            : 'text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm'
                        )}
                      >
                        <User className="h-5 w-5" />
                        <span className="sr-only">User menu</span>
                      </Button>
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div className="p-3 border-b">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Account</p>
                            <p className="text-xs leading-none text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/account"
                            className="flex items-center p-2 rounded-md hover:bg-gray-100"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                          {(userRole === 'admin' || userRole === 'editor') && (
                            <>
                              <div className="my-1 border-t"></div>
                              <Link
                                to="/admin"
                                className="flex items-center p-2 rounded-md hover:bg-gray-100"
                              >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Admin Dashboard</span>
                              </Link>
                            </>
                          )}
                        </div>
                        <div className="p-2 border-t">
                          <button
                            className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 text-red-600"
                            onClick={handleSignOut}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'transition-colors duration-300',
                          isScrolled
                            ? 'text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10'
                            : 'text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm'
                        )}
                        asChild
                      >
                        <Link to="/login">Sign in</Link>
                      </Button>
                      <Button
                        size="sm"
                        className="lumicea-button-primary"
                        asChild
                      >
                        <Link to="/signup">Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'transition-colors duration-300 rounded-xl',
                    isScrolled
                      ? 'text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10'
                      : 'text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm'
                  )}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-lumicea-gold text-lumicea-navy text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'lg:hidden transition-colors duration-300 rounded-xl',
                      isScrolled
                        ? 'text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10'
                        : 'text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm'
                    )}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full max-w-xs pt-16 overflow-y-auto bg-white"
                >
                  <div className="flex flex-col h-full pb-10">
                    {/* Auth Section */}
                    {!loading && (
                      <div className="mb-6 px-4">
                        {user ? (
                          <div className="p-4 bg-lumicea-navy/5 rounded-lg">
                            <p className="font-medium text-gray-900">
                              Welcome back!
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                            <div className="flex space-x-2 mt-3">
                              <SheetClose asChild>
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Link to="/account">Account</Link>
                                </Button>
                              </SheetClose>
                              <Button
                                onClick={handleSignOut}
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                Sign Out
                              </Button>
                            </div>

                            {/* Admin access check */}
                            {(userRole === 'admin' || userRole === 'editor') && (
                              <div className="mt-3">
                                <SheetClose asChild>
                                  <Button
                                    asChild
                                    to="/admin"
                                    size="sm"
                                    className="w-full lumicea-button-primary"
                                  >
                                    <Link to="/admin">Admin Dashboard</Link>
                                  </Button>
                                </SheetClose>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <SheetClose asChild>
                              <Button
                                asChild
                                className="flex-1 lumicea-button-secondary"
                              >
                                <Link to="/login">Sign In</Link>
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button
                                asChild
                                className="flex-1 lumicea-button-primary"
                              >
                                <Link to="/signup">Sign Up</Link>
                              </Button>
                            </SheetClose>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Links */}
                    <div className="px-4 space-y-1 flex-1 overflow-y-auto">
                      {/* Use the new dynamic navigation component for mobile */}
                      <NavCategories isMobile={true} />
                      <div className="border-t my-2 border-gray-200"></div>
                      <SheetClose asChild>
                        <Link
                          to="/collections"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">Collections</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/custom"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">Custom Orders</span>
                        </Link>
                      </SheetClose>
                      <div className="border-t my-2 border-gray-200"></div>
                      <SheetClose asChild>
                        <Link
                          to="/about"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">About</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/blog"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">Blog</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/contact"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">Contact</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/size-guide"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">Size Guide</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/care"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">Care Instructions</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/gift-cards"
                          className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5"
                        >
                          <span className="font-medium">Gift Cards</span>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
