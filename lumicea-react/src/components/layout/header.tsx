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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' // Removed mt-0, which was redundant, and mt-12 if it was here
          : 'bg-transparent', // Removed mt-12 from here
        'w-full max-w-[100vw] overflow-x-hidden'
      )}
    >
      {/* Top Banner - Only show when not scrolled */}
      <div className={cn(
        'transition-all duration-500 overflow-hidden bg-gradient-to-r from-lumicea-navy via-lumicea-navy-light to-lumicea-navy text-white',
        isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'
      )}>
        <div className="lumicea-container py-3">
          <p className="text-center text-sm font-medium flex items-center justify-center gap-2 animate-fade-in-down">
            <Star className="h-4 w-4 text-lumicea-gold animate-pulse" />
            Free UK shipping on orders over £50 • Lifetime warranty on all pieces
            <Star className="h-4 w-4 text-lumicea-gold animate-pulse" />
          </p>
        </div>
      </div>

      {/* Main Navigation Bar Content */}
      <div className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8",
        isScrolled ? 'pt-0' : 'pt-12' // Dynamically adjust padding
      )}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-lumicea-gold to-lumicea-gold-light rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-lumicea-navy to-lumicea-navy-light p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Gem className="h-8 w-8 text-lumicea-gold" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-2xl md:text-3xl font-bold transition-colors duration-300",
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
            <nav className="flex items-center space-x-6">
              <div className="relative group">
                <button
                  className={cn(
                    "text-base font-medium transition-colors duration-300 hover:text-lumicea-navy bg-transparent",
                    isScrolled ? "text-gray-700" : "text-white hover:text-lumicea-gold drop-shadow-sm"
                  )}
                >
                  Shop
                </button>
                <div className="absolute left-0 top-full mt-2 w-[500px] p-6 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                      <ul className="space-y-3">
                        <li>
                          <Link to="/categories/nose-rings" className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium text-gray-900">Nose Rings</div>
                              <div className="text-sm text-gray-600">Elegant nose rings in various styles</div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link to="/categories/earrings" className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium text-gray-900">Earrings</div>
                              <div className="text-sm text-gray-600">Handcrafted earrings for every occasion</div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link to="/collections" className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium text-gray-900">Collections</div>
                              <div className="text-sm text-gray-600">Curated collections of our finest pieces</div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link to="/custom" className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium text-gray-900">Custom Orders</div>
                              <div className="text-sm text-gray-600">Bespoke jewelry made to your specifications</div>
                            </div>
                          </Link>
                        </li>
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
              </div>
              
              <Link to="/about" className={cn(
                "text-base font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10",
                isScrolled
                  ? "text-gray-700 hover:text-lumicea-navy hover:bg-lumicea-navy/5"
                  : "text-white hover:text-lumicea-gold drop-shadow-sm"
              )}>
                About
              </Link>
              
              <Link to="/blog" className={cn(
                "text-base font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10",
                isScrolled
                  ? "text-gray-700 hover:text-lumicea-navy hover:bg-lumicea-navy/5"
                  : "text-white hover:text-lumicea-gold drop-shadow-sm"
              )}>
                Blog
              </Link>
              
              <Link to="/contact" className={cn(
                "text-base font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10",
                isScrolled
                  ? "text-gray-700 hover:text-lumicea-navy hover:bg-lumicea-navy/5"
                  : "text-white hover:text-lumicea-gold drop-shadow-sm"
              )}>
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search */}
            <Link to="/search">
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
            </Link>

            {/* Account Dropdown or Login Button */}
            {!loading && (
              user ? (
                <div className="relative group">
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
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-3 border-b">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.email}
                        </p>
                        <p className="text-xs leading-none text-gray-500">
                          Welcome back!
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link to="/account" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </Link>
                      <Link to="/orders" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link to="/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      {user.email === 'admin@lumicea.com' && (
                        <>
                          <div className="my-1 border-t"></div>
                          <Link to="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="p-2 border-t">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "transition-colors duration-300",
                      isScrolled
                        ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10"
                        : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
                    )}
                  >
                    Sign In
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    size="sm"
                    className={cn(
                      "transition-colors duration-300",
                      isScrolled
                        ? "lumicea-button-primary"
                        : "bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light shadow-lg"
                    )}
                  >
                    Sign Up
                  </Button>
                </div>
              )
            )}

            {/* Wishlist */}
            <Link to="/wishlist">
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
            </Link>

            {/* Cart */}
            <Link to="/cart">
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
                    variant="default"
                    className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light animate-pulse"
                  >
                    {itemCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden transition-colors duration-300 rounded-xl",
                isScrolled
                  ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10"
                  : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Content */}
      <div className={`lg:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="p-4 space-y-4">
          {/* Auth Section */}
          {!loading && (
            <div className="space-y-4">
              {user ? (
                <div className="p-4 bg-lumicea-navy/5 rounded-lg">
                  <p className="font-medium text-gray-900">Welcome back!</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Link to="/account">Account</Link>
                    </Button>
                    <Button onClick={handleSignOut} size="sm" variant="outline" className="flex-1">
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button className="flex-1 lumicea-button-secondary">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="flex-1 lumicea-button-primary">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <Link to="/categories/nose-rings" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
                  Nose Rings
                </span>
                <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
                  Popular
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Elegant nose rings in various styles and materials</p>
              </div>
            </Link>
            
            <Link to="/categories/earrings" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
                  Earrings
                </span>
                <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
                  Popular
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Handcrafted earrings for every occasion</p>
              </div>
            </Link>
            
            <Link to="/collections" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
                  Collections
                </span>
                <p className="text-sm text-gray-600 mt-1">Curated collections of our finest pieces</p>
              </div>
            </Link>
            
            <Link to="/custom" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
                  Custom Orders
                </span>
                <p className="text-sm text-gray-600 mt-1">Bespoke jewelry made to your specifications</p>
              </div>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <Link to="/about" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
              About
            </Link>
            <Link to="/blog" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
              Blog
            </Link>
            <Link to="/contact" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}