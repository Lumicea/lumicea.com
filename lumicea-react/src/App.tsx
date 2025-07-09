// lumicea-react/src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import ScrollToTop component
import { ScrollToTop } from '@/components/scroll-to-top';

// Import the Header component (your main site header)
import { Header } from './components/layout/header';

// Import AdminLayout
import { AdminLayout } from './components/layout/admin-layout'; // <--- Make sure this is imported!

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
import { EarringsPage } from "@/pages/categories/earrings.tsx";
import { NoseRingsPage } from "@/pages/categories/nose-rings.tsx";
import { ProductDetailPage } from "@/pages/products/detail.tsx";
import { SizeGuidePage } from "@/pages/size-guide.tsx";

// Admin Pages (these will now be children of AdminLayout)
import { AdminDashboard } from "@/pages/admin/dashboard/index.tsx";
import { AdminProductsPage } from "@/pages/admin/products/index.tsx";
import { AdminOrdersPage } from "@/pages/admin/orders/index.tsx";
import { AdminCustomersPage } from "@/pages/admin/customers/index.tsx";
import { AdminPagesPage } from "@/pages/admin/pages/index.tsx";
import { AdminBlogPage } from "@/pages/admin/blog/index.tsx";

// New Admin Page Imports based on the user's list
import  AdminCategoriesPage from "@/pages/admin/categories/index.tsx";
import { AdminBannersPage } from "@/pages/admin/banners/index.tsx";
import { AdminReturnsPage } from "@/pages/admin/returns/index.tsx";
import { AdminSeoPage } from "@/pages/admin/seo/index.tsx";
import { AdminPromotionsPage } from "@/pages/admin/promotions/index.tsx";
import { AdminCampaignsPage } from "@/pages/admin/campaigns/index.tsx";
import { AdminInventoryPage } from "@/pages/admin/inventory/index.tsx";
import { AdminShippingPage } from "@/pages/admin/shipping/index.tsx";
import { AdminSettingsPage } from "@/pages/admin/settings/index.tsx";
import { AdminMarketingPage } from "@/pages/admin/marketing/index.tsx"; // The marketing dashboard itself

// UI Components
import { CookieConsent } from './components/ui/cookie-consent.tsx';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Conditionally render your main site header */}
      {/* If your AdminLayout header handles all admin headers, you might not want this here. */}
      {/* This means the main header from ./components/layout/header will not show on admin pages. */}
      {!isAdminPage && <Header showTopBanner={true} />} 
      
      <Routes>
        {/* Public Routes (keep as is) */}
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
        <Route path="/gift-cards" element={<GiftCardsPage />} />
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
        <Route path="/categories/earrings" element={<EarringsPage />} />
        <Route path="/categories/nose-rings" element={<NoseRingsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />

        {/* --- CRITICAL CHANGE FOR ADMIN ROUTES --- */}
        {/* All admin routes are now children of the AdminLayout route */}
        <Route path="/admin" element={<AdminLayout />}> {/* <--- AdminLayout is the parent */}
          <Route index element={<AdminDashboard />} /> {/* Renders when path is exactly /admin */}
          <Route path="products" element={<AdminProductsPage />} /> {/* Renders at /admin/products */}
          <Route path="orders" element={<AdminOrdersPage />} /> {/* Renders at /admin/orders */}
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="pages" element={<AdminPagesPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          {/* Add more specific admin sub-routes if needed, e.g., product creation */}
          <Route path="products/new" element={<AdminProductsPage />} /> {/* Example: /admin/products/new */}
          {/* ... etc. for any other admin sub-routes ... */}

          {/* NEW ADMIN ROUTES */}
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="returns" element={<AdminReturnsPage />} />
          <Route path="seo" element={<AdminSeoPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="campaigns" element={<AdminCampaignsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="shipping" element={<AdminShippingPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="marketing" element={<AdminMarketingPage />} /> {/* This is the marketing dashboard */}

        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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
