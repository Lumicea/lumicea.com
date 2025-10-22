// lumicea-react/src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <-- ADDED useState and useEffect
import { cn } from '@/lib/utils'; // <-- ADDED cn utility

// Import ScrollToTop component
import { ScrollToTop } from '@/components/scroll-to-top';

// Import the Header component (your main site header)
import { Header } from './components/layout/header';

// Import AdminLayout
import { AdminLayout } from './components/layout/admin-layout'; 

// Pages (keeping your existing imports, just showing where AdminLayout fits)
import { HomePage } from "@/pages/home/index.tsx";
import { NotFoundPage } from "@/pages/not-found/index.tsx";
import { CartPage } from "@/pages/cart/index.tsx";
import { CheckoutPage } from "@/pages/checkout/index.tsx";
import { WishlistPage } from "@/pages/wishlist/index.tsx";
import { SearchPage } from "@/pages/search/index.tsx";
import { GiftCardsPage } from "@/pages/gift-cards/index.tsx";
import { ShippingPage } from "@/pages/shipping.tsx";
import { FAQPage } from "@/pages/faq.tsx";
import { StoryPage } from "@/pages/story.tsx";
import { SustainabilityPage } from "@/pages/sustainability.tsx";
import { CareersPage } from "@/pages/careers.tsx";
import { AccessibilityPage } from "@/pages/accessibility.tsx";
import { CheckoutSuccessPage } from "@/pages/checkout/success/index.tsx";
import { AboutPage } from "@/pages/about.tsx";
import { BlogPage } from "@/pages/blog.tsx";
import { ContactPage } from "@/pages/contact.tsx";
import { CustomPage } from "@/pages/custom.tsx";
import { CarePage } from "@/pages/care.tsx";
import { CollectionsPage } from "@/pages/collections.tsx";
import { SettingsPage } from "@/pages/settings.tsx";
import { LoginPage } from "@/pages/auth/login.tsx";
import { SignupPage } from "@/pages/auth/signup.tsx";
import { PrivacyPage } from "@/pages/legal/privacy.tsx";
import { CookiesPage } from "@/pages/legal/cookies.tsx";
import { TermsPage } from "@/pages/legal/terms.tsx";
import { ProductDetailPage } from "@/pages/products/detail.tsx";
import { SizeGuidePage } from "@/pages/size-guide.tsx";

// --- ADDED new dynamic category page ---
import { CategoryPage } from "@/pages/categories/index.tsx";


// Admin Pages (these will now be children of AdminLayout)
import { AdminDashboard } from "@/pages/admin/dashboard/index.tsx";
import { AdminProductsPage } from "@/pages/admin/products/index.tsx";
import { AdminOrdersPage } from "@/pages/admin/orders/index.tsx";
import { AdminCustomersPage } from "@/pages/admin/customers/index.tsx";
import { AdminPagesPage } from "@/pages/admin/pages/index.tsx";
import { AdminBlogPage } from "@/pages/admin/blog/index.tsx";

// New Admin Page Imports based on the user's list
import  AdminCategoriesPage from "@/pages/admin/categories/index.tsx";
import  AdminBannersPage  from "@/pages/admin/banners/index.tsx";
import  AdminReturnsPage  from "@/pages/admin/returns/index.tsx";
import  AdminSeoPage  from "@/pages/admin/seo/index.tsx";
import  AdminPromotionsPage  from "@/pages/admin/promotions/index.tsx";
import  AdminCampaignsPage  from "@/pages/admin/campaigns/index.tsx";
import  AdminInventoryPage  from "@/pages/admin/inventory/index.tsx";
import  AdminShippingPage  from "@/pages/admin/shipping/index.tsx";
import  AdminSettingsPage  from "@/pages/admin/settings/index.tsx";
import AdminAnalyticsPage from "@/pages/admin/analytics/index.tsx";
import  AdminMarketingPage  from "@/pages/admin/marketing/index.tsx"; // The marketing dashboard itself

// UI Components
import { CookieConsent } from './components/ui/cookie-consent.tsx';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // --- START: DYNAMIC PADDING LOGIC ---
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Only add scroll listener for public pages
    if (!isAdminPage) {
      window.addEventListener('scroll', handleScroll);
      // Set initial state
      handleScroll();
    }

    // Cleanup listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminPage]); // Re-run effect if we navigate between public/admin

  // The header component's showTopBanner prop is hardcoded to true.
  // When not scrolled, we need padding for the banner + nav (h-20).
  // h-20 (80px) + banner (approx 44-48px) = ~128px. 'pt-32' (8rem/128px) is correct.
  // When scrolled, we just need padding for the nav (h-20). 'pt-20' (5rem/80px) is correct.
  
  const topPaddingClass = isAdminPage
    ? '' // No padding for admin area
    : isScrolled
    ? 'pt-20' // Scrolled state: padding for h-20 nav bar
    : 'pt-32'; // Initial state: padding for banner + h-20 nav bar
  // --- END: DYNAMIC PADDING LOGIC ---


  // --- OLD LOGIC (FOR REFERENCE) ---
  // const topPaddingClass = isAdminPage ? '' : 'pt-30';

  return (
    <>
      {/* Conditionally render your main site header */}
      {!isAdminPage && <Header showTopBanner={true} />}

      {/* Main content area with DYNAMIC padding applied */}
      <main className={cn(
        'transition-all duration-500', // Match header's collapse animation
        topPaddingClass
      )}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="/care" element={<CarePage />} />
          {/* <Route path="/gift-cards" element={<GiftCardsPage />} /> Duplicate removed */}
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          <Route path="/legal/cookies" element={<CookiesPage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="pages" element={<AdminPagesPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="products/new" element={<AdminProductsPage />} />
            <Route path="products/:id" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="returns" element={<AdminReturnsPage />} />
            <Route path="seo" element={<AdminSeoPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="campaigns" element={<AdminCampaignsPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="shipping" element={<AdminShippingPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="marketing" element={<AdminMarketingPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <CookieConsent />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
