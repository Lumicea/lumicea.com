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
    <header
      className={cn('fixed top-0 z-50 w-full transition-all duration-500',
        isScrolled ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' : 'bg-transparent')}
    >
      {/* Top Banner - Only show when not scrolled */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "flex items-center space-x-2 transition-colors duration-300",
              isScrolled
                ? "text-lumicea-navy hover:text-lumicea-navy/80"
                : "text-white hover:text-lumicea-gold drop-shadow-sm"
            )}
          >
            <Gem className="h-6 w-6" />
            <span className="font-semibold text-lg">Lumicea</span>
          </Link>

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
                      {userRole === 'admin' && (
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
            <SheetContent side="right" className="w-[300px] max-w-full overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center space-x-2">
                  <Gem className="h-5 w-5 text-lumicea-navy" />
                  <span>Lumicea</span>
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4">
                {/* Auth Section */}
                {!loading && (
                  <div className="space-y-4">
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
                        {userRole === 'admin' && (
                          <div className="mt-2">
                            <SheetClose asChild>
                              <Button as={Link} to="/admin" size="sm" variant="outline" className="w-full text-lumicea-navy">
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
                <div className="space-y-4">
                  <SheetClose asChild>
                    <Link to="/categories/nose-rings" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center">
                          Nose Rings
                          <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
                            Popular
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Elegant nose rings in various styles</p>
                      </div>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link to="/categories/earrings" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center">
                          Earrings
                          <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
                            Popular
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Handcrafted earrings for every occasion</p>
                      </div>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link to="/collections" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
                      <div>
                        <div className="font-semibold text-gray-900">Collections</div>
                        <p className="text-sm text-gray-600 mt-1">Curated collections of our finest pieces</p>
                      </div>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link to="/custom" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
                      <div>
                        <div className="font-semibold text-gray-900">Custom Orders</div>
                        <p className="text-sm text-gray-600 mt-1">Bespoke jewelry made to your specifications</p>
                      </div>
                    </Link>
                  </SheetClose>
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <SheetClose asChild>
                    <Link to="/about" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
                      About
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/blog" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
                      Blog
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/contact" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
                      Contact
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/size-guide" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
                      Size Guide
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/care" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
                      Care Instructions
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/gift-cards" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
                      Gift Cards
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}