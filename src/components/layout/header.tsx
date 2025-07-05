import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet,
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  Search,
  ShoppingBag,
  Menu,
  User,
  LogOut,
  Settings,
  Gem,
  LayoutDashboard
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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  // Remove mobileMenuOpen state since we'll use Sheet component instead
  const navigate = useNavigate();
  const { user, userRole, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Banner - Only show when not scrolled */}
      {!isScrolled && (
        <div className="bg-gradient-to-r from-lumicea-navy via-lumicea-navy-light to-lumicea-navy text-white">
        <div className="lumicea-container py-3">
          <p className="text-center text-sm font-medium flex items-center justify-center gap-2 animate-fade-in-down">
            <Star className="h-4 w-4 text-lumicea-gold animate-pulse" />
            Free UK shipping on orders over £50 • Lifetime warranty on all pieces
            <Star className="h-4 w-4 text-lumicea-gold animate-pulse" />
          </p>
        </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-500',
          isScrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50'
            : 'bg-transparent',
          'mt-0' // Remove dynamic margin and handle in container instead
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-lumicea-gold to-lumicea-gold-light rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Gem className="h-8 w-8 text-lumicea-gold" />
                </div>
              </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/categories/nose-rings"
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isScrolled
                  ? "text-gray-600 hover:text-lumicea-navy"
                  : "text-white/90 hover:text-lumicea-gold drop-shadow-sm"
              )}
            >
              Nose Rings
            </Link>
            <Link
              to="/categories/earrings"
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isScrolled
                  ? "text-gray-600 hover:text-lumicea-navy"
                  : "text-white/90 hover:text-lumicea-gold drop-shadow-sm"
              )}
            >
              Earrings
            </Link>
            <Link
              to="/collections"
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isScrolled
                  ? "text-gray-600 hover:text-lumicea-navy"
                  : "text-white/90 hover:text-lumicea-gold drop-shadow-sm"
              )}
            >
              Collections
            </Link>
            <Link
              to="/custom"
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isScrolled
                  ? "text-gray-600 hover:text-lumicea-navy"
                  : "text-white/90 hover:text-lumicea-gold drop-shadow-sm"
              )}
            >
              Custom Orders
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
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

          {/* User Menu */}
          {!loading && (
            <div className="hidden lg:block">
              {user ? (
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
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-xs leading-none text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link to="/account" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                            {(userRole === 'admin' || 
                              user.email === 'admin@lumicea.com' || 
                              user.email === 'swyatt@lumicea.com' || 
                              user.email === 'olipg@hotmail.co.uk') && (
                        <>
                          <div className="my-1 border-t"></div>
                          <Link to="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "transition-colors duration-300",
                      isScrolled
                        ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10"
                        : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                    )}
                    onClick={() => navigate('/login')}
                  >
                    Sign in
                  </Button>
                  <Button
                    size="sm"
                    className="lumicea-button-primary"
                    onClick={() => navigate('/signup')}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative"
          >
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
              <SheetContent side="right" className="w-full max-w-xs pt-16 overflow-y-auto">
                <div className="flex flex-col h-full pb-10">
                  {/* Auth Section */}
                  {!loading && (
                    <div className="mb-6 px-4">
                      {user ? (
                        <div className="p-4 bg-lumicea-navy/5 rounded-lg">
                          <p className="font-medium text-gray-900">Welcome back!</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex space-x-2 mt-3">
                            <SheetClose asChild>
                              <Button as={Link} to="/account" size="sm" variant="outline" className="flex-1">
                                Account
                              </Button>
                            </SheetClose>
                            <Button onClick={handleSignOut} size="sm" variant="outline" className="flex-1">
                              Sign Out
                            </Button>
                          </div>
                          
                          {/* Admin access check */}
                          {(userRole === 'admin' || 
                            user.email === 'admin@lumicea.com' || 
                            user.email === 'swyatt@lumicea.com' || 
                            user.email === 'olipg@hotmail.co.uk') && (
                            <div className="mt-3">
                              <SheetClose asChild>
                                <Button as={Link} to="/admin" size="sm" className="w-full lumicea-button-primary">
                                  Admin Dashboard
                                </Button>
                              </SheetClose>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <SheetClose asChild>
                            <Button as={Link} to="/login" className="flex-1 lumicea-button-secondary">
                              Sign In
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button as={Link} to="/signup" className="flex-1 lumicea-button-primary">
                              Sign Up
                            </Button>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Navigation Links */}
                  <div className="px-4 space-y-1 flex-1 overflow-y-auto">
                    <SheetClose asChild>
                      <Link to="/categories/nose-rings" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Nose Rings</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/categories/earrings" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Earrings</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/collections" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Collections</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/custom" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Custom Orders</span>
                      </Link>
                    </SheetClose>
                    
                    <div className="border-t my-2 border-gray-200"></div>
                    
                    <SheetClose asChild>
                      <Link to="/about" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">About</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/blog" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Blog</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/contact" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Contact</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/size-guide" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Size Guide</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/care" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Care Instructions</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/gift-cards" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
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
    </>
  );
}