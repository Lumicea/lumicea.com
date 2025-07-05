@@ .. @@
 import { useState, useEffect } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
+import { 
+  Sheet,
+  SheetContent, 
+  SheetHeader,
+  SheetTitle,
+  SheetTrigger,
+  SheetClose
+} from '@/components/ui/sheet';
 import {
   Search,
   ShoppingBag,
@@ -23,7 +32,7 @@
 export function Header() {
   const [isScrolled, setIsScrolled] = useState(false);
   const { itemCount } = useCart();
-  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
+  // Remove mobileMenuOpen state since we'll use Sheet component instead
   const navigate = useNavigate();
-  const { user, signOut, loading } = useAuth();
+  const { user, userRole, signOut, loading } = useAuth();
 
@@ .. @@
-      className={cn(
-        'fixed top-0 z-50 w-full transition-all duration-500',
-        isScrolled
-          ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50'
-          : 'bg-transparent',
-        'w-full max-w-[100vw]' // Removed overflow-x-hidden
-      )}
+      className={cn('fixed top-0 z-50 w-full transition-all duration-500',
+        isScrolled ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' : 'bg-transparent')}
     >
       {/* Top Banner - Only show when not scrolled */}
@@ -168,7 +177,7 @@
                         <Settings className="mr-2 h-4 w-4" />
                         <span>Settings</span>
                       </Link>
-                      {user.email === 'admin@lumicea.com' && (
+                      {userRole === 'admin' && (
                         <>
                           <div className="my-1 border-t"></div>
                           <Link to="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-100">
@@ .. @@
             </Link>
 
             {/* Mobile Menu */}
-            <Button
-              variant="ghost"
-              size="icon"
-              className={cn(
-                "lg:hidden transition-colors duration-300 rounded-xl",
-                isScrolled
-                  ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10"
-                  : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
-              )}
-              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
-            >
-              <Menu className="h-5 w-5" />
-              <span className="sr-only">Open menu</span>
-            </Button>
+            <Sheet>
+              <SheetTrigger asChild>
+                <Button
+                  variant="ghost"
+                  size="icon"
+                  className={cn(
+                    "lg:hidden transition-colors duration-300 rounded-xl",
+                    isScrolled
+                      ? "text-gray-600 hover:text-lumicea-navy hover:bg-lumicea-navy/10"
+                      : "text-white hover:text-lumicea-gold hover:bg-white/10 drop-shadow-sm"
+                  )}
+                >
+                  <Menu className="h-5 w-5" />
+                  <span className="sr-only">Open menu</span>
+                </Button>
+              </SheetTrigger>
+              <SheetContent side="right" className="w-[300px] max-w-full overflow-y-auto">
+                <SheetHeader className="mb-4">
+                  <SheetTitle className="flex items-center space-x-2">
+                    <Gem className="h-5 w-5 text-lumicea-navy" />
+                    <span>Lumicea</span>
+                  </SheetTitle>
+                </SheetHeader>
+                <div className="space-y-4">
+                  {/* Auth Section */}
+                  {!loading && (
+                    <div className="space-y-4">
+                      {user ? (
+                        <div className="p-4 bg-lumicea-navy/5 rounded-lg">
+                          <p className="font-medium text-gray-900">Welcome back!</p>
+                          <p className="text-sm text-gray-600">{user.email}</p>
+                          <div className="flex space-x-2 mt-3">
+                            <SheetClose asChild>
+                              <Button as={Link} to="/account" size="sm" variant="outline" className="flex-1">
+                                Account
+                              </Button>
+                            </SheetClose>
+                            <Button onClick={handleSignOut} size="sm" variant="outline" className="flex-1">
+                              Sign Out
+                            </Button>
+                          </div>
+                          {userRole === 'admin' && (
+                            <div className="mt-2">
+                              <SheetClose asChild>
+                                <Button as={Link} to="/admin" size="sm" variant="outline" className="w-full text-lumicea-navy">
+                                  Admin Dashboard
+                                </Button>
+                              </SheetClose>
+                            </div>
+                          )}
+                        </div>
+                      ) : (
+                        <div className="flex space-x-2">
+                          <SheetClose asChild>
+                            <Button as={Link} to="/login" className="flex-1 lumicea-button-secondary">
+                              Sign In
+                            </Button>
+                          </SheetClose>
+                          <SheetClose asChild>
+                            <Button as={Link} to="/signup" className="flex-1 lumicea-button-primary">
+                              Sign Up
+                            </Button>
+                          </SheetClose>
+                        </div>
+                      )}
+                    </div>
+                  )}
+                  
+                  {/* Navigation Links */}
+                  <div className="space-y-4">
+                    <SheetClose asChild>
+                      <Link to="/categories/nose-rings" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
+                        <div>
+                          <div className="font-semibold text-gray-900 flex items-center">
+                            Nose Rings
+                            <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
+                              Popular
+                            </Badge>
+                          </div>
+                          <p className="text-sm text-gray-600 mt-1">Elegant nose rings in various styles</p>
+                        </div>
+                      </Link>
+                    </SheetClose>
+                    
+                    <SheetClose asChild>
+                      <Link to="/categories/earrings" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
+                        <div>
+                          <div className="font-semibold text-gray-900 flex items-center">
+                            Earrings
+                            <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
+                              Popular
+                            </Badge>
+                          </div>
+                          <p className="text-sm text-gray-600 mt-1">Handcrafted earrings for every occasion</p>
+                        </div>
+                      </Link>
+                    </SheetClose>
+                    
+                    <SheetClose asChild>
+                      <Link to="/collections" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
+                        <div>
+                          <div className="font-semibold text-gray-900">Collections</div>
+                          <p className="text-sm text-gray-600 mt-1">Curated collections of our finest pieces</p>
+                        </div>
+                      </Link>
+                    </SheetClose>
+                    
+                    <SheetClose asChild>
+                      <Link to="/custom" className="flex items-start p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
+                        <div>
+                          <div className="font-semibold text-gray-900">Custom Orders</div>
+                          <p className="text-sm text-gray-600 mt-1">Bespoke jewelry made to your specifications</p>
+                        </div>
+                      </Link>
+                    </SheetClose>
+                  </div>
+                  
+                  <div className="border-t border-gray-200 pt-4 space-y-2">
+                    <SheetClose asChild>
+                      <Link to="/about" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
+                        About
+                      </Link>
+                    </SheetClose>
+                    <SheetClose asChild>
+                      <Link to="/blog" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
+                        Blog
+                      </Link>
+                    </SheetClose>
+                    <SheetClose asChild>
+                      <Link to="/contact" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
+                        Contact
+                      </Link>
+                    </SheetClose>
+                    <SheetClose asChild>
+                      <Link to="/size-guide" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
+                        Size Guide
+                      </Link>
+                    </SheetClose>
+                    <SheetClose asChild>
+                      <Link to="/care" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
+                        Care Instructions
+                      </Link>
+                    </SheetClose>
+                    <SheetClose asChild>
+                      <Link to="/gift-cards" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
+                        Gift Cards
+                      </Link>
+                    </SheetClose>
+                  </div>
+                </div>
+              </SheetContent>
+            </Sheet>
           </div>
         </div>
       </div>
-      
-      {/* Mobile Menu Content */}
-      <div className={`lg:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
-        <div className="p-4 space-y-4">
-          {/* Auth Section */}
-          {!loading && (
-            <div className="space-y-4">
-              {user ? (
-                <div className="p-4 bg-lumicea-navy/5 rounded-lg">
-                  <p className="font-medium text-gray-900">Welcome back!</p>
-                  <p className="text-sm text-gray-600">{user.email}</p>
-                  <div className="flex space-x-2 mt-3">
-                    <Button size="sm" variant="outline" className="flex-1">
-                      <Link to="/account">Account</Link>
-                    </Button>
-                    <Button onClick={handleSignOut} size="sm" variant="outline" className="flex-1">
-                      Sign Out
-                    </Button>
-                  </div>
-                </div>
-              ) : (
-                <div className="flex space-x-2">
-                  <Button as={Link} to="/login" className="flex-1 lumicea-button-secondary">
-                    Sign In
-                  </Button>
-                  <Button as={Link} to="/signup" className="flex-1 lumicea-button-primary">
-                    Sign Up
-                  </Button>
-                </div>
-              )}
-            </div>
-          )}
-          
-          <div className="space-y-4">
-            <Link to="/categories/nose-rings" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
-              <div>
-                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
-                  Nose Rings
-                </span>
-                <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
-                  Popular
-                </Badge>
-                <p className="text-sm text-gray-600 mt-1">Elegant nose rings in various styles and materials</p>
-              </div>
-            </Link>
-            
-            <Link to="/categories/earrings" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
-              <div>
-                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
-                  Earrings
-                </span>
-                <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy text-xs">
-                  Popular
-                </Badge>
-                <p className="text-sm text-gray-600 mt-1">Handcrafted earrings for every occasion</p>
-              </div>
-            </Link>
-            
-            <Link to="/collections" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
-              <div>
-                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
-                  Collections
-                </span>
-                <p className="text-sm text-gray-600 mt-1">Curated collections of our finest pieces</p>
-              </div>
-            </Link>
-            
-            <Link to="/custom" className="flex items-center justify-between p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors group">
-              <div>
-                <span className="font-semibold text-gray-900 group-hover:text-lumicea-navy transition-colors">
-                  Custom Orders
-                </span>
-                <p className="text-sm text-gray-600 mt-1">Bespoke jewelry made to your specifications</p>
-              </div>
-            </Link>
-          </div>
-          
-          <div className="border-t border-gray-200 pt-4 space-y-2">
-            <Link to="/about" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
-              About
-            </Link>
-            <Link to="/blog" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
-              Blog
-            </Link>
-            <Link to="/contact" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
-              Contact
-            </Link>
-            <Link to="/size-guide" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
-              Size Guide
-            </Link>
-            <Link to="/care" className="block p-3 rounded-xl hover:bg-lumicea-navy/5 transition-colors font-medium text-gray-700 hover:text-lumicea-navy">
-              Care Instructions
-            </Link>
-          </div>
-        </div>
-      </div>
     </header>
   );
 }